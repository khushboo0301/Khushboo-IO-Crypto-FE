import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtAxios, { setAuthToken } from "../../service/jwtAxios";
import { countryCodes } from "../countryCodes";
import { notificationFail, notificationSuccess } from "./notificationSlice";
import { setLoading } from "./commonSlice";
import { setLoginLoading } from "./LoderSlice";
const userData = JSON.parse(window?.localStorage?.getItem("userData"))
  ? JSON.parse(window.localStorage.getItem("userData"))
  : null;

const initialState = {
  authdata: {
    account: userData?.account ? userData?.account : "Connect Wallet",
    authToken: userData?.authToken,
    userid: userData?.userid,
    imageUrl: userData?.imageUrl,
  },
  countryDetails: null,
};

export const checkAuth = createAsyncThunk(
  "checkAuth",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let resBody = null;
      let account = action.account;
      let library = action.library;
      let checkValue = action.checkValue;
      var deactivate = action.deactivate;
      let signMessage = action.signMessage;
      let hideLoginModal = action.hideLoginModal;
      let referredBy = action.refrence_by;
      let signature;
      if (action.signature) {
        signature = action.signature;
      }
      let userData = {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
      
      if (!signature) {
        setAuthToken(null);
        let response = await jwtAxios
          .get(`/auth/nonce/${account}`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          })
          .then((response) => {
            resBody = response.data;
            setAuthToken(resBody.tempToken);
            return response.data;
          })
          .catch((error) => {
            dispatch(
              notificationFail(
                "Something Went Wrong. Can you please Connect wallet again?"
              )
            );
            window.localStorage.removeItem("token");
            window.localStorage.clear();
          });
        let provider = window.localStorage.getItem("provider");
        if (provider == "fortmatic") {
          signature = await window.web3.eth.personal.sign(
            resBody.message,
            account
          );
        } else if (provider == "coinbaseWallet") {
          signMessage({ message: resBody.message });
        } else if (provider == "walletConnect") {
          signMessage({ message: resBody.message });
        } else {
          signature = await library
            .getSigner(account)
            .signMessage(resBody.message);
        }
      }
      if (signature) {
        let bodyData = { walletType: checkValue };

        // let referredBy = window.localStorage.getItem("referred_by");
        if (referredBy) {
          bodyData = { ...bodyData, referredBy };
        }
        let verifyTokenData = await jwtAxios
          .post(`/users/verify?signatureId=${signature}`, bodyData)
          .catch((error) => {
            if (error.response.data.message) {
              dispatch(notificationFail(error.response.data.message));
            } else {
              dispatch(
                notificationSuccess(
                  "Something Went Wrong. Can you please Connect wallet again?"
                )
              );
            }
            window.localStorage.removeItem("token");
            window.localStorage.clear();
            deactivate();          
          });
        if (verifyTokenData?.data?.token) {
          //window.localStorage.removeItem("referred_by");
          setAuthToken(verifyTokenData.data.token);
        }
        if (verifyTokenData?.data?.token) {
          dispatch(setLoginLoading(true));
          userData = {
            account: account,
            authToken: verifyTokenData.data.token,
            userid: verifyTokenData.data.user_id,
            imageUrl: verifyTokenData.data.imageUrl,
          };
          window.localStorage.setItem("userData", JSON.stringify(userData));
        }
        dispatch(setLoading(false));
        dispatch(setLoginLoading(false));
        if(hideLoginModal)
        {
          hideLoginModal();
        }
        if (
          verifyTokenData.data?.userInfo?.is_2FA_login_verified === undefined ||
          verifyTokenData.data?.userInfo?.is_2FA_login_verified === true
        ) {
          userData.loginCheck = 'success';
        }
        if (
          (verifyTokenData.data?.is_2FA_enabled === undefined ||
          verifyTokenData.data?.is_2FA_enabled === false) && (verifyTokenData.data?.is_2FA_SMS_enabled === false || verifyTokenData.data?.is_2FA_SMS_enabled === undefined || verifyTokenData.data?.isPhoneCode === false)
        ) {
          dispatch(notificationSuccess("user login successfully"));
        }
        return userData;
      }
    } catch (error) {
      dispatch(setLoading(false));
      window.localStorage.clear();
      deactivate();
      return {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
    }
  }
);

