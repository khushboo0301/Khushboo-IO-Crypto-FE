import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, ProgressBar, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropzone from "react-dropzone";
import {
  CameraLineIcon,
  CheckmarkIcon,
  GreenCheckIcon,
  RedCrossIcon,
} from "./SVGIcon";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  userGetData,
  userGetFullDetails,
  userDetails,
} from "../store/slices/AuthSlice";
import moment from "moment";

import jwtAxios from "../service/jwtAxios";
import { CalenderIcon } from "./SVGIcon";
import { forwardRef } from "react";
import * as flatted from "flatted";
import SelectLocationDropdown from "./SelectLocationDropdown";
import SelectLocationKYCDropdown from "./SelectKYCDropdown";

//KYC verification model with functionality
export const KYCVerification = (props) => {
  const acAddress = useSelector(userDetails);
  const [isMobile, setIsMobile] = useState(false);
  const { setkycsubmitted, ...rest } = props;
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [dob, setDob] = useState(new Date());
  const [country_of_issue, setCountryOfIssue] = useState("United States");
  const [city, setCity] = useState(null);
  const [mname, setMname] = useState(null);
  const [postal_code, setPostalCode] = useState(null);
  const [verified_with, setVerifiedWith] = useState(null);
  const [res_address, setResAddress] = useState(null);
  const [passport_url, setPassportUrl] = useState(null);
  const [user_photo_url, setUserPhotoUrl] = useState(null);
  const [wallet_type, setWalletType] = useState(null);
  const [wallet_address, setWalletAddress] = useState(null);
  const userDetailsAll = useSelector(userGetFullDetails);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isKYCSubmitted, setISKYCSubmitted] = useState(false);
  const [checkboxState, setCheckboxState] = useState(
    flatted.parse(flatted.stringify([]))
  );
  const [imageUrlLocationSet, setImageLocationUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageUrlCountrySet, setImageCountryUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageLocationSearchUrlSet, setImageLocationSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageCountrySearchUrlSet, setImageCountrySearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [selectedLocationOption, setSelectedLocationOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [selectedCountryOption, setSelectedCountryOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [searchLocationText, setSearchLocationText] = useState(
    `${selectedLocationOption?.country}`
  );

  const [searchCountryText, setSearchCountryText] = useState(
    `${selectedCountryOption?.country}`
  );

  const [country, setCountry] = useState("US");
  const [location, setLocation] = useState("US");
  const [nationality, setNationality] = useState("United States");

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onChange = (e) => {
    if (e.target.name === "nationality") {
      setNationality(e.target.value);
    }
    if (e.target.name === "fname") {
      setFname(e.target.value ? e.target.value : null);
    }
    if (e.target.name === "lname") {
      setLname(e.target.value ? e.target.value : null);
    }
    if (e.target.name === "mname") {
      setMname(e.target.value ? e.target.value : null);
    }
    if (e.target.name === "dob") {
      setDob(e.target.value);
    }
    if (e.target.name === "res_address") {
      setResAddress(e.target.value ? e.target.value : null);
    }
    if (e.target.name === "postal_code") {
      let nonAlphanumericRegex = /[^a-zA-Z0-9]/g;
      e.target.value = e.target.value.replace(nonAlphanumericRegex, "");
      setPostalCode(e.target.value ? e.target.value : null);
    }
    if (e.target.name === "city") {
      setCity(e.target.value ? e.target.value : null);
    }
    if (e.target.name === "country") {
      setCountryOfIssue(e.target.value);
    }
    if (e.target.name === "wallet_type") {
      setWalletType(e.target.value);
    }
    if (e.target.name === "wallet_address") {
      setWalletAddress(e.target.value);
    }
  };

  const verifiedWith = (verifiedDoc) => {
    setVerifiedWith(verifiedDoc);
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

  const currentDate = (date) => {
    const formattedDate = date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    return formattedDate;
  };

  const handleNext = async () => {
    if (isError) {
      return;
    }
    setLoading(true);
    if (step === 1) {
      setStep(step + 1);
    }
    if (step === 2) {
      if (nationality === null) {
        dispatch(notificationFail("Please Enter Nationality"));
      } else if (fname === null) {
        dispatch(notificationFail("Please Enter First Name"));
      } else if (lname === null) {
        dispatch(notificationFail("Please Enter Last Name"));
      } else if (dob === null) {
        dispatch(notificationFail("Please Enter Date of Birth"));
      } else {
        setStep(step + 1);
      }
    }
    if (step === 3) {
      if (res_address === null) {
        dispatch(notificationFail("Please Enter Residential Address"));
      } else if (postal_code === null) {
        dispatch(notificationFail("Please Enter Postal Code"));
      } else if (city === null) {
        dispatch(notificationFail("Please Enter City"));
      } else {
        setStep(step + 1);
      }
    }
    if (step === 4) {
      if (country_of_issue === null) {
        dispatch(notificationFail("Please Enter Country"));
      } else if (verified_with === null) {
        setLoading(false);
        dispatch(notificationFail("Please Select Verification ID Proof"));
      } else {
        setLoading(true);
        setStep(step + 1);
      }
    }
    if (step === 5) {
      if (passport_url === null) {
        setLoading(false);
        dispatch(notificationFail("Please Select Passport Photo"));
      } else {
        setStep(step + 1);
      }
    }
    if (step === 6) {
      if (user_photo_url === null) {
        setLoading(false);
        dispatch(notificationFail("Please Select User Photo"));
      } else {
        setStep(step + 1);
      }
    }
    if (step === 7) {
      if (wallet_address === null) {
        dispatch(notificationFail("Please Select User Wallet Address"));
      } else {
        if (
          ["terms", "personal", "registering", "participate"].every((option) =>
            checkboxState.includes(option)
          )
        ) {
          let formData = new FormData();
          formData.append(
            "user_photo_url",
            user_photo_url,
            user_photo_url.name
          );
          formData.append("passport_url", passport_url, passport_url.name);
          formData.append("fname", fname);
          formData.append("lname", lname);
          if (mname) {
            formData.append("mname", mname);
          }
          formData.append("nationality", nationality);
          formData.append("dob", dob.toLocaleDateString("en-GB"));
          formData.append("res_address", res_address);
          formData.append("city", city);
          formData.append("postal_code", postal_code);
          formData.append("country_of_issue", country_of_issue);
          formData.append("verified_with", verified_with);

          setError(true);
          let updateUser = await jwtAxios
            .put(`/users/updateKyc`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .catch((error) => {
              setError(false);
              if (error?.response?.data?.message === "") {
                dispatch(notificationFail("Invalid"));
              }
              dispatch(notificationFail(error?.response?.data?.message));
            });
          if (updateUser) {
            setISKYCSubmitted(true);
            setkycsubmitted(true);
            setError(false);
            setStep(step + 1);
            dispatch(notificationSuccess("KYC verification is submitted"));
          }
        } else {
          dispatch(notificationFail("Please Check terms and conditions"));
        }
      }
    }
    if (step === 8) {
    }
  };

  const handleCheckboxChange = (filterType) => {
    setCheckboxState((prevState) => {
      if (prevState.includes(filterType)) {
        return prevState.filter((f) => f !== filterType);
      } else {
        return [...prevState, filterType];
      }
    });
  };

  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  useEffect(() => {
    if (isLoading) {
      simulateNetworkRequest().then(() => {
        if (!isError) {
          setLoading(false);
        }
      });
    }
  }, [isLoading, isError]);

  const fetchKYCData = (userDetailsAll) => {
    let user = userDetailsAll;
    if (user) {
      setFname(user?.fname ? user.fname : null);
      setLname(user?.lname ? user.lname : null);
      setNationality(user?.lname ? user.lname : null);
      setCity(user?.city ? user?.city : null);
      setWalletType(user?.wallet_type ? user?.wallet_type : null);
      setWalletAddress(acAddress?.account ? acAddress?.account : null);
      setDob(user?.dob ? moment(user?.dob, "DD/MM/YYYY").toDate() : null);
    }

    if (user?.nationality) {
      setNationality(user?.nationality);
    } else {
      setNationality("United States");
    }

    if (user?.country_of_issue) {
      setCountryOfIssue(user?.country_of_issue);
    } else {
      setCountryOfIssue("United States");
    }
  };

  useEffect(() => {
    fetchKYCData(userDetailsAll);
  }, [userDetailsAll]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setError(true);
    setLoading(true);
    const response = await jwtAxios
      .post("/users/validate-file-type", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {
        if (step == 5) {
          setPassportUrl(null);
        }
        if (step == 6) {
          setUserPhotoUrl(null);
        }
        // setError(true);
        setLoading(false);
        dispatch(notificationFail(err.response?.data?.message));
      });
    setError(false);
    setLoading(false);
  };

  const cancleKYC = () => {
    if (isKYCSubmitted) {
      dispatch(userGetData(userGetData.userid)).unwrap();
    }
    fetchKYCData(userDetailsAll);
    setCountry("US");
    setLocation("US");
    setMname(null);
    setResAddress(null);
    setPostalCode(null);
    setVerifiedWith(null);
    setPassportUrl(null);
    setUserPhotoUrl(null);
    setCheckboxState([]);
    setSearchLocationText("United States");
    setSearchCountryText("United States");
    setImageLocationUrl("https://flagcdn.com/h40/us.png");
    setImageCountryUrl("https://flagcdn.com/h40/us.png");
    setImageLocationSearchUrl("https://flagcdn.com/h40/us.png");
    setImageCountrySearchUrl("https://flagcdn.com/h40/us.png");
    setSelectedLocationOption({
      country: "United States",
      code: " +1",
      iso: "US",
      cca3: "USA",
    });
    setSelectedCountryOption({
      country: "United States",
      code: " +1",
      iso: "US",
      cca3: "USA",
    });
    props.onHide();
    setStep(1);
  };

  return (
    <Modal
      {...rest}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
      onHide={cancleKYC}
    >
      <Form id="form-reset">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1
              ? "KYC Verification"
              : step === 2 || step === 3
              ? "Personal information"
              : step === 4
              ? "Intermediate Verification"
              : step === 5
              ? "Identity Verification"
              : step === 6
              ? "Intermediate Verification"
              : step === 7
              ? "Your Paying"
              : "Complete"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="kyc-step">
          {step === 1 && (
            <>
              <p>
                To comply with regulations each participant is required to go
                through identity verification (KYC/AML) to prevent fraud, money
                laundering operations, transactions banned under the sanctions
                regime or those which fund terrorism. Please, complete our fast
                and secure verification process to participate in token
                offerings.
              </p>
              <h4>
                You have not submitted your necessary documents to verify your
                identity.
              </h4>
              <p className="mb-0">
                It would great if you please submit the form. If you have any
                question, please feel free to contact our support team.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <Form.Group className="form-group">
                <Form.Label>Nationality</Form.Label>
                <div className="d-flex items-center phone-number-dropdown justify-between phone-number-dropdown-kyc">
                  <Form.Control
                    name="nationality"
                    placeholder={nationality}
                    type="text"
                    value={nationality}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    disabled
                    maxLength="10"
                    className={isMobile ? "md:w-auto w-full" : ""}
                  />
                  <div
                    className={`kyc-mobile-popup ${
                      isMobile
                        ? "text-center relative mobile-setting-dropdown flex items-center"
                        : ""
                    }`}
                  >
                    {nationality ? (
                      <img
                        src={imageUrlLocationSet}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}
                    <SelectLocationKYCDropdown
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
              <Row>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Alex"
                      name="fname"
                      value={fname}
                      onChange={(e) => onChange(e)}
                      disabled={userDetailsAll?.fname ? true : false}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last name"
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
                    <Form.Label>Middle name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1"
                      name="mname"
                      value={mname}
                      onChange={(e) => onChange(e)}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Date of birth</Form.Label>
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
              </Row>
            </>
          )}
          {step === 3 && (
            <>
              <Form.Group className="form-group">
                <Form.Label>Residential address (additional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your address"
                  name="res_address"
                  value={res_address}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
              <Row>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Postal code (additional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Postal code"
                      name="postal_code"
                      value={postal_code}
                      onChange={(e) => onChange(e)}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City"
                      name="city"
                      value={city}
                      onChange={(e) => onChange(e)}
                      disabled={userDetailsAll?.city ? true : false}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          {step === 4 && (
            <>
              <Form.Group className="form-group mb-4">
                <Form.Label>Country/Region of Issue</Form.Label>
                <div className="d-flex items-center location-dropdown justify-between phone-number-dropdown-kyc ">
                  <Form.Control
                    name="country"
                    placeholder={country_of_issue}
                    type="text"
                    value={country_of_issue}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    disabled
                    maxLength="10"
                    className={isMobile ? "md:w-auto w-full" : ""}
                  />
                  <div
                    className={`kyc-mobile-popup ${
                      isMobile
                        ? "text-center relative mobile-setting-dropdown flex items-center"
                        : ""
                    }`}
                  >
                    {country_of_issue ? (
                      <img
                        src={imageUrlCountrySet}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}

                    <SelectLocationDropdown
                      selectedLocationOption={selectedCountryOption}
                      setSelectedLocationOption={setSelectedCountryOption}
                      setImageLocationUrl={setImageCountryUrl}
                      imageUrlLocationSet={imageUrlCountrySet}
                      setImageLocationSearchUrl={setImageCountrySearchUrl}
                      imageLocationSearchUrlSet={imageCountrySearchUrlSet}
                      setSearchLocationText={setSearchCountryText}
                      searchLocationText={searchCountryText}
                      setCountry={setCountry}
                      country={country}
                      setNationality={setCountryOfIssue}
                    />
                  </div>
                </div>
              </Form.Group>
              <h4>Use a valid government-issued document</h4>
              <p>
                Only the following documents listed below will be accepted, all
                other documents will be rejected.
              </p>

              <div
                className="document-issued form-check"
                onClick={() => verifiedWith("government-passport")}
              >
                <div
                  className={`form-check-input ${
                    verified_with === "government-passport" ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                  <>
                    Passport
                    <div className="checkmark">
                      <CheckmarkIcon width="10" height="8" />
                    </div>
                  </>
                </label>
              </div>

              <div
                className="document-issued form-check"
                onClick={() => verifiedWith("government-license")}
              >
                <div
                  className={`form-check-input ${
                    verified_with === "government-license" ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                  <>
                    Driver's License
                    <div className="checkmark">
                      <CheckmarkIcon width="10" height="8" />
                    </div>
                  </>
                </label>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h5>Take a Photo of Passport</h5>
              <ul className="document-info">
                <li>
                  <GreenCheckIcon width="10" height="8" />
                  Original full-size, unedited documents
                </li>
                <li>
                  <GreenCheckIcon width="10" height="8" />
                  Place documents against a single-coloured background
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" />
                  No black and white images
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" />
                  No edited or expired documents
                </li>
              </ul>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setPassportUrl(acceptedFiles[0]);
                  handleFileUpload(acceptedFiles[0]);
                }}
                name="passport_url"
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input
                      {...getInputProps({ accept: "image/*, application/pdf" })}
                    />
                    <Row>
                      <Col sm="12" className="d-flex items-center">
                        <CameraLineIcon width="23" height="24" /> Take a photo
                      </Col>
                      {passport_url && (
                        <ul>
                          {passport_url && (
                            <li key={passport_url.path}>
                              {passport_url.path} -{" "}
                              {(passport_url.size / 1024).toFixed(2)} KB
                            </li>
                          )}
                        </ul>
                      )}
                    </Row>
                  </div>
                )}
              </Dropzone>
              <p className="mb-0">
                File size must be between 10KB and 5120KB in ..jpg/.jpeg/.png
                format.
              </p>
            </>
          )}
          {step === 6 && (
            <>
              <h5>Upload portrait photo</h5>
              <ul className="document-info">
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't use beauty
                  photos
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't wear hats{" "}
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't make up
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't take screenshots
                </li>
              </ul>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setUserPhotoUrl(acceptedFiles[0]);
                  handleFileUpload(acceptedFiles[0]);
                }}
                name="user_photo_url"
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <Row>
                      <Col sm="12" className="d-flex items-center">
                        <CameraLineIcon width="23" height="24" /> Take a photo
                      </Col>
                      {user_photo_url && (
                        <ul>
                          {user_photo_url && (
                            <li key={user_photo_url.path}>
                              {user_photo_url.path} -{" "}
                              {(user_photo_url.size / 1024).toFixed(2)} KB
                            </li>
                          )}
                        </ul>
                      )}
                    </Row>
                  </div>
                )}
              </Dropzone>
              <p className="mb-0">
                Please ensure that your face is centered well lit, and visible
                when capturing the photo to avoid facial recognition errors
              </p>
            </>
          )}
          {step === 7 && (
            <>
              <h5>Select Wallet</h5>
              <Form.Group className="form-group">
                <Form.Label>Wallet Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your wallet Type"
                  name="wallet_type"
                  onChange={(e) => {
                    setWalletType(e.target.value);
                  }}
                  value={wallet_type}
                  disabled={userDetailsAll?.wallet_type ? true : false}
                />
              </Form.Group>
              <Form.Group className="form-group mb-4">
                <Form.Label>Enter your wallet address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your wallet address"
                  name="wallet_address"
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                  }}
                  value={wallet_address}
                />
              </Form.Group>
              <p className="mb-4">
                Please ensure that your face is centered well lit, and visible
                when capturing the photo to avoid facial recognition errors
              </p>
              <div
                className="terms-checkbox form-check"
                onClick={() => handleCheckboxChange("terms")}
              >
                <div
                  className={`form-check-input ${
                    checkboxState.includes("terms") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                  I have read the Terms and Condition and Privacy and Policy.
                </label>
              </div>
              <div
                className="terms-checkbox form-check"
                onClick={() => handleCheckboxChange("personal")}
              >
                <div
                  className={`form-check-input ${
                    checkboxState.includes("personal") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                  All the personal information I have entered is correct.
                </label>
              </div>
              <div
                className="terms-checkbox form-check"
                onClick={() => handleCheckboxChange("registering")}
              >
                <div
                  className={`form-check-input ${
                    checkboxState.includes("registering") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                  I certify that, I am registering to participate in the token
                  distribution event(s) in the capacity of an individual (and
                  beneficial owner) and not as an agent or representative of a
                  third party corporate entity.
                </label>
              </div>

              <div
                className="terms-checkbox form-check"
                onClick={() => handleCheckboxChange("participate")}
              >
                <div
                  className={`form-check-input ${
                    checkboxState.includes("participate") ? "checked" : ""
                  }`}
                />
                <label class="form-check-label">
                  I understand that, I can participate in the token distribution
                  event(s) only with the wallet address that was entered in the
                  application form.
                </label>
              </div>
            </>
          )}
          {step === 8 && (
            <>
              <h5 className="mb-4">Verification Under Review</h5>
              <p className="mb-0">
                Verification Under Review{" "}
                <strong>{currentDate(new Date())}</strong>
              </p>
            </>
          )}
          <div className="form-action-group">
            {step === 1 ? (
              <Button variant="primary" className="w-100" onClick={handleNext}>
                Continue to complete KYC
              </Button>
            ) : step === 2 ||
              step === 3 ||
              step === 4 ||
              step === 5 ||
              step === 6 ||
              step === 7 ||
              step === 8 ? (
              <>
                <ProgressBar variant="success" now={(100 / 8) * step} />
                {step !== 8 ? (
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={!isLoading ? handleNext : null}
                  >
                    {isLoading ? "Submitting…" : "Continue"}
                  </Button>
                ) : (
                  <Button variant="primary" as={Link} to="/">
                    Go home
                  </Button>
                )}
                <Button variant="secondary" onClick={(e) => cancleKYC(e)}>
                  Cancel
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

export default KYCVerification;
