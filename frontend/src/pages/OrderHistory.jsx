import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../store/orderSlice';
import { ShoppingBag, Clock, ChevronRight, Package, Book, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Make sure to use { useAuth } not useAuth
import axiosInstance from '../utils/axiosConfig';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    // Only redirect if we've finished checking auth and user isn't authenticated
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    
    dispatch(getMyOrders());
  }, [dispatch, navigate, isAuthenticated, authLoading]);

  // Filter orders based on selected tab
  const filteredOrders = orders.filter(order => {
    if (selectedTab === "all") return true;
    if (selectedTab === "courses") {
      return order.orderItems.some(item => item.itemType === "Course");
    }
    if (selectedTab === "products") {
      return order.orderItems.some(item => item.itemType === "Product");
    }
    return true;
  });

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Map payment status to badge style
  const getStatusBadge = (order) => {
    if (order.isPaid) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
  };

  // Get delivery status for orders with physical products
  const getDeliveryStatus = (order) => {
    if (!order.orderItems.some(item => item.itemType === "Product")) {
      return null; // No physical products, no delivery status needed
    }
    
    if (order.isDelivered) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Delivered</span>;
    }
    
    if (order.isPaid) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Shipping</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Pending Payment</span>;
  };

  // Add loading state
  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order History</h1>
        <p className="text-gray-600">View and track all your purchases</p>
      </div>

      {/* Tabs for filtering orders */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            selectedTab === "all"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setSelectedTab("all")}
        >
          All Orders
        </button>
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            selectedTab === "courses"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setSelectedTab("courses")}
        >
          Courses
        </button>
        <button
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            selectedTab === "products"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setSelectedTab("products")}
        >
          Products
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}

      {!loading && filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">
            {selectedTab === "all" 
              ? "You haven't placed any orders yet."
              : selectedTab === "courses" 
                ? "You haven't purchased any courses yet."
                : "You haven't ordered any products yet."
            }
          </p>
          <Link
            to={selectedTab === "courses" ? "/courses" : "/products"}
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            {selectedTab === "courses" ? "Browse Courses" : "Shop Products"}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-700">
                      Order #{order._id.substring(order._id.length - 8)}
                    </h3>
                    {getStatusBadge(order)}
                    {getDeliveryStatus(order)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> 
                      {formatDate(order.createdAt)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">${order.totalPrice.toFixed(2)}</span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 inline-flex items-center gap-1"
                  >
                    Details <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-4">
                  {order.orderItems.slice(0, 4).map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {item.itemType === "Course" ? (
                          <Book className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Package className="h-5 w-5 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.itemType} • ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {order.orderItems.length > 4 && (
                    <div className="text-sm text-gray-500 self-center">
                      +{order.orderItems.length - 4} more items
                    </div>
                  )}
                </div>
                
                {order.isPaid && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Paid on {formatDate(order.paidAt)}
                    </div>
                    <div className="mt-1">
                      Payment ID: {order.paymentResult?.razorpay_payment_id || "N/A"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;