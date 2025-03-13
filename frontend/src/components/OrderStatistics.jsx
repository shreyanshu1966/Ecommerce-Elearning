import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Truck,
  Package,
  Book,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const OrderStatistics = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    pendingDeliveries: 0,
    recentOrders: [],
    paymentMethodStats: [],
    itemTypeStats: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("all");

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      
      const { data } = await axiosInstance.get("/orders/admin/statistics");
      
      setStats(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      setError(error.response?.data?.message || "Failed to fetch order statistics");
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Error loading statistics</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={fetchOrderStats}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Stats
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(stats.totalSales)}
          </p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Today's Sales</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(stats.todaySales)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Today</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Recent Orders</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {stats.recentOrders?.length || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Recent activity</p>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Pending Deliveries</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Truck className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {stats.pendingDeliveries || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Awaiting shipment</p>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Stats */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Payment Methods
            </h3>
          </div>
          <div className="p-6">
            {stats.paymentMethodStats && stats.paymentMethodStats.length > 0 ? (
              <div className="space-y-4">
                {stats.paymentMethodStats.map((method) => (
                  <div key={method._id} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{method._id}</span>
                      <span className="text-gray-600">{method.count} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ 
                          width: `${(method.amount / stats.totalSales) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 self-end">
                      {formatCurrency(method.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No payment method data available</p>
            )}
          </div>
        </div>

        {/* Item Type Stats */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              Products vs Courses
            </h3>
          </div>
          <div className="p-6">
            {stats.itemTypeStats && stats.itemTypeStats.length > 0 ? (
              <div className="space-y-6">
                {stats.itemTypeStats.map((type) => (
                  <div key={type._id} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium flex items-center gap-1.5">
                        {type._id === "Product" ? (
                          <><Package className="h-4 w-4" /> Products</>
                        ) : (
                          <><Book className="h-4 w-4" /> Courses</>
                        )}
                      </span>
                      <span className="text-gray-600">{type.count} items</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          type._id === "Product" ? "bg-indigo-600" : "bg-green-600"
                        }`}
                        style={{ 
                          width: `${(type.revenue / 
                            stats.itemTypeStats.reduce((total, t) => total + t.revenue, 0)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 self-end">
                      {formatCurrency(type.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No item type data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Recent Order Activity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        #{order._id.substring(order._id.length - 6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{order.user?.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{formatCurrency(order.totalPrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isPaid ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;