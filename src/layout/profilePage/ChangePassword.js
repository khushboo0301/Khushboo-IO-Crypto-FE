import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { EyeClosedIcon, EyeIcon } from '../../component/SVGIcon'

export const ChangePassword = () => {
  const [isVisibleOldPass, setVisibleOldPass] = useState(false)
  const toggleOldPass = () => {
    setVisibleOldPass(!isVisibleOldPass)
  }
  const [isVisibleNewPass, setVisibleNewPass] = useState(false)
  const toggleNewPass = () => {
    setVisibleNewPass(!isVisibleNewPass)
  }
  const [isVisibleConfirmPass, setVisibleConfirmPass] = useState(false)
  const toggleConfirmPass = () => {
    setVisibleConfirmPass(!isVisibleConfirmPass)
  }

  return (
    <Card body className="cards-dark">
      <Card.Title as="h2">Password Settings</Card.Title>
      <Form>
        <Form.Group className="form-group mt-4">
          <Form.Label>Old Password</Form.Label>
          <div className="d-flex justify-content-between align-items-center">
            <Form.Control type={!isVisibleOldPass ? 'password' : 'text'} placeholder="Enter old password" />
            <span className="input-icon" onClick={toggleOldPass}>
              {isVisibleOldPass ? <EyeIcon width="24" height="24" /> : <EyeClosedIcon width="24" height="24" />}
            </span>
          </div>
        </Form.Group>
        <Row>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>New Password</Form.Label>
              <div className="d-flex justify-content-between align-items-center">
                <Form.Control type={!isVisibleNewPass ? 'password' : 'text'} placeholder="Enter new password" />
                <span className="input-icon" onClick={toggleNewPass}>
                  {isVisibleNewPass ? <EyeIcon width="24" height="24" /> : <EyeClosedIcon width="24" height="24" />}
                </span>
              </div>
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="form-group">
              <Form.Label>Confirm New Password</Form.Label>
              <div className="d-flex justify-content-between align-items-center">
                <Form.Control
                  type={!isVisibleConfirmPass ? 'password' : 'text'}
                  placeholder="Enter new password  again"
                />
                <span className="input-icon" onClick={toggleConfirmPass}>
                  {isVisibleConfirmPass ? <EyeIcon width="24" height="24" /> : <EyeClosedIcon width="24" height="24" />}
                </span>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <div class="edit-btn ">
          <button
            type="button"
            class="btn btn-success btn btn-success"
          >
            Update Profile
          </button>
        </div>
      </Form>
    </Card>
  )
}

export default ChangePassword
