import React, { useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

export const StakeScallopPage = () => {
  const [saveActivities, setSaveActivities] = useState("");

  const handleSwitchClick = (e) => {
    setSaveActivities(e);
  };
  return (
    <div className="stake-scallop-view">
      <Row>
        <Col lg="8">
          <Card body className="cards-dark">
            <Card.Title as="h4">Stake Scallop</Card.Title>
            <Form.Group className="form-group">
              <div className="d-flex justify-content-between">
                <div>
                  <Form.Label>Referral URL</Form.Label>
                  <Form.Control type="text" placeholder="0.000" />
                </div>
                <div className="text-end">
                  <Form.Label>Balance : 0 ICO</Form.Label>
                  <div className="d-flex align-items-center balance-ico">
                    <Badge bg="success">Max</Badge>
                    <div className="token-type">
                      <span className="token-icon"></span>Token
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
            <Card.Title as="h4">
              Select Locking Period January 27, 2023 - January 27, 2027
            </Card.Title>
            <div className="locking-period">
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('1 M')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '1 M' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                1 M
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('2 M')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '2 M' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                2 M
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('3 M')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '3 M' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                3 M
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('6 M')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '6 M' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                6 M
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('1 Y')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '1 Y' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                1 Y
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('2 Y')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '2 Y'? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                2 Y
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('3 Y')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '3 Y' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                3 Y
                </label>
              </div>
              <div
                className="form-check"
                onClick={() => {handleSwitchClick('4 Y')}}
              >
                <div
                  className={`form-check-input ${
                    saveActivities === '4 Y' ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                4 Y
                </label>
              </div>
            </div>
            <Card.Title as="h4" className="estimated-apr">
              <span>
                Estimated APR{" "}
                <span className="text-muted">(APR Subject to change)</span>
              </span>{" "}
              <span>0%</span>
            </Card.Title>
            <Card.Text>
              To be eligible to get Elite Membership Benefits and USD$2500.
              Click here to learn more about Elite Membership.
            </Card.Text>
            <div className="form-action-group">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Review Stake</Button>
            </div>
          </Card>
        </Col>
        <Col lg="4">
          <Card body className="cards-dark steps-staking">
            <Card.Title as="h4">3 Steps to Staking Token</Card.Title>
            <ul>
              <li className="d-flex align-items-center">
                Watch how to setup Metamask on youtube.
              </li>
              <li className="d-flex align-items-center">
                Watch how to buy Token from KuCoin.
              </li>
              <li className="d-flex align-items-center">
                Watch how to stake Token on Scallop app.
              </li>
            </ul>
            <Button variant="primary">Watch on youtube</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StakeScallopPage;
