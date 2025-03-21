import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import { Button, Form, Modal } from "react-bootstrap";
import jwtAxios from "../service/jwtAxios";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { logoutAuth, userGetData } from "../store/slices/AuthSlice";
import { useWeb3React } from "@web3-react/core";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

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
const TwoFAvalidate = (props) => {
  const [otpValue, setOTPValue] = useState("");
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [numIndex, setNumIndex] = useState("");
  const navigate = useNavigate();
  const { deactivate } = useWeb3React();
  const [lastAttemptTime, setLastAttemptTime] = useState(
    localStorage.getItem("lastAttemptTime") || ""
  );
  const [invalidAttempts, setInvalidAttempts] = useState(
    Number(localStorage.getItem("invalidAttempts")) || 0
  );
  const [error, setError] = useState("");
  useEffect(() => {
    if (numIndex === 5 && otpValue.length === 6) {
      makeAPICall();
    }
  }, [numIndex, otpValue]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "lastAttemptTime" || event.key === "invalidAttempts") {
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
    dispatch(notificationFail("Invalid Code"));
    setOTPValue("");
    inputRefs.current[0].focus();
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otpValue[index]) {
      e.preventDefault();
      setOTPValue((prevOTP) => {
        const updatedOTP = [...prevOTP];
        updatedOTP[index - 1] = "";
        return updatedOTP.join("");
      });
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
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
      inputRefs.current[index + 1].focus();
    }
  };

  const makeAPICall = async () => {
    if (!otpValue) {
      dispatch(notificationFail("Please Enter Code"));
    } else {
      if (otpValue.length !== 6) {
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
            inputRefs.current[0].focus();
          }, 300000);
          setError("You can try again after 5 minutes");
          setOTPValue("");
          inputRefs.current[0].focus();
          await jwtAxios
          .post("users/LoginFailedEmail")
          .catch((err) => {
            if(typeof err == "string")
            {
              dispatch(notificationFail(err));
            }else if(err?.response?.data?.message){
              dispatch(notificationFail(err?.response?.data?.message));
            }else{
              dispatch(notificationFail("An error occurred during the transaction. Please try again."));
            }
          });
          return;
        }

        await jwtAxios
          .post("users/validateTOTP", { token: otpValue })
          .then(async (res) => {
            if (res.data.verified) {
              setInvalidAttempts("");
              setLastAttemptTime("");
              const user = await dispatch(userGetData()).unwrap();
              props.setGetUser(user);
              navigate("/");
              props.setTwoFAModal(false);
              if (user?.phoneCountry && user?.phone && user?.is_2FA_SMS_enabled) {
                if (!user?.is_2FA_twilio_login_verified && !props?.istotptriggered) {
                  await props.handleLoginSuccess(user.phone, user.phoneCountry);
                }
              } else {
                dispatch(notificationSuccess("user login successfully"));
                window.localStorage.removeItem("lastAttemptTime");
                window.localStorage.removeItem("invalidAttempts");
              }
            } else {
              handleInvalidAttempt(now);
            }
          })
          .catch((err) => {
            if(typeof err == "string") {
              dispatch(notificationFail(err));
            } else if(err?.response?.data?.message) {
              dispatch(notificationFail(err?.response?.data?.message));
            } else {
              dispatch(notificationFail("Something Went Wrong"));
            }
            handleInvalidAttempt(now);
          });
      }
    }
  };
  

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedOTP = e.clipboardData.getData("text/plain");
    if (/^\d+$/.test(pastedOTP) && pastedOTP.length <= 6) {
      const updatedOTP = pastedOTP.slice(0, 6).split("");
      const initialOTP = Array.from({ length: 6 }, (_, index) =>
        index < updatedOTP.length ? updatedOTP[index] : ""
      );
      setOTPValue(initialOTP.join(""));
      setNumIndex(updatedOTP.length - 1);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };
  const logout = async () => {
    deactivate();
    await dispatch(logoutAuth()).unwrap();
    props.setGetUser([]);
    navigate("/");
    props.setTwoFAModal(false);
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
      <Modal.Header
        className="justify-content-around"
        closeButton
      >
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
            disabled={error}
          />
        ))}
        <br />
        {error && (
          <p style={{ color: "#f76161", marginTop: "10px" }}>{error}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TwoFAvalidate;
