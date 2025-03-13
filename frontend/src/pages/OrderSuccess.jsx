import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyPayment, checkOrderStatus } from "../store/orderSlice";
import { CheckCircle, ShoppingBag, ArrowRight, Clock, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react";
import { analyzePaymentError } from "../utils/errorUtils";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, paymentResult, statusChecking, statusError } = useSelector((state) => state.order);

  // Get payment details from location state
  const paymentDetails = location.state || {};
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    // Verify the payment if we have all required details
    if (paymentDetails.orderID && 
        paymentDetails.razorpay_payment_id && 
        paymentDetails.razorpay_order_id && 
        paymentDetails.razorpay_signature) {
      dispatch(verifyPayment(paymentDetails));
      setVerificationAttempted(true);
    } else {
      // If we don't have payment details, redirect to home
      navigate("/");
    }
  }, [dispatch, paymentDetails, navigate]);

  // If verification fails, check the order status
  useEffect(() => {
    if (error && verificationAttempted && retryCount < 3) {
      const timer = setTimeout(() => {
        setCheckingStatus(true);
        dispatch(checkOrderStatus(paymentDetails.orderID));
        setRetryCount(prev => prev + 1);
      }, 3000); // Wait 3 seconds before checking status
      
      return () => clearTimeout(timer);
    }
  }, [error, verificationAttempted, retryCount, dispatch, paymentDetails.orderID]);

  const handleRetryPayment = () => {
    navigate(`/checkout/retry/${paymentDetails.orderID}`);
  };

  if (loading || checkingStatus) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">{checkingStatus ? "Checking payment status..." : "Verifying your payment..."}</p>
      </div>
    );
  }

  if (error && retryCount >= 3) {
    const errorAnalysis = analyzePaymentError(error);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-4">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Verification Issue</h1>
            <p className="text-gray-600 text-lg">
              We're having trouble confirming your payment.
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{paymentDetails.orderID}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">What happened?</p>
                <p className="text-sm text-red-600">
                  {error}. Don't worry, your payment might still be processing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleRetryPayment}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow hover:shadow-lg"
            >
              <RefreshCw className="h-5 w-5" />
              {errorAnalysis.recommendedAction === 'retry' ? 'Retry Payment' : 'Check Status'}
            </button>
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              View Orders
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>
              Need help? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{paymentDetails.orderID}</p>
            </div>
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-medium">{paymentDetails.razorpay_payment_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">What happens next?</p>
              <p className="text-sm text-blue-600">
                {paymentResult?.isPaid 
                  ? "Your payment has been confirmed. Your courses are now available in your learning dashboard, and any physical products will be shipped soon."
                  : "Your payment is being processed. Once confirmed, your courses will be available in your learning dashboard."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow hover:shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            View Order History
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>
            Need help? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;