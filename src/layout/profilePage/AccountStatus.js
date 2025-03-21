import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import KYCVerification from "../../component/KYCVerification";
import { SimpleCheckIcon, CloseIcon } from "../../component/SVGIcon";
import {
  userDetails,
  userGetData
} from "../../store/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideAddress } from "../../utils";

export const AccountStatus = () => {
  const acAddress = useSelector(userDetails);
  const dispatch = useDispatch();
  const [getUser, setGetUser] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (acAddress?.userid) {
        try {
          const user = await dispatch(userGetData(acAddress.userid)).unwrap();
          setGetUser(user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Handle error or dispatch notification as needed
        }
      }
    };
  
    fetchUserData(); // Call the async function inside useEffect
  
  }, [acAddress?.userid]);

  const [modalShow, setModalShow] = useState(false);
  const [kycSubmitted,setKYCSubmitted]= useState(false);
  const modalToggle = async () => {
    setModalShow(!modalShow);
  };
  return (
    <Row>
      <Col xl="12" lg="6">
        <Card body className="cards-dark your-account-status">
          <Card.Title as="h2">Your Account Status</Card.Title>
          <div className="btns-Verified">
            <Badge bg="success">
              Email Verified{" "}
              <span className="verify-status">
                <SimpleCheckIcon width="10" height="8" />
              </span>
            </Badge>
            {(getUser && getUser?.kyc_verify === 0 || kycSubmitted === true) && (
              <Badge bg="info" className="kyc-status">
                Submit KYC{" "}
              </Badge>
            )}
            {(getUser && getUser?.kyc_verify === 1 && kycSubmitted === false) && (
              <Badge bg="info" className="kyc-status">
                KYC Verified{" "}
                <span className="verify-status">
                  <SimpleCheckIcon width="10" height="8" />
                </span>
              </Badge>
            )}
            {(getUser && getUser?.kyc_verify === 2 && kycSubmitted === false ) && (
              <>
                <Badge bg="danger" className="kyc-status">
                  KYC Rejected{" "}
                  <span className="verify-status">
                    <CloseIcon width="30" height="30" />
                  </span>
                </Badge>
              </>
            )}
          </div>
          <h4 className="mb-3">Receiving Wallet</h4>
          <h4>
            {acAddress && getUser && <span>{hideAddress(acAddress?.account, 5)}</span>}{" "}
            <Link to="#/">EDIT</Link>
          </h4>
        </Card>
      </Col>
      <Col xl="12" lg="6">
        <Card body className="cards-dark kyc-verification">
          <Card.Title as="h2">Identity Verification - KYC</Card.Title>
          <Card.Text>
            To comply with regulation, participant will have to go through
            identity verification.
            {(getUser?.kyc_status === false && kycSubmitted === false) && (
            <>You have not submitted your documents to verify your identity (KYC).</>
            )}
            {(getUser?.kyc_status === true || kycSubmitted === true) &&
            (getUser && getUser?.kyc_verify === 2 && kycSubmitted === false) && 
            (<>You have not submitted your documents to verify your identity (KYC).</>)
            }
          </Card.Text>

          {(getUser?.kyc_status === true || kycSubmitted === true) &&
            ((getUser && getUser?.kyc_verify === 1 && kycSubmitted === false) ? (
              <Button variant="success" disabled>
                Your KYC Details has been approved
              </Button>
            ) : (getUser && getUser?.kyc_verify === 2 && kycSubmitted === false) ? (
              <Button variant="primary" onClick={modalToggle}>
                Click to Proceed
              </Button>
            ) : (getUser && getUser?.kyc_verify === 0 || kycSubmitted === true) ? (
              <Button variant="warning" disabled>
                Your KYC Details is Under Review
              </Button>
            ) : null)}

          {(getUser?.kyc_status === false && kycSubmitted === false) && (
            <Button variant="primary" onClick={modalToggle}>
              Click to Proceed
            </Button>
          )}
        </Card>
      </Col>
      {/* here we have call kyc verification popup */}
      <KYCVerification
        show={
          ((getUser?.kyc_status === true &&
            getUser && getUser?.kyc_verify === 2) ||
            getUser?.kyc_status === false) &&
          modalShow
        }
        onHide={() => setModalShow(false)}
        setkycsubmitted={setKYCSubmitted}
      />
    </Row>
  );
};

export default AccountStatus;
