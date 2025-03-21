import Highcharts from "highcharts/highstock";
import React, { useEffect, useState } from "react";
import { Button, Card, Nav, Navbar } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, useLocation } from "react-router-dom";
import {
  EscrowIcon,
  HomeIcon,
  QuestionIcon,
  TradeHistoryIcon,
} from "./SVGIcon";
import { userDetails } from "../store/slices/AuthSlice";
import { useSelector } from "react-redux";

//this component is used for sidebar view
export const Sidebar = (props) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState();
  const acAddress = useSelector(userDetails);
  const [twoFAFlow,setTwoFAFlow] = useState(true);
  const handleResizePage = () => {
    if (Highcharts.charts) {
      Highcharts.charts.map((val) => {
        if (val) {
          setTimeout(() => val.reflow(), 200);
        }
        return val;
      });
    }
  };

  useEffect(() => {
    // Update the active key based on the current URL
    setActiveKey(location.pathname);
    if(props.isResponsive)
    {
      props.setIsOpen(false);
    }
  }, [location,props.isResponsive]);

  useEffect(() => {
    if (props.getUser?.is_2FA_verified === false) {
      setTwoFAFlow(false);
    }
  },[props.getUser?.is_2FA_verified])

  return (
    <div className="sidebar">
      <div className="d-flex nav-header">
        <Navbar.Brand className="menu-hide" as={Link} to="/">
          <img src={require("../content/images/icon-logo.png")} alt="Ico App" />
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => {
            props.clickHandler();
            handleResizePage();
          }}
          aria-controls="basic-navbar-nav"
        />
      </div>
      <div className="sidebar-scroll">
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <div className="nav-title">Ico App</div>
          <Nav as="ul" activeKey={activeKey}>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="/"
                to={"/"}
                className={activeKey === "/" && "active"}
              >
                <HomeIcon width="24" height="24" />{" "}
                <span className="menu-hide">Dashboard</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="buy-token"
                to={"/buy-token"}
                // to={acAddress.authToken && "/buy-token"}
                // onClick={!acAddress.authToken ? props.setModalShow :undefined}
                className={activeKey === "/buy-token" && "active"}
              >
                <EscrowIcon width="24" height="24" />{" "}
                <span className="menu-hide">Buy Token</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="ico-distribution"
                // to={acAddress.authToken && "/ico-distribution"}
                // onClick={!acAddress.authToken ? props.setModalShow : undefined}
                to={"/ico-distribution"}
                className={activeKey === "/ico-distribution" && "active"}
              >
                <TradeHistoryIcon width="24" height="24" />{" "}
                <span className="menu-hide">Ico Distribution</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="staking"
                to={"/staking"}
                // to={acAddress.authToken && "/staking"}
                // onClick={!acAddress.authToken ? props.setModalShow : undefined}
                className={activeKey === "/staking" && "active"}
              >
                <QuestionIcon width="24" height="24" />{" "}
                <span className="menu-hide">Staking</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="transaction"
                to={acAddress.authToken && "/transaction"}
                onClick={!acAddress.authToken ? props.setModalShow : undefined}
                className={activeKey === "/transaction" && "active"}
              >
                <QuestionIcon width="24" height="24" />{" "}
                <span className="menu-hide">Transaction</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="profile"
                to={acAddress.authToken && "/profile"}
                onClick={!acAddress.authToken ? props.setModalShow : undefined}
                className={activeKey === "/profile" && "active"}
              >
                <QuestionIcon width="24" height="24" />{" "}
                <span className="menu-hide">Profile</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </PerfectScrollbar>
      </div>
      <Card className="cards-dark menu-hide">
        <Card.Body>
          <Card.Title>Contact us</Card.Title>
          <Card.Text>
            For all inquiries, please email us using the form below
          </Card.Text>
          <Button variant="primary">Contact us</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sidebar;
