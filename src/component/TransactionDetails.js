import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { formattedNumber, getDateFormate } from "../utils";

//this component is used for transaction details 
export const TransactionDetails = (props) => {
  let orderContent = "";
  if(props?.stateTransactions?.transactionHash != undefined)
  {
    orderContent = ( props?.stateTransactions?.status === "failed") ? (
      <p>
        The order no. {props?.stateTransactions?.transactionHash} was placed on
        {" " + getDateFormate(props?.stateTransactions?.created_at,"MMM DD, YYYY HH:mm:ss")}.
      </p>
    ) : (
      <>
        <p>
          You have successfully paid this transaction (Manual - Offline
          Payment).
        </p>
        <p>
          The order no. {props?.stateTransactions?.transactionHash} was placed on
          {" " + getDateFormate(props?.stateTransactions?.created_at,"MMM DD, YYYY HH:mm:ss")}
          .
        </p>
      </>);
  }
  if(props?.stateTransactions?.source == "referral")
  {
    orderContent = (<p>This order is placed by referral link</p>)
  }
  
  return (
    <Modal
      {...props}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton className="transaction-header">
      <Modal.Title>
          Transaction Details
          {props?.stateTransactions?.status === "paid" && (
            <Button variant="outline-success">
              {props?.stateTransactions?.status.charAt(0).toUpperCase() +
                props?.stateTransactions?.status.slice(1)}
            </Button>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="transaction-body">
        { orderContent }

        <h3>Token Details</h3>
        <div className="token-details">
          <Table responsive>
            <tbody>
              <tr>
                <th>Types</th>
                <td>{props?.stateTransactions?.source ? props?.stateTransactions?.source.charAt(0).toUpperCase() + props?.stateTransactions?.source.slice(1) : "Purchase"}</td>
              </tr>
              <tr>
                <th>Token of Stage</th>
                <td>Token Coin</td>
              </tr>
              <tr>
                <th>Token Amount (T)</th>
                <td>{formattedNumber(props?.stateTransactions?.price_amount)} Coin</td>
              </tr>
              <tr>
                <th>Bonus Token (B)</th>
                <td>0 Bonus</td>
              </tr>
              <tr>
                <th>Network</th>
                <td>{props?.stateTransactions?.network}</td>
              </tr>
              <tr>
                <th>Total Token</th>
                <td>{formattedNumber(props?.stateTransactions?.token_cryptoAmount)} Coin</td>
              </tr>
              <tr>
                <th>Total Payment</th>
                <td>{formattedNumber(props?.stateTransactions?.price_amount)} {props?.stateTransactions?.price_currency}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        {props?.stateTransactions?.status === "paid" && (
          <p className="text-success mb-0">
            Transaction has been approved at{" "}
            {getDateFormate(props?.stateTransactions?.paid_at ? props?.stateTransactions?.paid_at : props?.stateTransactions?.created_at,"MMM DD, YYYY HH:mm:ss")}.
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TransactionDetails;
