import React from 'react'
import DashboardPage from './dashboardPage'

function DashboardComponent(props) {
  const { getUser, transactionLoading } = props;
  return (
    <>
      <DashboardPage  getUser={getUser} transactionLoading={transactionLoading} />
    </>
  )
}

export default DashboardComponent
