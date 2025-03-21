import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthRoute from "./AuthRoute";
import Header from "./component/Header";
import LoginView from "./component/Login";
import Sidebar from "./component/Sidebar";
import TwoFAvalidate from "./component/TwoFAvalidate";
import BuyTokenComponent from "./layout/BuyTokenComponent";
import DashboardComponent from "./layout/DashboardComponent";
import IcoDistributionComponent from "./layout/IcoDistributionComponent";
import ProfileComponent from "./layout/ProfileComponent";
import StakeScallopComponent from "./layout/StakeScallopComponent";
import TransactionComponent from "./layout/TransactionComponent";
import SnackBar from "./snackBar";
import {
  getCountryDetails,
  userDetails,
  userGetData,
} from "./store/slices/AuthSlice";
import { checkCurrentSale } from "./store/slices/currencySlice";
import { database, firebaseMessages } from "./config";
import { onValue, ref, get, update } from "firebase/database";
import {
  notificationFail
} from "./store/slices/notificationSlice";
import moment from "moment";
import * as flatted from "flatted";
import { useLocation } from "react-router-dom";
import { getTransaction , clearTransactions} from "./store/slices/transactionSlice";
import TwoFATwilioValidate from "./component/TwoFATwilioValidate";
import jwtAxios from "./service/jwtAxios";

let PageSize = 5;

