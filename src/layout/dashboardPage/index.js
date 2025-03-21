import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircleIcon,
  CloseIcon,
  ExclamationIcon,
  SimpleCheckIcon,
} from "../../component/SVGIcon";
import TokenSale from "../../component/TokenSale";
import TokenSaleProgress from "../../component/TokenSaleProgress";
import { useDispatch, useSelector } from "react-redux";
import {
  getTokenCount,
  getTotalMid,
  resetTokenData,
} from "../../store/slices/currencySlice";
import { userDetails } from "../../store/slices/AuthSlice";
import { formattedNumber, getDateFormate, hideAddress } from "../../utils";
import TokenBalanceProgress from "../../component/TokenBalanceProgress";
import { getTransaction } from "../../store/slices/transactionSlice";

export const DashboardPage = (props) => {
  const { getUser, transactionLoading } = props;
  const [transactionList, setTransactionList] = useState(null);
  const dispatch = useDispatch();
  const acAddress = useSelector(userDetails);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referrance = queryParams.get("ref");

  const { sales } = useSelector((state) => state?.currenyReducer);

  useEffect(() => {
    const getDashboardData = async () => {
      await dispatch(getTotalMid()).unwrap();
      let authToken = acAddress.authToken ? acAddress.authToken : null;
      if (
        authToken &&
        getUser &&
        getUser?.is_2FA_verified === true &&
        acAddress.account
      ) {
        dispatch(getTokenCount()).unwrap();
      } else {
        dispatch(resetTokenData());
      }
    };
    getDashboardData();
  }, [dispatch, acAddress.authToken, getUser]);

  const buytokenLink = () => {
    navigate("/buy-token");
  };

  useEffect(() => {
    if (
      acAddress &&
      acAddress?.authToken &&
      acAddress.account &&
      getUser &&
      getUser?.is_2FA_verified === true
    ) {
      dispatch(
        getTransaction({
          currentPage: 1,
          pageSize: 3,
          typeFilter: [],
          statusFilter: [],
        })
      ) // Adjust the filters as needed
        .unwrap()
        .then((data) => {
          setTransactionList(data.transactions);
        });
    }
  }, [acAddress?.authToken, getUser]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = process.env.PUBLIC_URL + "/whitepaper.pdf";
    link.download = "whitepaper.pdf";
    link.click();
  };

  let addressLine = "Connect Wallet";

  if (acAddress.account !== "Connect Wallet" && getUser) {
    if (getUser.is_2FA_verified) {
      addressLine = hideAddress(acAddress.account, 5);
    }
  }

  useEffect(() => {
    if (acAddress?.account === referrance) {
      navigate("/");
    }
  }, [acAddress]);

  return (
    <>
      <div className="account-status">
        <Row>
          <Col lg="4">
            <div className="top-green-card">
              <Card body className="green-card">
                <TokenBalanceProgress getUser={getUser} />
              </Card>
            </div>
          </Col>
          <Col lg="8">
            <Card body className="cards-dark">
              <Row>
                <Col lg="3">
                  <h4>Ico Coin</h4>
                  <div className="icoin">
                    1 Usd= {sales && sales?.amount ? sales?.amount : 0} Mid
                  </div>
                  <p>1 IDR = 0.0067 USDT</p>
                  <Button variant="primary" onClick={buytokenLink}>
                    Buy Token Now
                  </Button>
                </Col>
                <Col lg="9">
                  <h4>Your Account Status</h4>
                  <div className="btns-Verified">
                    <Badge bg="success">
                      Email Verified{" "}
                      <span className="verify-status">
                        <SimpleCheckIcon width="10" height="8" />
                      </span>
                    </Badge>

                    {getUser &&
                      getUser?.kyc_verify === 0 &&
                      getUser?.kyc_status === true &&
                      getUser?.is_2FA_verified === true && (
                        <Badge bg="info" className="kyc-status">
                          Submit KYC{" "}
                        </Badge>
                      )}
                    {getUser &&
                      getUser?.kyc_verify === 0 &&
                      getUser?.kyc_status === false && (
                        <Badge bg="info" className="kyc-status">
                          Submit KYC{" "}
                        </Badge>
                      )}
                    {getUser &&
                      getUser?.kyc_verify === 1 &&
                      getUser?.kyc_status === true &&
                      getUser?.is_2FA_verified === true && (
                        <Badge bg="info" className="kyc-status">
                          KYC Verified{" "}
                          <span className="verify-status">
                            <SimpleCheckIcon width="10" height="8" />
                          </span>
                        </Badge>
                      )}
                    {getUser &&
                      getUser?.kyc_verify === 2 &&
                      getUser?.is_2FA_verified === true && (
                        <Badge bg="danger" className="kyc-status">
                          KYC Rejected{" "}
                          <span className="verify-status">
                            <CloseIcon width="30" height="30" />
                          </span>
                        </Badge>
                      )}
                  </div>
                  <h4 className="mb-3">Receiving Wallet</h4>
                  <h4>
                    {acAddress && getUser && addressLine != "" && (
                      <span>{addressLine}</span>
                    )}{" "}
                    <Link to="#/">EDIT</Link>
                  </h4>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="token-sale">
        <Row>
          <Col lg="8">
            <Card body className="cards-dark token-sale-graph-card">
              <Card.Title as="h4">
                Token Sale Graph <Link to="/transaction">View all</Link>
              </Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th width="70">Token</th>
                    <th width="90">Amount</th>
                    <th width="150">Date</th>
                    <th width="80">Type</th>
                    <th width="100"></th>
                  </tr>
                </thead>
                <tbody>
                  {acAddress?.authToken ? (
                    transactionList?.length > 0 ? (
                      transactionList?.map((transaction) => (
                        <tr key={transaction._id}>
                          <td>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {transaction?.status == "paid" && (
                                <CheckCircleIcon width="16" height="16" />
                              )}
                              {transaction?.status == "failed" && (
                                <CloseIcon width="16" height="16" />
                              )}
                              {transaction?.status == "pending" && (
                                <ExclamationIcon width="16" height="16" />
                              )}
                              {transaction?.is_sale && transaction?.is_process
                                ? transaction?.token_cryptoAmount <= 200
                                  ? formattedNumber(
                                      transaction?.token_cryptoAmount
                                    )
                                  : "+200"
                                : "0.00"}
                            </div>
                          </td>
                          <td>
                            <p className="text-white mb-1">
                              {formattedNumber(transaction?.price_amount)}{" "}
                              {transaction?.price_currency}
                            </p>
                          </td>
                          <td>{getDateFormate(transaction?.created_at)}</td>
                          <td>
                            {" "}
                            {transaction?.sale_type == "website"
                              ? "Website"
                              : "Outside-Web"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {transaction?.status == "paid" && (
                              <Button variant="outline-success">
                                Confirmed
                              </Button>
                            )}
                            {transaction?.status == "failed" && (
                              <Button variant="outline-danger">Failed</Button>
                            )}
                            {transaction?.status == "pending" && (
                              <Button variant="outline-pending">
                                Unconfirmed
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ paddingTop: "30px" }}>
                          <p
                            className="text-center"
                            style={{ color: "rgba(255,255,255,0.2)" }}
                          >
                            No History Records
                          </p>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ paddingTop: "30px" }}>
                        <p
                          className="text-center"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                          No History Records
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col lg="4">
            <Card body className="cards-dark h-100 token-sale-progress-card">
              <Card.Title as="h4">Token Sale Progress</Card.Title>
              <TokenSaleProgress />
            </Card>
          </Col>
        </Row>
      </div>
      <div className="token-sale-graph">
        <Row>
          <Col lg="8">
            <TokenSale getUser={getUser} />
          </Col>
          <Col lg="4">
            <Card body className="cards-dark ico-coin">
              <Card.Title as="h3">Ico coin</Card.Title>
              <p>You can buy token, go through Buy Token page.</p>
              <Button variant="primary" onClick={handleDownload}>
                Download Whitepaper
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardPage;
