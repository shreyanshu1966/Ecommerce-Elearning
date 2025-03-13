import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, AlertTriangle, RefreshCw, CheckCircle, ArrowRight } from "lucide-react";
import { analyzePaymentError } from "../utils/errorUtils";
import axiosInstance from '../utils/axiosConfig'; // Replace api with axiosInstance

const PaymentRetry = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const authToken = useSelector((state) => state.auth.token); // Get token from Redux store
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);
  const [statusCheckCount, setStatusCheckCount] = useState(0);

  // Fetch order status
  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/orders/${orderId}/status`);
      
      setOrder(data);
      setError(null);
      
      // If already paid, no need to retry
      if (data.isPaid) {
        setStatusCheckCount(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check payment status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
    
    // Setup periodic checking (every 10 seconds, up to 3 times)
    const intervalId = setInterval(() => {
      setStatusCheckCount((prev) => {
        const newCount = prev + 1;
        if (newCount <= 3) {
          fetchOrderStatus();
        } else {
          clearInterval(intervalId);
        }
        return newCount;
      });
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [orderId, navigate]);

  // Handle retry payment
  const handleRetryPayment = async () => {
    try {
      setRetryLoading(true);
      
      // Create a new Razorpay order for retry
      const { data } = await axiosInstance.post("/orders/retry-payment", { orderId });
      
      // Initialize Razorpay payment
      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Mecha Learning",
        description: `Retry payment for Order #${orderId.substring(0, 8)}`,
        order_id: data.razorpayOrderId,
        handler: function (response) {
          navigate(`/order-success`, { 
            state: { 
              orderID: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            } 
          });
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#3B82F6",
        },
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to retry payment");
    } finally {
      setRetryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Checking payment status...</p>
      </div>
    );
  }

  // Analyze error for better guidance
  const errorAnalysis = error ? analyzePaymentError(error) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          {order?.isPaid ? (
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-4">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {order?.isPaid ? "Payment Successful!" : "Payment Incomplete"}
          </h1>
          
          <p className="text-gray-600 text-lg">
            {order?.isPaid 
              ? "Your payment has been confirmed successfully." 
              : "We couldn't confirm your payment for this order."}
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${order?.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                {order?.isPaid ? 'Payment Complete' : 'Payment Pending'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Payment Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {!order?.isPaid && !error && (
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">What can you do?</p>
                <p className="text-sm text-blue-600">
                  You can retry the payment or check your order status later.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {!order?.isPaid && (
            <button
              onClick={handleRetryPayment}
              disabled={retryLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow hover:shadow-lg"
            >
              {retryLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Retry Payment
                </>
              )}
            </button>
          )}
          
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            View All Orders
            <ArrowRight className="h-5 w-5" />
          </button>
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

export default PaymentRetry;