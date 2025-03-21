import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import jwtAxios from "../service/jwtAxios";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import { useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { userGetFullDetails, userGetData , logoutAuth} from "../store/slices/AuthSlice";

const DigitInput = styled.input`
  width: 30px;
  height: 30px;
  font-size: 16px;
  text-align: center;
  border: none;
  border-bottom: 2px solid #000;
  margin: 0 5px;
  outline: none;
`;

const TimerText = styled.p`
  margin-top: 10px;
  color: #888;
`;

const ErrorText = styled.p`
  color: #f76161;
  margin-top: 10px;
`;

const TwoFATwilioValidate = (props) => {
  const userData = useSelector(userGetFullDetails);
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [numIndex, setNumIndex] = useState("");
  const navigate = useNavigate();
  const { deactivate } = useWeb3React();
  const { address } = useParams();
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(20); // 20-second timer
  const [otpValue, setOTPValue] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [resendMessage, setResendMessage] = useState(false); // Show resend message
  const [lastAttemptTime, setLastAttemptTime] = useState(
      localStorage.getItem("lastAttemptTime") || ""
  );
  const [invalidAttempts, setInvalidAttempts] = useState(
    Number(localStorage.getItem("invalidAttempts")) || 0
  );

  useEffect(() => {
    const savedExpiryTime = localStorage.getItem("expiryTime");
    if (savedExpiryTime) {
      const remainingTime = Math.floor((savedExpiryTime - Date.now()) / 1000);
      if (remainingTime > 0) {
        setTimer(remainingTime);
        setIsTimerActive(true);
        setResendMessage(false);
      } else {
        setIsTimerActive(false);
        setResendMessage(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "lastAttemptTime" || event.key === "invalidAttempts" || event.key === "expiryTime") {
          logoutUser();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (invalidAttempts >= 3 && now - lastAttemptTime < 5 * 60 * 1000) {
      setError("You can try again after 5 minutes");
    }
  }, [invalidAttempts, lastAttemptTime]);

  const handleInvalidAttempt = (now) => {
    const newAttempts = invalidAttempts + 1;
    localStorage.setItem("invalidAttempts", newAttempts);
    setInvalidAttempts(newAttempts);

    if (newAttempts >= 3) {
      localStorage.setItem("lastAttemptTime", now);
      setLastAttemptTime(now);
      setError("You can try again after 5 minutes");
    }
    dispatch(notificationFail("Invalid Otp"));
    setOTPValue("");
    inputRefs.current[0].focus();
  }
 
  useEffect(() => {
    if (numIndex === 5 && otpValue.length === 6) {
      makeAPICall();
    }
  }, [numIndex, otpValue]);

  useEffect(() => {
    if (isTimerActive) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(countdown);
          setIsTimerActive(false);
          setResendMessage(true); // Show message to request new OTP
          return 0;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isTimerActive]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otpValue[index]) {
      e.preventDefault();
      setOTPValue((prevOTP) => {
        const updatedOTP = [...prevOTP];
        updatedOTP[index - 1] = "";
        return updatedOTP.join("");
      });
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOTPValue((prevOTP) => {
      const updatedOTP = [...prevOTP];
      updatedOTP[index] = value.charAt(value.length - 1);
      return updatedOTP.join("");
    });
    setNumIndex(index);
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const makeAPICall = async () => {
    if (!otpValue) {
      dispatch(notificationFail("Please Enter Code"));
    } else if (otpValue.length !== 6) {
      dispatch(notificationFail("Please Enter Valid Code"));
    } else {
      const now = new Date().getTime();
      const invalidAttempts1 = Number(invalidAttempts) || 0;
      const lastAttemptTime1 = Number(lastAttemptTime) || 0;
  
      if (invalidAttempts1 >= 3 && now - lastAttemptTime1 < 5 * 60 * 1000) {
        dispatch(notificationFail("You can try again after 5 minutes"));
        setTimeout(() => {
          setLastAttemptTime("");
          setError("");
          inputRefs.current[0]?.focus();
        }, 300000);
        setError("You can try again after 5 minutes");
        setOTPValue("");
        inputRefs.current[0]?.focus();
        await jwtAxios.post("users/LoginFailedEmail").catch((err) => {
          const message = err?.response?.data?.message || "An error occurred.";
          dispatch(notificationFail(message));
        });
        return;
      }
  
      await jwtAxios
        .post("users/verifyTOTP", { token: otpValue })
        .then(async (res) => {
          if (res.data.verified) {
           const user = await dispatch(userGetData());
           props.setGetUser(user.payload)
            props.setistotptriggered(false); // Hide the modals
            props.settwofatwiliomodal(false); // Explicitly close the modal
            window.localStorage.removeItem("isTOTPTriggered");
            window.localStorage.removeItem("expiryTime");
            window.localStorage.removeItem("lastAttemptTime");
            window.localStorage.removeItem("invalidAttempts");
            if(!address){
              navigate("/");
            }
            dispatch(notificationSuccess("user login successfully"));
          }
           else {
            handleInvalidAttempt(now, invalidAttempts1, lastAttemptTime1);
          }
        })
        .catch((error) => {
          const message = error?.response?.data?.message || "Something Went Wrong";
          dispatch(notificationFail(message));
          handleInvalidAttempt(now, invalidAttempts1, lastAttemptTime1);
        });
    }
  };  
  

  const resendOTP = async () => {
    setIsTimerActive(true);
    setResendMessage(false); // Hide resend message
    setOTPValue(""); // Clear input
    inputRefs.current[0]?.focus(); // Focus on the first input
    const phoneNumber = userData?.phone;
    const phoneCountry = userData?.phoneCountry;
    if (phoneNumber && phoneCountry) {
      try {
        // Call API to resend OTP
        jwtAxios
        .post("users/resendTOTP", {
          phone: phoneNumber,
          phoneCountry: phoneCountry,
        })
        .then(() => {
          const newExpiryTime = Date.now() + 20 * 1000; // 20 seconds from now
          localStorage.setItem("expiryTime", newExpiryTime);
          setTimer(20);
          dispatch(notificationSuccess("OTP sent successfully."));
        })
        .catch(() => {
          dispatch(notificationFail("Failed to resend OTP. Please try again."));
        });

      } catch (error) {
        if (typeof error === "string") {
          dispatch(notificationFail(error));
        } else if (error?.response?.data?.message) {
          dispatch(notificationFail(error.response.data.message));
        } else {
          dispatch(notificationFail("Something Went Wrong"));
        }
      }
    } 
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedOTP = e.clipboardData.getData("text/plain");
    if (/^\d+$/.test(pastedOTP) && pastedOTP.length <= 6) {
      const updatedOTP = pastedOTP.slice(0, 6).split("");
      setOTPValue(updatedOTP.join(""));
      setNumIndex(updatedOTP.length - 1);
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }
  };

  const logout = async () => {
    deactivate();
    await dispatch(logoutAuth()).unwrap();
    props.setGetUser([]);
    navigate("/");
    props.settwofatwiliomodal(false);
    props.setistotptriggered(false);
    window.localStorage.removeItem("isTOTPTriggered");
  };

  const logoutUser = () => {
    logout();
  };

  return (
    <Modal
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
      show={true}
      onHide={logoutUser}
    >
      <Modal.Header className="justify-content-around" closeButton>
        <Modal.Title>Two-Factor Authentication</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        {Array.from({ length: 6 }, (_, index) => (
          <DigitInput
            key={index}
            type="text"
            value={otpValue[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="digit-input"
            disabled={!isTimerActive || error}
          />
        ))}
        <br />
        {isTimerActive && !error && <TimerText>Wait for {timer} seconds to verify OTP.</TimerText>}
        {resendMessage && !error && (
          <ErrorText>
            OTP has expired. {" "}
          </ErrorText>
        )}
        {!error && <button
          onClick={resendOTP}
          disabled={isTimerActive}
          style={{ color: isTimerActive ? "gray" : "blue", border: "none", background: "none", cursor: isTimerActive ? "not-allowed" : "pointer", }}
        >
          Resend OTP
        </button>}
        {error && (
          <p style={{ color: "#f76161", marginTop: "10px" }}>{error}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TwoFATwilioValidate;

