import { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  Check, 
  Truck, 
  Package, 
  FileText,
  Book,
  Filter
} from 'lucide-react';

const OrderNav = ({ activeFilter, onFilterChange, stats }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleFilterClick = (filter) => {
    onFilterChange({
      ...filter,
      keyword: ""  // Reset keyword search when clicking category filters
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div 
        className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-blue-500" />
          Order Categories
        </h3>
        <span className="text-gray-500">{isExpanded ? '▼' : '►'}</span>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* All Orders */}
            <button
              onClick={() => handleFilterClick({})}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                !activeFilter.paymentStatus && !activeFilter.deliveryStatus
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">All Orders</span>
              </div>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                {stats.totalOrders || 0}
              </span>
            </button>

            {/* Pending Payment */}
            <button
              onClick={() => handleFilterClick({ paymentStatus: "unpaid" })}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                activeFilter.paymentStatus === "unpaid"
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-md">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="font-medium">Pending Payment</span>
              </div>
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md text-sm">
                {stats.pendingPayments || 0}
              </span>
            </button>

            {/* Paid Orders */}
            <button
              onClick={() => handleFilterClick({ paymentStatus: "paid" })}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                activeFilter.paymentStatus === "paid" && !activeFilter.deliveryStatus
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-md">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Paid Orders</span>
              </div>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                {stats.paidOrders || 0}
              </span>
            </button>

            {/* Pending Delivery */}
            <button
              onClick={() => handleFilterClick({ paymentStatus: "paid", deliveryStatus: "pending" })}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                activeFilter.paymentStatus === "paid" && activeFilter.deliveryStatus === "pending"
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Pending Delivery</span>
              </div>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-sm">
                {stats.pendingDeliveries || 0}
              </span>
            </button>

            {/* Delivered Orders */}
            <button
              onClick={() => handleFilterClick({ deliveryStatus: "delivered" })}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                activeFilter.deliveryStatus === "delivered"
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-md">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Delivered Orders</span>
              </div>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                {stats.deliveredOrders || 0}
              </span>
            </button>

            {/* Digital Products */}
            <button
              onClick={() => handleFilterClick({ orderType: "course" })}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                activeFilter.orderType === "course"
                  ? 'bg-purple-50 border-purple-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-md">
                  <Book className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium">Digital Only</span>
              </div>
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-md text-sm">
                {stats.digitalOrders || 0}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderNav;