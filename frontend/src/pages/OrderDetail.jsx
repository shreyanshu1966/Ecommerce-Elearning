import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Calendar, Clock, Package, Book, MapPin, ShoppingBag, Check, Truck, RefreshCw } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import axiosInstance from "../utils/axiosConfig"; // Replace api with axiosInstance

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/orders/${id}`); // Replace api with axiosInstance
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Order History
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 text-yellow-700 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Order History
          </Link>
        </div>
      </div>
    );
  }

  // Determine if the order contains physical products
  const hasPhysicalProducts = order.orderItems.some(item => item.itemType === "Product");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Order History
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order #{order._id.substring(order._id.length - 8)}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-gray-600 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Placed on {formatDate(order.createdAt)}
          </p>
          {order.isPaid && (
            <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
              <Check className="h-4 w-4" /> Paid on {formatDate(order.paidAt)}
            </div>
          )}
          {!order.isPaid && (
            <div className="flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm">
              <Clock className="h-4 w-4" /> Payment Pending
            </div>
          )}
          {hasPhysicalProducts && order.isDelivered && (
            <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
              <Truck className="h-4 w-4" /> Delivered on {formatDate(order.deliveredAt)}
            </div>
          )}
          {hasPhysicalProducts && !order.isDelivered && order.isPaid && (
            <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm">
              <Truck className="h-4 w-4" /> Shipping
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Order Items and Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                Order Items
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <div key={item._id} className="p-6 flex items-start gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : item.itemType === "Course" ? (
                      <Book className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Package className="h-8 w-8 text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.itemType} • ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Items Total</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST)</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              {hasPhysicalProducts && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Payment & Shipping Info */}
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Payment Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Payment Method:</span>
                <span className="ml-2 font-medium">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.isPaid && order.paymentResult && (
                <>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-2">{formatDate(order.paidAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="ml-2 break-all">
                      {order.paymentResult.razorpay_payment_id}
                    </span>
                  </div>
                </>
              )}
              {!order.isPaid && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/checkout/retry/${order._id}`)}
                    className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Payment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information - Only show if there are physical products */}
          {hasPhysicalProducts && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-500" />
                Shipping Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Address:</span>
                  <p className="mt-1 font-medium">
                    {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 font-medium ${order.isDelivered ? 'text-green-600' : 'text-blue-600'}`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
                {order.isDelivered && (
                  <div>
                    <span className="text-gray-500">Delivered on:</span>
                    <span className="ml-2">{formatDate(order.deliveredAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;