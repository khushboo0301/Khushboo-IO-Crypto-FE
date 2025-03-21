import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../store/slices/AuthSlice";
import React from "react";
import { Col, Row } from "react-bootstrap";

//this component is used for token balance progess bar
export const TokenBalanceProgress = (props) => {
  const { getUser } = props;
  const dispatch = useDispatch();
  const { tokenData } = useSelector((state) => state?.currenyReducer);
  const userData = useSelector(userDetails);
  let authToken = userData.authToken ? userData.authToken : null;

  return (
    <>
      <div className="token-balance">
        <div className="token-avatar"></div>
        <div>
          <div className="token-text">Token Balance</div>
          <div className="token-amount">
            {authToken &&
            getUser &&
            getUser?.is_2FA_verified === true &&
            tokenData &&
            tokenData?.totalUserCount
              ? tokenData?.totalUserCount
              : 0.00}
            <span>MID</span>
          </div>
        </div>
      </div>
      <h5>Your Contribution</h5>
      <Row>
        <Col>
          <div className="contribution-amount">{tokenData && tokenData?.totalUsdtCount}</div>
          <div className="contribution-label">
            <img
              className="currency-flag"
              src={require("../content/images/usdt-icon.png")}
              alt="Bitcoin"
              style={{ width: "16px", height: "16px" }}
            />
            USDT
          </div>
        </Col>
      </Row>
    </>
  );
};

export default TokenBalanceProgress;
