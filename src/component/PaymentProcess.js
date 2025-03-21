import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTransactionByOrderId,
} from "../store/slices/currencySlice";
export const PaymentProcess = (props) => {

  let navigate = useNavigate();
 
  const { orderId, orderData } = useSelector(
    (state) => state?.currenyReducer
  );
  const dispatch = useDispatch();
  const viewTransaction = () => {
    navigate("/transaction");
  };

  useEffect(() => {
    if (orderId && (props?.successModal || props?.cancelModal)) {
      dispatch(getTransactionByOrderId(orderId));
    }
  }, [orderId, props?.successModal, props?.cancelModal]);

  return (
    <>
      <Modal
        {...props}
        dialogClassName="login-modal"
        backdropClassName="login-modal-backdrop"
        aria-labelledby="contained-modal"
        backdrop="static"
        keyboard={false}
        centered
        show={props?.successModal}
      >
        <Modal.Header closeButton onClick={props?.closeModal}>
          <Modal.Title>Confirmation Your Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="payment-confirmation">
          <p className="text-white">
            Your Order no. {orderData?.transactionHash} has been placed successfully.
          </p>
          <p>
            Please make your payment of 4.29 USDT through bank to the below bank
            address. The token balance will appear in your account only after
            your transaction gets approved by our team.
          </p>
          <h5 className="mt-4">Bank Details for Payment</h5>
          <div className="bank-details">
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Account Name</div>
              <div className="bank-info">Rogertim100</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Account Number</div>
              <div className="bank-info">128007635</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Accound Holder Address</div>
              <div className="bank-info">2580272365</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Bank Name</div>
              <div className="bank-info">Rogert Im</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="bank-label">Bank Address</div>
              <div className="bank-info">22300872927</div>
            </div>
          </div>
          <div className="form-action-group mb-2">
            <Button variant="primary" onClick={viewTransaction}>
              View Transaction
            </Button>
            <Button variant="secondary" onClick={props?.closeModal}>
              Cancel Order
            </Button>
          </div>
          <p>
            Use this transaction id (# {orderData?.transactionHash}) as reference. Make
            your payment within 24 hours, If we will not received your payment
            within 24 hours, then we will cancel the transaction.
          </p>
        </Modal.Body>
      </Modal>
      <Modal
        {...props}
        dialogClassName="login-modal"
        backdropClassName="login-modal-backdrop"
        aria-labelledby="contained-modal"
        backdrop="static"
        keyboard={false}
        centered
        show={props?.cancelModal}
      >
        <Modal.Header closeButton onClick={props?.closeModal}>
          <Modal.Title>Oops! Payment Canceled!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="payment-confirmation">
          <p className="mb-0">
            You have canceled your payment. If you continue to have issues,
            please contact us with order no. {orderData?.transactionHash}.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PaymentProcess;