export const App = () => {
  // Inside your component
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const sidebarToggle = () => setIsOpen(!isOpen);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isSign, setIsSign] = useState(null);
  const acAddress = useSelector(userDetails);
  const [twoFAModal, setTwoFAModal] = useState(true);
  const [isResponsive, setIsResponsive] = useState(false);
  const [getUser, setGetUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [twoFATwilioModal, setTwoFATwilioModal] = useState(false);
  const [isTOTPTriggered, setIsTOTPTriggered] = useState(false);
  const hasRun = useRef(false);
  const handleAccountAddress = (address) => {
    setIsSign(false);
  };
  const { transactions, totalTransactionsCount, transactionLoading } =
    useSelector((state) => state.transactions);
  const [typeFilter, setTypeFilter] = useState(
    flatted.parse(flatted.stringify([]))
  );
  const [statusFilter, setStatusFilter] = useState(
    flatted.parse(flatted.stringify([]))
  );

  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is below a specific breakpoint (e.g., 768px)
      setIsResponsive(window.innerWidth < 768);
    };

    handleResize();
    // Add an event listener to track window size changes
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const signOut = () => {
    dispatch(clearTransactions());
    setIsSign(true);
    setTwoFATwilioModal(false);
    setIsTOTPTriggered(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!acAddress?.userid) return;
  
        const user = await dispatch(userGetData(acAddress.userid)).unwrap();
        setGetUser(user);
  
        // Dispatch other required actions
        dispatch(getCountryDetails());
        dispatch(checkCurrentSale());
  
        // Set up Firebase listener
        const childKey = `${firebaseMessages.ICO_USERS}/${acAddress.userid}`;
        const setReceiverReadCountNode = ref(database, childKey);
  
        const unsubscribe = onValue(setReceiverReadCountNode, (snapshot) => {
          if (snapshot?.val() && localStorage.getItem("token")) {
            const findUser = snapshot.val();
            if (!findUser.is_active || findUser.is_delete) {
              signOut();
            }
          }
        });
  
        // Return cleanup function
        return unsubscribe;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    const unsubscribe = fetchUserData();
  
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [acAddress?.userid, dispatch]);

  useEffect(() => {
    if (getUser && getUser?.length !== 0) {
      if (hasRun.current) return;
      if (getUser && getUser?.is_2FA_verified === false) {
        setTwoFAModal(true);
        hasRun.current = true;
      } else if (
        getUser &&
        getUser?.is_2FA_twilio_login_verified === false &&
        getUser?.is_2FA_verified === true &&
        getUser?.phoneCountry &&
        getUser?.phone &&
        getUser?.is_2FA_SMS_enabled
      ) {
        const isTOTPTriggeredFromStorage =
          localStorage.getItem("isTOTPTriggered") === "true";
        if (isTOTPTriggeredFromStorage) {
          setTwoFATwilioModal(true);
        } else {
          handleLoginSuccess(getUser?.phone, getUser?.phoneCountry);
        }
        hasRun.current = true;
      }
    } else {
      hasRun.current = false;
    }
  }, [getUser]);

  useEffect(() => {
    if (location.pathname === "/" && acAddress.authToken) {
      dispatch(
        getTransaction({
          currentPage,
          pageSize: PageSize,
          typeFilter,
          statusFilter,
        })
      );
    }
  }, [
    location.pathname,
    acAddress.authToken,
    currentPage,
    typeFilter,
    statusFilter,
    dispatch,
  ]);

  useEffect(() => {
    const userRef = ref(database, firebaseMessages?.ICO_TRANSACTIONS);
  
    const processTransaction = (key, value, message, updateData) => {
      if (message) {
        dispatch(notificationFail(message));
      }
      dispatch(
        getTransaction({
          currentPage,
          pageSize: PageSize,
          typeFilter,
          statusFilter,
        })
      );
      const userUpdateRef = ref(database, `${firebaseMessages?.ICO_TRANSACTIONS}/${key}`);
      update(userUpdateRef, { lastActive: Date.now(), ...updateData });
    };
  
    const updateLastActive = async () => {
      try {
        const snapshot = await get(userRef);
        if (!snapshot.exists()) return;
  
        const transactions = snapshot.val();
        const currentMoment = moment.utc();
  
        Object.entries(transactions).forEach(([key, value]) => {
          if (value.user_wallet_address === acAddress?.account) {
            const dateMoment = moment.utc(value?.lastActive);
            const differenceInMinutes = currentMoment.diff(dateMoment, "minutes");
  
            if (differenceInMinutes < 1) {
              if (!value.is_pending && !value.is_open) {
                if (value.status === "pending") {
                  processTransaction(key, value, "Outside Transaction Pending", { is_pending: true });
                } else if (value.status === "failed") {
                  processTransaction(key, value, "Outside Transaction Failed", { is_pending: true });
                }
              }
  
              if (value.is_pending && !value.is_open && value.status === "paid") {
                processTransaction(key, value, "Outside Transaction Successful", { is_open: true });
              }
            }
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const handleActivity = () => updateLastActive();
  
    const interval = setInterval(updateLastActive, 5000); // Polling interval
  
    const events = ["beforeunload", "mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, handleActivity));
  
    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [acAddress?.userid]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [location.pathname]);

  
  const handleLoginSuccess = async (phoneNumber, phoneCountry) => {
    if (phoneNumber && phoneCountry) {
      try {
        const response = await jwtAxios.post("users/sendTOTP", {
          phone: phoneNumber,
          phoneCountry: phoneCountry,
        });

        if (response?.data?.sid) {
          setIsTOTPTriggered(true);
          setTwoFATwilioModal(true);
          localStorage.setItem("isTOTPTriggered", "true");
          const expiryTime = Date.now() + 20 * 1000; // 20 seconds from now
          localStorage.setItem("expiryTime", expiryTime.toString());
        } else {
          setTwoFATwilioModal(false);
          setIsTOTPTriggered(false);
          signOut();
        }
      } catch (error) {
        dispatch(
          notificationFail(
            error?.response?.data?.message || "Something Went Wrong"
          )
        );
        signOut();
      }
    }
  };

  return (
    <>
      <Container fluid="xxl" className={`${isOpen ? "open-sidebar" : ""} p-0`}>
        <ToastContainer />
        <SnackBar />
        <Sidebar
          getUser={getUser}
          clickHandler={sidebarToggle}
          setIsOpen={setIsOpen}
          setModalShow={setModalShow}
          isResponsive={isResponsive}
        />
        <div className="wrapper">
          <Header
            getUser={getUser}
            clickHandler={sidebarToggle}
            clickModalHandler={modalToggle}
            signOut={signOut}
          />
          <div className="contain">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <DashboardComponent
                      getUser={getUser}
                      transactionLoading={transactionLoading}
                    />
                    {twoFAModal === true &&
                      getUser &&
                      getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate
                          setTwoFAModal={setTwoFAModal}
                          getUser={getUser}
                          setGetUser={setGetUser}
                          istotptriggered={isTOTPTriggered}
                          settwofatwiliomodal={setTwoFATwilioModal} 
                          setistotptriggered={setIsTOTPTriggered}
                          handleLoginSuccess={handleLoginSuccess}
                        />
                      )}
                    {getUser &&
                      getUser?.is_2FA_twilio_login_verified === false && twoFATwilioModal && getUser?.is_2FA_verified === true &&(
                        <TwoFATwilioValidate 
                          settwofatwiliomodal={setTwoFATwilioModal} 
                          setistotptriggered={setIsTOTPTriggered}
                          handleLoginSuccess={handleLoginSuccess}
                          setGetUser={setGetUser}
                        />
                      )}
                  </>
                }
              />
              <Route
                path="/buy-token"
                element={
                  <>
                    <BuyTokenComponent />
                    {twoFAModal === true &&
                      getUser &&
                      getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate
                          setTwoFAModal={setTwoFAModal}
                          getUser={getUser}
                          setGetUser={setGetUser}
                        />
                      )}
                  </>
                }
              />
              <Route
                path="/ico-distribution"
                element={
                  <>
                    <IcoDistributionComponent />
                    {twoFAModal === true &&
                      getUser &&
                      getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate
                          setTwoFAModal={setTwoFAModal}
                          getUser={getUser}
                          setGetUser={setGetUser}
                        />
                      )}
                  </>
                }
              />
              <Route
                path="/staking"
                element={
                  <>
                    <StakeScallopComponent />
                    {twoFAModal === true &&
                      getUser &&
                      getUser?.is_2FA_verified === false && (
                        <TwoFAvalidate
                          setTwoFAModal={setTwoFAModal}
                          getUser={getUser}
                          setGetUser={setGetUser}
                        />
                      )}
                  </>
                }
              />
              <Route
                path="/transaction"
                element={
                  <>
                    <AuthRoute>
                      <TransactionComponent
                        transactionLoading={transactionLoading}
                        totalTransactionsCount={totalTransactionsCount}
                        setTypeFilter={setTypeFilter}
                        setStatusFilter={setStatusFilter}
                        typeFilter={typeFilter}
                        statusFilter={statusFilter}
                        PageSize={PageSize}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                      />
                    </AuthRoute>
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <AuthRoute>
                      <ProfileComponent />
                    </AuthRoute>
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Container>
      <LoginView
        setGetUser={setGetUser}
        show={modalShow}
        onHide={() => setModalShow(false)}
        handleaccountaddress={handleAccountAddress}
        issign={isSign}
        settwofamodal={setTwoFAModal}
      />
    </>
  );
};

export default App;
