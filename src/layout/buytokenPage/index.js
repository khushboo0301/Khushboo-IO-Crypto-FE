import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import jwtAxios from "../../service/jwtAxios";
import axios from "axios";
import TokenSaleProgress from "../../component/TokenSaleProgress";
import Web3 from "web3";
import { networks } from "../../store/networks";
import { ethers } from "ethers";
import {
  convertToCrypto,
  resetCryptoAmount,
  getTotalMid,
  getTokenCount,
  resetTokenData,
  setOrderId,
  checkCurrentSale,
} from "../../store/slices/currencySlice";
import {
  notificationFail,
  notificationSuccess,
} from "../../store/slices/notificationSlice";
import TokenBalanceProgress from "../../component/TokenBalanceProgress";
import { userDetails, userGetData } from "../../store/slices/AuthSlice";
import LoginView from "../../component/Login";
import PaymentProcess from "../../component/PaymentProcess";

const RECEIVER_ADDRESS = process.env.REACT_APP_RECEIVER_ADDRESS;
const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
const BSCSCAN_API_KEY = process.env.REACT_APP_BSCSCAN_API_KEY;
const FANTOM_API_KEY = process.env.REACT_APP_FANTOM_API_KEY;
const POLOGON_API_KEY = process.env.REACT_APP_POLYGON_API_KEY;

