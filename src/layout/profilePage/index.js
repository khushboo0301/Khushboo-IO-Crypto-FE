import React from 'react'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import AccountStatus from './AccountStatus'
import ChangePassword from './ChangePassword'
import GoogleAuth from './GoogleAuth'
import PersonalData from './PersonalData'
import Settings from './Settings'

export const ProfilePage = () => {
  return (
    <div className="profile-details-view">
      <h1>Profile Details</h1>
      <Row>
        <Col xl="8">
          <Tabs defaultActiveKey="personal-data" id="profile- -tab">
            <Tab eventKey="personal-data" title="Personal Data">
              <PersonalData />
            </Tab>
            <Tab eventKey="settings" title="Settings">
              <Settings />
            </Tab>
            <Tab eventKey="password" title="Password">
              <ChangePassword />
            </Tab>
          </Tabs>
          <GoogleAuth />
        </Col>
        <Col xl="4">
          <AccountStatus />
        </Col>
      </Row>
    </div>
  )
}

export default ProfilePage
