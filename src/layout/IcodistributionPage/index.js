import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Overlay,
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  CopyIcon,
  FacebookShareIcon,
  TwitterShareIcon,
} from "../../component/SVGIcon";
import TokenSaleProgress from "../../component/TokenSaleProgress";
import TokenBalanceProgress from "../../component/TokenBalanceProgress";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import {
  getTokenCount,
  getTotalMid,
  resetTokenData,
  getAllSales,
} from "../../store/slices/currencySlice";
import { getDateFormate } from "../../utils";

export const IcoDistributionPage = () => {
  const textAreaRef = useRef(null);
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const acAddress = useSelector(userDetails);
  const { allSales } = useSelector((state) => state?.currenyReducer);
  const dispatch = useDispatch();
  const referralLink = "https://ico.middn.com?ref=" + acAddress?.userid;
  const referralContent = `Hello 
  this is my referral link for ICO, you can use this link`;

  useEffect(() => {
    dispatch(getAllSales());
    let authToken = acAddress.authToken ? acAddress.authToken : null;
    if (authToken) {
      dispatch(getTotalMid()).unwrap();
      dispatch(getTokenCount()).unwrap();
    } else {
      dispatch(resetTokenData());
    }
  }, [dispatch, acAddress.authToken]);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand("copy");
  }

  return (
    <div className="ico-distribution-view">
      <Row>
        <Col xl="8">
          <Card body className="cards-dark">
            <Card.Title as="h4">ICO Distribution, Rate & Sales Info</Card.Title>
            <Card.Text>
              To become a part of our project, you can found all details of ICO.
            </Card.Text>
            <Card.Text>
              You can get a quick response and chat with our team in Telegram:
              htts://t.me/
            </Card.Text>
            <div className="ico-schedule">
              <Card.Title as="h4">ICO Schedule</Card.Title>
              <Row className="g-0">
                <Col md="6" lg="5">
                  <h5>
                    Pre Sale ICO
                    {/* <Badge bg="success">RUNNING</Badge> */}
                  </h5>
                  {/* <Card.Text>Start at Dec 02, 2018 - 11:00 AM</Card.Text> */}
                  <Card.Text>Start at {getDateFormate(
                    allSales[0]?.start_sale,
                    "MMM DD, YYYY HH:mm:ss"
                  )}</Card.Text>
                  
                  <Card.Text>
                    End at {getDateFormate(
                    allSales[0]?.end_sale,
                    "MMM DD, YYYY HH:mm:ss"
                  )}
                  </Card.Text>
                </Col>
                <Col md="6" lg="4">
                  <h5>4.00 MID</h5>
                  <Card.Text>Min purchase - 4.00 MID</Card.Text>
                  <Card.Text>Token Distribute - {allSales[0]?.total_token}</Card.Text>
                </Col>
                <Col md="12" lg="auto" className="ms-auto">
                  <Button variant="outline-success">10 % Bonus</Button>
                </Col>
              </Row>
              <hr />
              <Row className="g-0">
                <Col md="6" lg="5">
                  <h5>
                    Main Sale ICO
                    {/* <Badge bg="secondary">RUNNING</Badge> */}
                  </h5>
                  <Card.Text>
                  Start at {getDateFormate(
                    allSales[1]?.start_sale,
                    "MMM DD, YYYY HH:mm:ss"
                  )}
                  </Card.Text>
                  <Card.Text>
                  End at {getDateFormate(
                    allSales[1]?.end_sale,
                    "MMM DD, YYYY HH:mm:ss"
                  )}
                  </Card.Text>
                </Col>
                <Col md="6" lg="4">
                  <h5>3.45 MID</h5>
                  <Card.Text>Min purchase - 3.45 MID</Card.Text>
                  <Card.Text>Token Distribute - {allSales[1]?.total_token}</Card.Text>
                </Col>
              </Row>
            </div>
          </Card>
          <Card body className="cards-dark referral">
            <Card.Title as="h4">
              Invite your friends and family and receive free tokens
            </Card.Title>
            <Card.Text>
              Each member have a unique Our referral link to share with friends
              and family and receive a bonus - 10% of the value of their
              contribution. If any one sign-up with this link, will be added to
              your referral program. The referral link may be used during a
              token sales running.
            </Card.Text>
            {acAddress && acAddress.authToken && (
              <>
                <Card.Title as="h4">Referral URL</Card.Title>
                <Form.Group className="form-group">
                  <Form.Label>Referral URL</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      ref={textAreaRef}
                      // disabled
                      type="text"
                      value={referralLink}
                      readOnly={true}
                    />
                    <Button
                      variant="secondary"
                      ref={target}
                      onClick={() => {
                        setShow(!show);
                        copyToClipboard();
                      }}
                    >
                      <CopyIcon width="24" height="24" />
                    </Button>
                    <Overlay
                      target={target.current}
                      show={show}
                      placement="top"
                    >
                      {(props) => (
                        <Tooltip id="ReferralURL" {...props}>
                          Copied!
                        </Tooltip>
                      )}
                    </Overlay>
                  </div>
                </Form.Group>
                <div className="share-with">
                  Share with :
                  <a href="#/">
                    <TwitterShareButton
                      title={referralContent}
                      url={referralLink.trim()}
                    >
                      <TwitterShareIcon width="22" height="19" />
                    </TwitterShareButton>
                  </a>
                  <a href="#/">
                    <FacebookShareButton
                      quote={referralContent}
                      url={referralLink.trim()}
                    >
                      <FacebookShareIcon width="20" height="20" />
                    </FacebookShareButton>
                  </a>
                </div>
              </>
            )}
          </Card>
        </Col>
        <Col xl="4">
          <Row className="mt-lg-3 mt-xl-0">
            <Col xl="12" lg="6">
              <div className="top-green-card">
                <Card body className="green-card">
                  <TokenBalanceProgress />
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
    </div>
  );
};

export default IcoDistributionPage;
