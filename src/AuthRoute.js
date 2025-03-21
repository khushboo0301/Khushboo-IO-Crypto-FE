import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userDetails, userGetData } from "./store/slices/AuthSlice";

const AuthRoute = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useSelector(userDetails);
  const authed = userData.authToken;
  const is2FAVerified = userData?.is_2FA_verified;

  useEffect(() => {
    if (authed && is2FAVerified === undefined) {
      dispatch(userGetData()).catch((error) =>
        console.error("Error fetching user details:", error)
      );
    }
  }, [authed, is2FAVerified, dispatch]);

  if (!authed || is2FAVerified === false) {
    return <Navigate to="/" />;
  }

  return authed && (is2FAVerified || is2FAVerified === undefined) ? children : null;
};

export default AuthRoute;
