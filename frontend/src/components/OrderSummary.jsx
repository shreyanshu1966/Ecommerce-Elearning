import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { DollarSign, ShoppingBag, Package, Calendar, AlertCircle } from 'lucide-react';

const OrderSummary = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/admin/statistics");
        
        setStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching order statistics:", error);
        setError("Failed to load order statistics");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md animate-pulse">
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-blue-500" /> 
        Order Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-700">Today's Sales</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.todaySales?.toLocaleString() || '0'}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-700">Pending Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments || 0}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-gray-700">To Ship</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingDeliveries || 0}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-700">Recent Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.recentOrders?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;