export const BuyTokenPage = () => {
  const dispatch = useDispatch();
  const web3 = new Web3(Web3.givenProvider);
  const acAddress = useSelector(userDetails);
  const [getUser, setGetUser] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedNetworkETH, setSelectedNetworkETH] = useState(null);
  const [selectedNetworkBNB, setSelectedNetworkBNB] = useState(null);
  const [selectedNetworkMATIC, setSelectedNetworksMATIC] = useState(null);
  const [selectedNetworkFTM, setSelectedNetworkFTM] = useState(null);
  const [readyForPayment, setReadyForPayment] = useState(true);
  const [modalLoginShow, setLoginModalShow] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isSign, setIsSign] = useState(null);
  const { cryptoAmount, sales } = useSelector((state) => state?.currenyReducer);
  const modalLoginToggle = () => setLoginModalShow(!modalLoginShow);
  const handleAccountAddress = () => {
    setIsSign(false);
  };

  useEffect(() => {
    const fetchDataUser = async () => {
      let authToken = acAddress.authToken ? acAddress.authToken : null;
      if (authToken) {
        try {
          dispatch(checkCurrentSale());
          const user = await dispatch(userGetData(acAddress.userid)).unwrap();
          setGetUser(user);
          await dispatch(getTotalMid()).unwrap();
          await dispatch(getTokenCount()).unwrap();
        } catch (error) {
          dispatch(notificationFail("Error fetching data:"));
        }
      } else {
        dispatch(resetTokenData());
      }
    };

    fetchDataUser();
  }, [dispatch, acAddress.authToken, acAddress.userid]);

  useEffect(() => {
    const authToken = acAddress.authToken ? acAddress.authToken : null;
    if (authToken) {
      if (cryptoAmount && cryptoAmount?.amount > sales?.remaining_token) {
        setReadyForPayment(true);
        dispatch(notificationFail("Please Enter Correct Amount"));
      }
    }
  }, [cryptoAmount, sales, acAddress.authToken]);

  async function switchNetwork(network) {
    const networkData = networks[network];

    if (!networkData) {
      dispatch(notificationFail("Network not recognized"));
      return;
    }

    try {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (currentChainId === networkData.chainId) {
        return;
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkData.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: networkData.chainId,
                chainName: networkData.chainName,
                rpcUrls: networkData.rpcUrls,
                nativeCurrency: networkData.nativeCurrency,
                blockExplorerUrls: networkData.blockExplorerUrls,
              },
            ],
          });

          // Chain added successfully, attempt switch again
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: networkData.chainId }],
          });
        } catch (addError) {
          dispatch(
            notificationFail("Failed to add network. Please add it manually.")
          );
          throw addError; // Propagate error to stop further execution
        }
      } else if (switchError.code === -32002) {
        dispatch(
          notificationFail(
            "Network switch request already pending. Please confirm the request in MetaMask."
          )
        );
        throw switchError; // Propagate error to stop further execution
      } else {
        dispatch(
          notificationFail("Failed to switch network. Please try again later.")
        );
        throw switchError; // Propagate error to stop further execution
      }
    }
  }

  async function getUSDTContract(network) {
    const networksData = networks[network];
    const usdtAddress = networksData.usdtAddress;
    const usdtAbi = [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            name: "_to",
            type: "address",
          },
          {
            name: "_value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const contract = new web3.eth.Contract(usdtAbi, usdtAddress);
    return contract;
  }

  const modalToggle = async () => {
    const authToken = acAddress?.authToken || null;
    if (!authToken) {
      setLoginModalShow(true);
      return;
    }

    if (getUser && getUser?.kyc_status === false) {
      dispatch(notificationFail("Please complete KYC to Buy Token"));
      setReadyForPayment(false);
      return;
    }

    if (!selectedNetwork || !Number(amount)) {
      if (selectedNetwork && !Number(amount)) {
        setReadyForPayment(true);
        dispatch(notificationFail("Please Select Crypto Amount"));
      } else if (!selectedNetwork && Number(amount)) {
        dispatch(notificationFail("Please Select Network"));
      } else {
        setReadyForPayment(true);
        dispatch(notificationFail("Please Select Network and Crypto Amount"));
      }
      return;
    }

    if (
      cryptoAmount &&
      cryptoAmount.amount > 0 &&
      sales &&
      sales.remaining_token > 0 &&
      cryptoAmount.amount > sales.remaining_token
    ) {
      setReadyForPayment(true);
      dispatch(notificationFail("Please Enter Correct Amount"));
      return;
    }

    setReadyForPayment(false);

    if (!sales) {
      dispatch(notificationFail("There is No Sale for these Specific Dates"));
      return;
    }

    if (getUser && getUser?.kyc_verify === 1 && getUser?.kyc_status === true) {
      try {
        const data = {
          amount: amount,
          wallet_address: acAddress?.account,
          cryptoAmount: cryptoAmount.amount,
        };

        await jwtAxios
          .post(`/transactions/verifyToken`, data)
          .then(async (res) => {
            try {
              await switchNetwork(selectedNetwork);
            } catch (error) {
              return;
            }

            let amountToSend;
            const contractInstance = await getUSDTContract(selectedNetwork);

            if (selectedNetwork == "BNB") {
              amountToSend = web3.utils.toWei(amount.toString(), "ether");
            } else {
              amountToSend = ethers.utils.parseUnits(amount.toString(), 6); // Convert amount to USDT units (6 decimals)
            }

            const transaction = await contractInstance.methods.transfer(
              RECEIVER_ADDRESS,
              amountToSend
            );
            const tx = {
              from: acAddress?.account,
              to: contractInstance.options.address,
              data: transaction.encodeABI(),
            };

            const response = await web3.eth.sendTransaction(tx);
            let transactionData;
            let usertxHash;
            if (response.transactionHash) {
              usertxHash = response.transactionHash;

              transactionData = {
                user_wallet_address: acAddress?.account,
                amount: amount,
                status: "pending",
                network: selectedNetwork,
                cryptoAmount: cryptoAmount.amount,
                transactionHash: usertxHash,
                gasUsed: response.gasUsed,
                effectiveGasPrice: response.effectiveGasPrice,
                cumulativeGasUsed: response.cumulativeGasUsed,
                blockNumber: response.blockNumber,
                blockHash: response.blockHash,
              }
            } else {
              if (response.receipt && !response.receipt.status) {
                usertxHash = response.receipt.transactionHash;

                transactionData = {
                  user_wallet_address: acAddress?.account,
                  amount: amount,
                  status: "failed",
                  network: selectedNetwork,
                  cryptoAmount: cryptoAmount.amount,
                  transactionHash: usertxHash,
                  gasUsed: response.receipt.gasUsed,
                  effectiveGasPrice: response.receipt.effectiveGasPrice,
                  cumulativeGasUsed: response.receipt.cumulativeGasUsed,
                  blockNumber: response.receipt.blockNumber,
                  blockHash: response.receipt.blockHash,
                }
              }
            }

            await jwtAxios.post(`/transactions/createOrder`, transactionData);

            try {
              const receiverData = await web3.eth.getTransaction(usertxHash);
              const transactionUpdateData = {
                transactionHash: usertxHash,
              };

              if (usertxHash === receiverData.hash) {
                transactionUpdateData.status = "paid";
              } else {
                transactionUpdateData.status = "failed";
              }

              const updateResponse = await jwtAxios.put(
                `/transactions/updateOrder`,
                transactionUpdateData
              );

              if (updateResponse?.data.message === "success") {
                dispatch(setOrderId(usertxHash));
                setSuccessModal(true);
                dispatch(notificationSuccess("Transaction Successfull"));
              } else {
                dispatch(setOrderId(usertxHash));
                setCancelModal(true);
                dispatch(notificationFail("Transaction failed!!"));
              }
            } catch (error) {
              dispatch(notificationFail("Error fetching transactions"));
            }
          })
          .catch((err) => {
            if (typeof err == "string") {
              dispatch(notificationFail(err));
            } else if (err?.response?.data?.message) {
              dispatch(notificationFail(err?.response?.data?.message));
            } else {
              dispatch(
                notificationFail(
                  "An error occurred during the transaction. Please try again."
                )
              );
            }
          });
      } catch (error) {
        dispatch(
          notificationFail(
            "An error occurred during the transaction. Please try again."
          )
        );
      }
    } else {
      dispatch(notificationFail("Your KYC is not verified by admin"));
      setReadyForPayment(false);
      return;
    }
  };

  const handleSelectedCrypto = (e) => {
    setSelectedNetwork(e);
  };

  const handleChangeAmount = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
    const usdAmount = value;
    const data = {
      usdtAmount: usdAmount,
    };
    onChangeAmount(data);

    if (value) {
      if (value > 0) {
        setReadyForPayment(false);
      } else {
        setReadyForPayment(true);
        dispatch(notificationFail("Please Enter Correct Amount"));
      }
    } else {
      setReadyForPayment(true);
    }
  };

  const onChangeAmount = useCallback(
    debounce((data) => {
      dispatch(convertToCrypto(data));
    }, 500),
    []
  );

  const handledAmountFocus = () => {
    if (!selectedNetwork) {
      setReadyForPayment(true);
      dispatch(notificationFail("Please Select Network"));
    }
  };

  useEffect(() => {
    dispatch(resetCryptoAmount());
  }, []);

  const closeModal = () => {
    setSuccessModal(false);
    setCancelModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseFTM, responseETH, responseBNB, responseMATIC] =
          await Promise.all([
            axios.get("https://api.ftmscan.com/api", {
              params: {
                module: "gastracker",
                action: "gasoracle",
                apikey: FANTOM_API_KEY,
              },
            }),
            axios.get("https://api.etherscan.io/api", {
              params: {
                module: "gastracker",
                action: "gasoracle",
                apikey: ETHERSCAN_API_KEY,
              },
            }),
            axios.get("https://api.bscscan.com/api", {
              params: {
                module: "gastracker",
                action: "gasoracle",
                apikey: BSCSCAN_API_KEY,
              },
            }),
            axios.get("https://api.polygonscan.com/api", {
              params: {
                module: "gastracker",
                action: "gasoracle",
                apikey: POLOGON_API_KEY,
              },
            }),
          ]);

        if (
          responseFTM.data &&
          responseFTM.data.result &&
          responseFTM.data.result.ProposeGasPrice
        ) {
          setSelectedNetworkFTM(responseFTM.data.result.ProposeGasPrice);
        }

        if (
          responseETH.data &&
          responseETH.data.result &&
          responseETH.data.result.ProposeGasPrice
        ) {
          setSelectedNetworkETH(responseETH.data.result.ProposeGasPrice);
        }
        if (
          responseBNB.data &&
          responseBNB.data.result &&
          responseBNB.data.result.ProposeGasPrice
        ) {
          setSelectedNetworkBNB(responseBNB.data.result.ProposeGasPrice);
        }
        if (
          responseMATIC.data &&
          responseMATIC.data.result &&
          responseMATIC.data.result.ProposeGasPrice
        ) {
          setSelectedNetworksMATIC(responseMATIC.data.result.ProposeGasPrice);
        }
      } catch (error) {
        console.log("Error fetching gas price:", error);
        // dispatch(notificationFail("Error fetching gas price:", error));
      }
    };

    fetchData();
    setInterval(fetchData, 120000);
    //Clean up function to clear interval when component unmounts
    //return () => clearInterval(interval);
  }, []);

  return (
    <div className="buy-token-view">
      <Row>
        <Col xl="8">
          <Card body className="cards-dark choose-currency">
            <Card.Title as="h4">Choose Network</Card.Title>
            <Card.Text>
              You can buy our token using the below currency choices to become
              part of our project.
            </Card.Text>
            <Row>
              <>
                <Form.Group controlId="selectedNetwork">
                  <Row>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("ETH")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedNetwork === "ETH" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">Ethereum</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/tether-usdt.png")}
                                    alt="ETH"
                                  />
                                </span>
                                USDT
                              </div>
                              <div className="currency-amount">
                                fees: {selectedNetworkETH}
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("FTM")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedNetwork === "FTM" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">Fantom</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/tether-usdt.png")}
                                    alt="fantam"
                                  />
                                </span>
                                USDT
                              </div>
                              <div className="currency-amount">
                                fees: {selectedNetworkFTM}
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("MATIC")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedNetwork === "MATIC" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">MATIC</div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/tether-usdt.png")}
                                    alt="trx"
                                  />
                                </span>
                                USDT
                              </div>
                              <div className="currency-amount">
                                fees: {selectedNetworkMATIC}
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                    <Col md="6">
                      <div
                        className="form-check"
                        onClick={() => handleSelectedCrypto("BNB")}
                      >
                        <div
                          className={`form-check-input ${
                            selectedNetwork === "BNB" ? "checked" : ""
                          }`}
                        />
                        <label class="form-check-label">
                          <>
                            <div className="radio-label">
                              Binance Smart Chain
                            </div>
                            <div className="currency-info">
                              <div className="currency-type">
                                <span className="currency-flag">
                                  <img
                                    className="currency-flag"
                                    src={require("../../content/images/tether-usdt.png")}
                                    alt="bnb"
                                  />
                                </span>
                                USDT
                              </div>
                              <div className="currency-amount">
                                fees: {selectedNetworkBNB}
                              </div>
                            </div>
                          </>
                        </label>
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </>
            </Row>
            <Card.Title as="h4" className="card-subtitle">
              Amount of contribute
            </Card.Title>
            <Card.Text>
              Enter the amount you would like to contribute in order to
              calculate the amount of tokens you will receive. The calculator
              below helps to convert the required quantity of tokens into the
              amount of your selected currency.
            </Card.Text>
            <Row>
              <Col md="6">
                <div className="form-check">
                  <label class="form-check-label">
                    <>
                      <div className="radio-label">Input Amount</div>
                      <div className="currency-info">
                        <div className="currency-type">
                          <Form.Control
                            type="text"
                            placeholder="Enter Amount"
                            onChange={(e) => handleChangeAmount(e)}
                            onFocus={handledAmountFocus}
                            value={amount}
                          />
                        </div>
                        <div className="currency-amount">USDT</div>
                      </div>
                    </>
                  </label>
                </div>
              </Col>
              <Col md="6">
                <div className="form-check">
                  <label class="form-check-label">
                    <>
                      <div className="radio-label">Rate</div>
                      <>
                        <div className="currency-info">
                          <div className="currency-type">
                            {cryptoAmount && cryptoAmount?.amount
                              ? cryptoAmount?.amount
                              : 0}
                          </div>
                          <div className="currency-amount">MID</div>
                        </div>
                      </>
                    </>
                  </label>
                </div>
              </Col>
            </Row>
            <Card.Text>
              1.952 USD (10 Ico ) Minimum contribution amount is required.
            </Card.Text>
            <Card.Title as="h4" className="mt-4">
              Payment Information
            </Card.Title>
            <div className="payment-info">
              <div className="d-flex justify-content-between align-items-center">
                <div className="payment-label">+ Sale bonus 0 %</div>
                <div className="payment-amount">0</div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="payment-label">+ Amount Bonus</div>
                <div className="payment-amount">0</div>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top">
                <div className="payment-label fw-bold">
                  Total {selectedNetwork}
                </div>
                <div className="payment-amount">{amount}</div>
              </div>
            </div>
            <Card.Text className="text-danger">
              Your contribution will be calculated based on exchange rate at the
              moment when your transaction is confirmed.
            </Card.Text>
            <Button
              variant="primary"
              onClick={modalToggle}
              disabled={readyForPayment}
            >
              Make Payment
            </Button>
            <Card.Text className="mb-0">
              Tokens will appear in your account after payment successfully made
              and approved by our team. Please note that, SSS token will be
              distributed after the token sales end-date.
            </Card.Text>
          </Card>
        </Col>
        <Col xl="4">
          <Row>
            <Col xl="12" lg="6">
              <div className="top-green-card">
                <Card body className="green-card">
                  <TokenBalanceProgress getUser={getUser} />
                </Card>
              </div>
            </Col>
            <Col xl="12" lg="6">
              <Card
                body
                className="cards-dark token-sale-card by-token-salesCard"
              >
                <Card.Title as="h4">Token Sale Progress</Card.Title>
                <TokenSaleProgress />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* this is payment process component for buy token  */}
      <PaymentProcess
        successModal={successModal}
        cancelModal={cancelModal}
        closeModal={closeModal}
      />
      {modalLoginShow && (
        <LoginView
          setGetUser={setGetUser}
          show={modalLoginShow}
          onHide={() => setLoginModalShow(false)}
          handleaccountaddress={handleAccountAddress}
          issign={isSign}
        />
      )}
    </div>
  );
};

export default BuyTokenPage;