export const logoutAuth = createAsyncThunk(
  "logoutAuth",
  async (action, { dispatch }) => {
    try {
      jwtAxios
        .get(`/users/logout`)
        .then(() => {
          setAuthToken(null);
          window.localStorage.clear();
          window.localStorage.removeItem("token");
        })
        .catch((error) => {
          window.localStorage.clear();
          window.localStorage.removeItem("token");
          dispatch(notificationFail(error.response.data.message));
          dispatch(setLoading(false));
        });

      window.localStorage.removeItem("userData");
      let userData = {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
      dispatch(setLoading(false));
      return userData;
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

export const userGetData = createAsyncThunk(
  "userGetData",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let user = {};
      let is_2FA_verified = false;
      let kyc_verify = 0;
      let kyc_status = false;
      let is_2FA_enable = false;
      let email_verified = false;
      let email = null;
      let phone = null;
      let phone_code = null;
      let imageUrl = "";
      let is_2FA_twilio_login_verified = "";
      let is_2FA_SMS_enabled = false;
      await jwtAxios
        .get(`/users/getuser`)
        .then((response) => {
          is_2FA_verified = response.headers['2fa'] === 'true'; 
          kyc_verify = parseInt(response.headers['kyc_verify']) || 0;
          kyc_status = response.headers['kyc_status'] === 'true';
          is_2FA_enable = response.headers['2fa_enable'] === 'true';
          is_2FA_twilio_login_verified = response.headers['2fa_twilio_verified'] === 'true';
          is_2FA_SMS_enabled = response.headers['2fa_sms_enable'] === 'true';
          email_verified = response.headers['is_email_verified'] === 'true';
         // Ensure null values instead of "null" strings
          email = response.headers['is_email'] && response.headers['is_email'] !== 'null' 
          ? response.headers['is_email'] 
          : null;

          phone = response.headers['is_phone'] && response.headers['is_phone'] !== 'null' 
          ? response.headers['is_phone'] 
          : null;

          phone_code = response.headers['phone_code'] && response.headers['phone_code'] !== 'null' 
          ? response.headers['phone_code'] 
          : null;
      
          user = response.data.User;
          imageUrl = response.data.imageUrl;
        })
        .catch((error) => {
          dispatch(notificationFail("Something went wrong with get user"));
        });
      dispatch(setLoading(false));
      return { 
        ...user, 
        imageUrl, 
        is_2FA_verified,
        email_verified, 
        email, 
        phone,
        kyc_verify, 
        kyc_status, 
        is_2FA_enable, 
        is_2FA_twilio_login_verified, 
        is_2FA_SMS_enabled,
        phoneCountry: phone_code
      };
    } catch (error) {
      dispatch(setLoading(false));

      return error.message;
    }
  }
);

export const getCountryDetails = createAsyncThunk(
  "getCountryDetails",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      // const response = await fetch ("https://ipapi.co/json/");
      const response = await fetch(`https://geolocation-db.com/json/`).then(
        (res) => res.json()
      );
      dispatch(setLoading(false));
      let country_calling_code =
        countryCodes.find((x) => x.code === response?.country_code)?.dial_code ||
        "";
      let countryData = Object.assign(response, {
        country_calling_code: country_calling_code,
      });
      return countryData;
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authdata = action.payload;
      })
      .addCase(logoutAuth.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authdata = action.payload;
        state.userfulldata = null;
      })
      .addCase(userGetData.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.userfulldata = action.payload;
      })
      .addCase(getCountryDetails.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.countryDetails = action.payload;
      });
  },
});

export const userDetails = (state) => state.authReducer.authdata;
export const userGetFullDetails = (state) => state.authReducer.userfulldata;
export default authSlice.reducer;
