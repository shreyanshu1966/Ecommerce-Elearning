import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/orderSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingBag, CreditCard, Truck, Check, MapPin } from "lucide-react";
import { useAuth } from '../hooks/useAuth'; // Correctly imported
import axiosInstance from '../utils/axiosConfig';

const Checkout = () => {
  // Fix: Get authentication status directly from useAuth hook
  const { isAuthenticated, loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, order, error, success } = useSelector((state) => state.order);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const [hasPhysicalProducts, setHasPhysicalProducts] = useState(false);

  useEffect(() => {
    // Only redirect if we've finished checking auth and the user isn't authenticated
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Check if cart has physical products
    const physicalProducts = cartItems.some(item => item.itemType === "Product");
    setHasPhysicalProducts(physicalProducts);
    
    // Only redirect if cart is empty AND we're not still loading the cart
    if (cartItems.length === 0 && !cartLoading) {
      navigate("/cart");
    }
  }, [isAuthenticated, authLoading, cartItems, cartLoading, navigate]);

  useEffect(() => {
    if (success && order) {
      handleRazorpayPayment();
    }
  }, [success, order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (hasPhysicalProducts) {
      // Validate shipping address
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
        toast.error("Please fill all shipping fields");
        return;
      }
    }
    
    // Create order
    dispatch(createOrder(shippingAddress));
  };

  const handleRazorpayPayment = () => {
    if (!order?.razorpayOrderId || !order?.keyId) {
      toast.error("Payment information not available");
      return;
    }

    const options = {
      key: order.keyId,
      amount: order.amount * 100, // Amount in paise
      currency: order.currency,
      name: "Mecha Learning",
      description: "Purchase of courses and products",
      order_id: order.razorpayOrderId,
      handler: function (response) {
        // After successful payment, navigate to success page with order details
        navigate(`/order-success`, { 
          state: { 
            orderID: order.orderID,
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
        color: "#3B82F6", // Tailwind blue-500
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Calculate taxes and shipping
  const taxRate = 0.18; // 18% GST
  const taxAmount = totalPrice * taxRate;
  const shippingAmount = hasPhysicalProducts ? 100 : 0; // ₹100 shipping for physical products
  const finalTotal = totalPrice + taxAmount + shippingAmount;

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <ShoppingBag className="h-5 w-5 mr-2 text-blue-500" />
              Order Summary
            </h2>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item._id} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.product?.image || item.course?.image ? (
                      <img 
                        src={item.product?.image || item.course?.image} 
                        alt={item.product?.name || item.course?.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {item.product?.name || item.course?.title || "Unknown Item"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.itemType} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              {hasPhysicalProducts && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹100.00</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Shipping Address Form (only shown if there are physical products) */}
          {hasPhysicalProducts && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Shipping Address
              </h2>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right side - Payment Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
              Payment
            </h2>
            <div className="mb-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg mb-3">
                <Check className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm">Secure online payment</span>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 mb-4">
                <div className="font-medium mb-1">Razorpay</div>
                <div className="text-sm text-gray-500">Pay securely with credit/debit card, UPI, or netbanking</div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || cartLoading || cartItems.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                loading || cartLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Proceed to Pay ₹${finalTotal.toFixed(2)}`
              )}
            </button>
            {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;