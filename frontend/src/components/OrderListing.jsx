import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  Truck,
  Package,
  Book,
  FileText,
  CreditCard,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const OrderListing = ({
  orders,
  loading,
  onViewDetails,
  onUpdatePayment,
  onUpdateDelivery,
  onDeleteOrder,
  page,
  totalPages,
  totalOrders,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  onBatchAction
}) => {
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Reset selected orders when orders change
  useEffect(() => {
    setSelectedOrders([]);
    setSelectAll(false);
  }, [orders]);

  const handleSortClick = (field) => {
    // If clicking the same field, toggle direction, otherwise default to ascending
    const direction = 
      field === sortField 
        ? sortDirection === "asc" ? "desc" : "asc" 
        : "asc";
    
    onSort(field, direction);
  };
  
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 opacity-40" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />;
  };
  
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
    setSelectAll(!selectAll);
  };
  
  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Process batch actions
  const handleBatchAction = (action) => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order");
      return;
    }
    
    // Call the parent's onBatchAction handler
    onBatchAction(action, selectedOrders);
    
    // Reset selection after action
    setSelectedOrders([]);
    setSelectAll(false);
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Orders ({totalOrders})
        </h3>
        
        {/* Batch Actions - Only show if items are selected */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">
              {selectedOrders.length} selected
            </span>
            <select 
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const action = e.target.value;
                if (action !== '') {
                  handleBatchAction(action);
                  e.target.value = ''; // Reset select after action
                }
              }}
              value=""
            >
              <option value="">Batch Actions</option>
              <option value="mark-paid">Mark as Paid</option>
              <option value="mark-delivered">Mark as Delivered</option>
              <option value="export">Export Selected</option>
              <option value="delete">Delete Selected</option>
            </select>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-gray-500 hover:text-gray-700"
              title="Clear selection"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSortClick('_id')}
              >
                <div className="flex items-center gap-1">
                  Order ID
                  {renderSortIcon('_id')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSortClick('user.name')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {renderSortIcon('user.name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSortClick('createdAt')}
              >
                <div className="flex items-center gap-1">
                  Date
                  {renderSortIcon('createdAt')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSortClick('totalPrice')}
              >
                <div className="flex items-center gap-1">
                  Total
                  {renderSortIcon('totalPrice')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSortClick('isPaid')}
              >
                <div className="flex items-center gap-1">
                  Payment
                  {renderSortIcon('isPaid')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSortClick('isDelivered')}
              >
                <div className="flex items-center gap-1">
                  Delivery
                  {renderSortIcon('isDelivered')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              // Check if order has physical products
              const hasPhysicalProducts = order.orderItems?.some(
                item => item.itemType === "Product"
              );
              
              return (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelectOrder(order._id)}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div 
                      className="font-medium text-blue-600 cursor-pointer" 
                      onClick={() => onViewDetails(order._id)}
                    >
                      #{order._id.substring(order._id.length - 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.user?.name || "N/A"}</div>
                    <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {order.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {hasPhysicalProducts ? (
                      order.isDelivered ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Truck className="h-3 w-3 mr-1" />
                          Delivered
                        </span>
                      ) : order.isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Package className="h-3 w-3 mr-1" />
                          Shipping
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Awaiting Payment
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Book className="h-3 w-3 mr-1" />
                        Digital
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails(order._id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      
                      {!order.isPaid && (
                        <button
                          onClick={() => onUpdatePayment(order._id, true)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Mark as Paid"
                        >
                          <CreditCard className="h-5 w-5" />
                        </button>
                      )}
                      
                      {hasPhysicalProducts && order.isPaid && !order.isDelivered && (
                        <button
                          onClick={() => onUpdateDelivery(order._id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Mark as Delivered"
                        >
                          <Truck className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDeleteOrder(order._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Order"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
              className={`p-2 rounded ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className={`p-2 rounded ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListing;