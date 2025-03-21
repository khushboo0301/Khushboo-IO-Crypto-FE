import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

export const Settings = () => {
  const [isVisibleOldPass, setVisibleOldPass] = useState(false);
  const toggleOldPass = () => {
    setVisibleOldPass(!isVisibleOldPass);
  };
  const [isVisibleNewPass, setVisibleNewPass] = useState(false);
  const toggleNewPass = () => {
    setVisibleNewPass(!isVisibleNewPass);
  };
  const [isVisibleConfirmPass, setVisibleConfirmPass] = useState(false);
  const toggleConfirmPass = () => {
    setVisibleConfirmPass(!isVisibleConfirmPass);
  };
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);

  const [saveActivities, setSaveActivities] = useState(false);

  const handleSwitchClick = () => {
    setSaveActivities(!saveActivities);
  };

  return (
    <Card body className="cards-dark">
      <Card.Title as="h2">Security Settings</Card.Title>
      <div className="form-check form-switch"
        onClick={handleSwitchClick}>
        <div
          className={`form-check-input ${saveActivities ? 'checked' : ''}`}
        />
        <label class="form-check-label">Save my activities log</label>
      </div>

      <div className="form-check form-switch"
        onClick={handleSwitchClick}>
        <div
          className={`form-check-input ${saveActivities ? 'checked' : ''}`}
        />
        <label class="form-check-label">Alert me by email in case of unusual activity in my account</label>
      </div>
       <div class="edit-btn ">
          <button
            type="button"
            class="btn btn-success btn btn-success"
          >
            Update Profile
          </button>
        </div>
     
    </Card>
  );
};

export default Settings;
