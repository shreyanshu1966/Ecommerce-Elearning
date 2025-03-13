import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosConfig'; // Replace api utility with axiosInstance
import {
  Search,
  Filter,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Package,
  Truck,
  ShoppingBag,
  Clock,
  Check,
  DollarSign,
  CreditCard,
  Book,
  FileText,
  Trash2,
  AlertCircle,
  X
} from "lucide-react";
import OrderStatistics from "./OrderStatistics";
import OrderFilterBar from "./OrderFilterBar";
import OrderNav from "./OrderNav";
import OrderListing from "./OrderListing";
import { exportOrdersToCsv } from "../utils/exportService";
import ConfirmationModal from "./ConfirmationModal";

const OrdersAdmin = ({ initialTab = "orders" }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab); // Add this state - options: "orders", "statistics"
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    keyword: "",
    paymentStatus: "",
    deliveryStatus: "",
  });
  
  // Order statistics
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    pendingDeliveries: 0,
    recentOrders: [],
    paymentMethodStats: [],
    itemTypeStats: []
  });

  // Sorting state
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'default',
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [page, filters, sortField, sortDirection]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // No need for token configuration, it's handled by the interceptor
      const { data } = await axiosInstance.get('/orders/admin'); // Remove /api prefix
      setOrders(data.orders);
      setPage(data.page);
      setTotalPages(data.pages);
      setTotalOrders(data.count);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrderStats = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/admin/statistics"); // Remove /api prefix
      
      setStats(data);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
    }
  };
  
  const updateDeliveryStatus = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/admin/${orderId}/deliver`, {}); // Remove /api prefix
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, isDelivered: true, deliveredAt: new Date() } 
          : order
      ));
      
      setSuccessMessage("Order marked as delivered");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refresh statistics
      fetchOrderStats();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      setError(error.response?.data?.message || "Failed to update delivery status");
      setTimeout(() => setError(null), 3000);
    }
  };
  
  const updatePaymentStatus = async (orderId, status) => {
    try {
      // No need for manual token handling
      await axiosInstance.put(`/orders/admin/${orderId}/pay`, { paymentStatus: status }); // Remove /api prefix
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              isPaid: status, 
              paidAt: status ? new Date() : null 
            } 
          : order
      ));
      
      setSuccessMessage(`Payment status updated to ${status ? 'paid' : 'unpaid'}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refresh statistics
      fetchOrderStats();
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError(error.response?.data?.message || "Failed to update payment status");
      setTimeout(() => setError(null), 3000);
    }
  };
  
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axiosInstance.delete(`/orders/admin/${orderId}`, config); // Remove /api prefix
      
      // Update local state
      setOrders(orders.filter(order => order._id !== orderId));
      
      setSuccessMessage("Order deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refresh statistics
      fetchOrderStats();
      setTotalOrders(prev => prev - 1);
    } catch (error) {
      console.error("Error deleting order:", error);
      setError(error.response?.data?.message || "Failed to delete order");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteOrder = (orderId) => {
    openModal(
      "Delete Order",
      "Are you sure you want to delete this order? This action cannot be undone.",
      () => deleteOrder(orderId),
      "danger"
    );
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    fetchOrders(); // Fetch orders with the new filters
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };
  
  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    setPage(1); // Reset to first page when sorting changes
    
    // Add this to your filters to be sent to the backend
    const sortParams = {
      ...filters,
      sortField: field,
      sortDirection: direction
    };
    
    // Update your fetchOrders function to include sorting
    fetchOrders(sortParams);
  };

  const handleExport = useCallback((orderIds) => {
    try {
      const ordersToExport = orders.filter(order => 
        orderIds ? orderIds.includes(order._id) : true
      );
      
      if (ordersToExport.length === 0) {
        setError("No orders selected for export");
        return;
      }
      
      exportOrdersToCsv(ordersToExport, `orders-export-${orderIds ? 'selected' : 'all'}`);
      setSuccessMessage(`${ordersToExport.length} orders exported successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error exporting orders:", error);
      setError("Failed to export orders. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  }, [orders]);

  const openModal = (title, message, onConfirm, type = 'default') => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false
    });
  };

  const handleBatchAction = (action, selectedOrderIds) => {
    if (!selectedOrderIds || selectedOrderIds.length === 0) {
      setError("Please select at least one order");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    switch(action) {
      case 'mark-paid':
        openModal(
          "Mark Orders as Paid",
          `Are you sure you want to mark ${selectedOrderIds.length} order(s) as paid?`,
          () => {
            selectedOrderIds.forEach(id => updatePaymentStatus(id, true));
            setSuccessMessage(`${selectedOrderIds.length} orders marked as paid`);
            setTimeout(() => setSuccessMessage(""), 3000);
          },
          "default"
        );
        break;
        
      case 'mark-unpaid':
        openModal(
          "Mark Orders as Unpaid",
          `Are you sure you want to mark ${selectedOrderIds.length} order(s) as unpaid?`,
          () => {
            selectedOrderIds.forEach(id => updatePaymentStatus(id, false));
            setSuccessMessage(`${selectedOrderIds.length} orders marked as unpaid`);
            setTimeout(() => setSuccessMessage(""), 3000);
          },
          "default"
        );
        break;
        
      case 'mark-delivered':
        openModal(
          "Mark Orders as Delivered",
          `Are you sure you want to mark ${selectedOrderIds.length} order(s) as delivered?`,
          () => {
            selectedOrderIds.forEach(id => updateDeliveryStatus(id));
            setSuccessMessage(`${selectedOrderIds.length} orders marked as delivered`);
            setTimeout(() => setSuccessMessage(""), 3000);
          },
          "default"
        );
        break;
        
      case 'delete':
        openModal(
          "Delete Orders",
          `Are you sure you want to delete ${selectedOrderIds.length} order(s)? This action cannot be undone.`,
          () => {
            selectedOrderIds.forEach(id => deleteOrder(id));
          },
          "danger"
        );
        break;
        
      case 'export':
        handleExport(selectedOrderIds);
        break;
        
      default:
        break;
    }
  };

  // Add this function to handle batch deletions

const handleBatchDelete = (orderIds) => {
  openModal(
    "Delete Multiple Orders",
    `Are you sure you want to delete ${orderIds.length} orders? This action cannot be undone.`,
    async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Track success and failures
        let successCount = 0;
        let failureCount = 0;
        
        // Delete orders one by one
        for (const id of orderIds) {
          try {
            await axiosInstance.delete(`/orders/admin/${id}`, config); // Remove /api prefix
            successCount++;
          } catch (err) {
            console.error(`Failed to delete order ${id}:`, err);
            failureCount++;
          }
        }
        
        // Update orders state by filtering out deleted orders
        setOrders(orders.filter(order => !orderIds.includes(order._id)));
        
        // Update total orders count
        setTotalOrders(prev => prev - successCount);
        
        // Show success message
        setSuccessMessage(`${successCount} orders deleted successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`);
        setTimeout(() => setSuccessMessage(""), 5000);
        
        // Refresh statistics
        fetchOrderStats();
      } catch (error) {
        console.error("Error in batch deletion:", error);
        setError(error.response?.data?.message || "Failed to delete orders");
        setTimeout(() => setError(null), 3000);
      }
    },
    "danger"
  );
};

  // Update URL when changing tabs
  useEffect(() => {
    // Update the URL to reflect the current active tab
    if (activeTab === "orders") {
      navigate("/admin/orders", { replace: true });
    } else if (activeTab === "statistics") {
      navigate("/admin/orders/statistics", { replace: true });
    }
  }, [activeTab, navigate]);

  // Function to handle order detail navigation
  const viewOrderDetails = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ConfirmationModal 
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>
      
      {/* Notification Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "statistics"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Statistics
          </button>
        </nav>
      </div>

      {/* Order Statistics Tab */}
      {activeTab === "statistics" && <OrderStatistics />}

      {/* Orders Tab - your existing content */}
      {activeTab === "orders" && (
        <>
          <OrderNav 
            activeFilter={filters} 
            onFilterChange={handleFilterChange} 
            stats={{
              totalOrders: totalOrders,
              pendingPayments: stats.pendingPayments || 0,
              paidOrders: stats.paidOrders || 0,
              pendingDeliveries: stats.pendingDeliveries || 0,
              deliveredOrders: stats.deliveredOrders || 0,
              digitalOrders: stats.digitalOrders || 0,
            }}
          />

          <OrderFilterBar 
            onFilter={handleFilterChange} 
            initialFilters={filters} 
            onExport={() => handleExport()}
          />

          <OrderListing
            orders={orders}
            loading={loading}
            onViewDetails={(id) => navigate(`/admin/orders/${id}`)}
            onUpdatePayment={(id, status) => {
              openModal(
                status ? "Mark as Paid" : "Mark as Unpaid",
                `Are you sure you want to mark this order as ${status ? 'paid' : 'unpaid'}?`,
                () => updatePaymentStatus(id, status),
                "default"
              );
            }}
            onUpdateDelivery={(id) => {
              openModal(
                "Mark as Delivered",
                "Are you sure you want to mark this order as delivered?",
                () => updateDeliveryStatus(id),
                "default"
              );
            }}
            onDeleteOrder={(id) => {
              openModal(
                "Delete Order",
                "Are you sure you want to delete this order? This action cannot be undone.",
                () => deleteOrder(id),
                "danger"
              );
            }}
            onBatchAction={handleBatchAction}
            page={page}
            totalPages={totalPages}
            totalOrders={totalOrders}
            onPageChange={setPage}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </>
      )}
      
      {activeTab === "statistics" && <OrderStatistics />}
    </div>
  );
};

export default OrdersAdmin;