import React from 'react'
import TransactionPage from './transactionPage'

function TransactionComponent(props) {
  const {totalTransactionsCount , transactionLoading , setTypeFilter, setStatusFilter, PageSize , currentPage , setCurrentPage , typeFilter, statusFilter} = props
  return (
    <>
      <TransactionPage transactionLoading={transactionLoading} totalTransactionsCount={totalTransactionsCount} 
      setStatusFilter={setStatusFilter} setTypeFilter={setTypeFilter} typeFilter={typeFilter} statusFilter={statusFilter}
      setCurrentPage={setCurrentPage} currentPage={currentPage} PageSize={PageSize}/>
    </>
  )
}

export default TransactionComponent
