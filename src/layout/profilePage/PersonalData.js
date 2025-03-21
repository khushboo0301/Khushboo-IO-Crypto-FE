import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationFail,
  notificationSuccess,
} from "../../store/slices/notificationSlice";
import { userGetData, userGetFullDetails } from "../../store/slices/AuthSlice";
import jwtAxios from "../../service/jwtAxios";
import listData from "./../../component/countryData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CalenderIcon } from "../../component/SVGIcon";
import { forwardRef } from "react";
import SelectOptionDropdown from "./../../component/SelectOptionDropdown";
import SelectLocationDropdown from "./../../component/SelectLocationDropdown";

import CryptoJS from "crypto-js";

const secretKey = "your-secret-key";

function decryptEmail(encryptedEmail) {
  try {
    // Split the encrypted email into IV and encrypted text (assuming 'IV:EncryptedData' format)
    const [iv, encryptedText] = encryptedEmail.split(":");

    if (!iv || !encryptedText) {
      throw new Error("Invalid encrypted email format");
    }

    // Ensure the secret key is hashed and truncated to 32 bytes, just like in Node.js
    const hashedKey = CryptoJS.SHA256(secretKey)
      .toString(CryptoJS.enc.Base64)
      .substr(0, 32);

    // Convert the IV and encrypted text to the appropriate formats
    const ivHex = CryptoJS.enc.Hex.parse(iv); // Convert IV to a Hex format
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedText); // Convert encrypted text to Hex format

    // Decrypt the email using AES-256-CBC with the hashed key and IV
    const decryptedBytes = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData },
      CryptoJS.enc.Utf8.parse(hashedKey),
      { iv: ivHex, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    // Convert the decrypted bytes back to a string
    const decryptedEmail = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedEmail) {
      throw new Error("Failed to decrypt email. Invalid data or key.");
    }

    return decryptedEmail; // Return the decrypted email
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
}

