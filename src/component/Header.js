import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userDetails } from "../store/slices/AuthSlice";
import { hideAddress } from "../utils";
import { LogoutIcon, SettingIcon, UserIcon } from "./SVGIcon";

// Header component definations
export const Header = (props) => {
  const { signOut, clickHandler, getUser } = props;
 console.log("getUser ", getUser);
  const [position, setPosition] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const acAddress = useSelector(userDetails);
  const [addressLine, setAddressLine] = useState("");
  const [showAddressError, setShowAddressError] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => {
      let moving = window.pageYOffset;

      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const checkAddressIntegrity = () => {
    const element = document.querySelector(".user-name");
    if (element && element.innerText === "") {
      setShowAddressError(true); // Set error if the address line is empty
    } else {
      setShowAddressError(false); // Reset error if address line is visible
    }
  };

  useEffect(() => {
    const interval = setInterval(checkAddressIntegrity, 500);
    return () => clearInterval(interval);
  }, [acAddress.authToken, addressLine]);


  // if (acAddress.account !== "Connect Wallet") {
  //   if (!getUser) {
  //     addressLine = "";
  //   } else if (getUser.is_2FA_verified && getUser.is_2FA_twilio_login_verified && acAddress.account) {
  //     addressLine = hideAddress(acAddress.account, 5);
  //   }
  // }

    // Function to update the address line
    const updateAddressLine = () => {
      if (
        acAddress?.account && 
        getUser?.is_2FA_verified && getUser?.is_2FA_twilio_login_verified
      ) {
        setAddressLine(hideAddress(acAddress.account, 5)); // Hide address if verified
      } else {
        setAddressLine("Connect Wallet");
      }
    };
  
    useEffect(() => {
      updateAddressLine();
    }, [acAddress, getUser]); // Trigger when acAddress or getUser changes

    

  const cls = visible ? "visible" : "hidden";
  return (
    <div className={`header d-flex ${cls}`}>
      <Navbar.Toggle
        onClick={clickHandler}
        className="d-block d-md-none"
        aria-controls="basic-navbar-nav"
      />
      <Nav className="ms-auto" as="ul">
        <Nav.Item
          as="li"
          onClick={acAddress.authToken ? null : props.clickModalHandler}
          className="login-menu"
        >
          {acAddress && (
            <span
              className={`user-name d-none d-md-block`}
              style={showAddressError ? { border: "1px solid red" } : {}}
            >
              {addressLine}
            </span>
          )}
        </Nav.Item>
        {acAddress &&
          acAddress?.authToken &&
          getUser &&
          getUser?.is_2FA_verified === true && getUser.is_2FA_twilio_login_verified && (
            <NavDropdown
              as="li"
              title={
                <img
                  className="rounded-circle"
                  style={{ width: "48px", height: "48px" }}
                  src={
                    acAddress?.imageUrl
                      ? acAddress?.imageUrl
                      : require("../content/images/avatar.png")
                  }
                  alt="No Profile"
                />
              }
              id="nav-dropdown"
            >
              <NavDropdown.Item as={Link} to={`/profile`}>
                <UserIcon width="18" height="18" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile">
                <SettingIcon width="18" height="18" />
                Account settings
              </NavDropdown.Item>
              <NavDropdown.Item onClick={signOut}>
                <LogoutIcon width="18" height="18" />
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
          )}
      </Nav>
    </div>
  );
};

export default Header;