export const PersonalData = () => {
  const dispatch = useDispatch();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("US");
  const [nationality, setNationality] = useState("United States");
  const [countryCallingCode, setCountryCallingCode] = useState(" +1");
 console.log("countryCallingCode ", countryCallingCode);
  const userDetailsAll = useSelector(userGetFullDetails);
  const [isMobile, setIsMobile] = useState(false);

  const [imageUrlSet, setImageUrl] = useState("https://flagcdn.com/h40/us.png");
  const [imageSearchUrlSet, setImageSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [selectedOption, setSelectedOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [searchText, setSearchText] = useState(
    `${selectedOption?.country} (${selectedOption?.code})`
  );

  const [selectedLocationOption, setSelectedLocationOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [imageUrlLocationSet, setImageLocationUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageLocationSearchUrlSet, setImageLocationSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [searchLocationText, setSearchLocationText] = useState(
    `${selectedLocationOption?.country}`
  );

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let user = userDetailsAll;
 console.log("user ", user);

    if (user) {
      setFname(user?.fname ? user?.fname : "");
      setLname(user?.lname ? user?.lname : "");
      setPhone(user?.phone ? decryptEmail(user?.phone) : "");
      setEmail(user?.email ? decryptEmail(user?.email) : "");
      setCity(user?.city ? user?.city : "");
      setDob(user?.dob ? moment(user?.dob, "DD/MM/YYYY").toDate() : "");
      setLocation(user?.location ? user?.location : "US");
    }

    if (user?.location) {
      setLocation(user?.location);
      const result = listData.find((item) => item?.iso === user?.location);
      setSelectedLocationOption(result);
      setImageLocationUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
      setImageLocationSearchUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
      setSearchLocationText(result?.country);
    }

    if (user?.phoneCountry) {
      setCountryCallingCode(decryptEmail(user?.phoneCountry));
      const result = listData.find((item) => item?.cca3 === (user?.cca3?.trim() || 'USA'));
      setSelectedOption(result);
      setImageUrl(`https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`);
      setSearchText(`${result?.country} (${result?.code})`);
      setImageSearchUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
    } else {
      console.log("else")
      setCountryCallingCode(" +1");
    }
  }, [userDetailsAll]);

  const onChange = (e) => {
    if (e.target.name === "fname") {
      setFname(e.target.value);
    } else if (e.target.name === "lname") {
      setLname(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "phone") {
      const value = e.target.value.replace(/\D/g, "");
      setPhone(value);
    } else if (e.target.name === "city") {
      setCity(e.target.value);
    } else if (e.target.name === "dob") {
      setDob(e.target.value);
    } else if (e.target.name === "location") {
      setLocation(e.target.value);
    }
  };

  const submitHandler = async () => {
    if (!fname) {
      dispatch(notificationFail("Please Enter First Name"));
    } else if (!lname) {
      dispatch(notificationFail("Please Enter Last Name"));
    } else if (!phone) {
      dispatch(notificationFail("Please Enter phone number"));
    } else if (!email) {
      dispatch(notificationFail("Please Enter email"));
    } else if (!dob) {
      dispatch(notificationFail("Please Enter Date of Birth"));
    } else if (!city) {
      dispatch(notificationFail("Please Enter city"));
    }

    if (phone && email && fname && lname && dob && city && location) {
      let formSubmit = {
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        dob: dob.toLocaleDateString("en-GB"),
        location: location,
        city: city,
        phoneCountry: countryCallingCode,
        cca3: selectedOption?.cca3
      };
      let updateUser = await jwtAxios
        .put(`/users/updateAccountSettings`, formSubmit)
        .catch((error) => {
          if (typeof error == "string") {
            dispatch(notificationFail(error));
          }
          if (error?.response?.data?.message === "") {
            dispatch(notificationFail("Invalid "));
          }
          if (error?.response?.data?.message) {
            dispatch(notificationFail(error?.response?.data?.message));
          }
        });
      if (updateUser) {
        dispatch(userGetData(userGetData.userid)).unwrap();
        dispatch(notificationSuccess("User profile update successfully !"));
      }
    }
  };

  const DatepickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{ display: "flex" }} onClick={onClick}>
      <Form.Control
        className="example-custom-input"
        ref={ref}
        value={value}
        readOnly
        placeholder="DD/MM/YYYY"
      />
      <CalenderIcon width={30} height={30} />
    </div>
  ));

  return (
    <Card body className="cards-dark personal-data">
      <Card.Title as="h2">Personal Data</Card.Title>
      <Form>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John"
                name="fname"
                value={fname}
                onChange={(e) => onChange(e)}
                disabled={userDetailsAll?.fname ? true : false}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Doe"
                name="lname"
                value={lname}
                onChange={(e) => onChange(e)}
                disabled={userDetailsAll?.lname ? true : false}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Email (required)</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                disabled={userDetailsAll?.email_verified ? true : false}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group mb-4">
              <Form.Label>Phone number (required)</Form.Label>
              <div
                className={`d-flex items-center phone-number-dropdown justify-between relative`}
              >
                <Form.Control
                  placeholder={countryCallingCode}
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => onChange(e)}
                  maxLength="10"
                  className={isMobile ? "md:w-auto w-full" : ""}
                />
                <div
                  className={`text-center flex items-center mobile-setting-dropdown ${
                    isMobile ? "relative" : ""
                  }`}
                >
                  {selectedOption?.code ? (
                    <img src={imageUrlSet} alt="Flag" className="circle-data" />
                  ) : (
                    "No Flag"
                  )}
                  <SelectOptionDropdown
                    setImageUrl={setImageUrl}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    setCountryCallingCode={setCountryCallingCode}
                    countryCallingCode={countryCallingCode}
                    setSearchText={setSearchText}
                    searchText={searchText}
                    setImageSearchUrl={setImageSearchUrl}
                    imageSearchUrlSet={imageSearchUrlSet}
                  />
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Date of Birth</Form.Label>
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                className="form-control"
                placeholderText="DD/MM/YYYY"
                name="dob"
                maxDate={new Date()}
                customInput={<DatepickerCustomInput />}
                disabled={userDetailsAll?.dob ? true : false}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Location</Form.Label>
              <div className="d-flex items-center location-dropdown justify-between relative">
                <Form.Control
                  placeholder={"City"}
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  className={isMobile ? "md:w-auto w-full" : ""}
                />
              
                <div
                  className={`text-center flex items-center mobile-setting-dropdown ${
                    isMobile ? "relative" : ""
                  }`}
                >
                  {location ? (
                      <img
                        src={imageUrlLocationSet}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}
                    <SelectLocationDropdown
                      selectedLocationOption={selectedLocationOption}
                      setSelectedLocationOption={setSelectedLocationOption}
                      setImageLocationUrl={setImageLocationUrl}
                      imageUrlLocationSet={imageUrlLocationSet}
                      setImageLocationSearchUrl={setImageLocationSearchUrl}
                      imageLocationSearchUrlSet={imageLocationSearchUrlSet}
                      setSearchLocationText={setSearchLocationText}
                      searchLocationText={searchLocationText}
                      setCountry={setLocation}
                      country={location}
                      setNationality={setNationality}
                    />
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <div class="edit-btn ">
          <button
            type="button"
            class="btn btn-success btn btn-success"
            onClick={submitHandler}
          >
            Update Profile
          </button>
        </div>
      </Form>
    </Card>
  );
};

export default PersonalData;
