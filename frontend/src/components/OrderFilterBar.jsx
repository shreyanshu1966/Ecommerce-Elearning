import { useState } from "react";
import { Search, Filter, Calendar, X, ArrowDownToLine } from "lucide-react";

const OrderFilterBar = ({ onFilter, initialFilters = {}, onExport }) => {
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || "",
    paymentStatus: initialFilters.paymentStatus || "",
    deliveryStatus: initialFilters.deliveryStatus || "",
    dateRange: initialFilters.dateRange || "",
    startDate: initialFilters.startDate || "",
    endDate: initialFilters.endDate || "",
    minAmount: initialFilters.minAmount || "",
    maxAmount: initialFilters.maxAmount || "",
    orderType: initialFilters.orderType || "",
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process date filters
    let processedFilters = { ...filters };
    
    if (filters.dateRange === "custom" && (!filters.startDate || !filters.endDate)) {
      // If custom date range is selected but dates aren't provided, ignore the date filter
      delete processedFilters.dateRange;
    }
    
    onFilter(processedFilters);
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      paymentStatus: "",
      deliveryStatus: "",
      dateRange: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      orderType: ""
    });
    onFilter({});
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, dateRange: value }));
    
    if (value !== "custom") {
      setShowDatePicker(false);
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="keyword"
              placeholder="Search order ID, customer name or email"
              value={filters.keyword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Primary Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleInputChange}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <div className="relative">
              <select
                name="deliveryStatus"
                value={filters.deliveryStatus}
                onChange={handleInputChange}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Deliveries</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
              </select>
              <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-4 py-2 border ${
                showAdvanced ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-600"
              } rounded-lg hover:bg-gray-50 transition-colors`}
            >
              Advanced Filters {showAdvanced ? "▲" : "▼"}
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            
            {(filters.keyword || filters.paymentStatus || filters.deliveryStatus || 
              filters.dateRange || filters.minAmount || filters.maxAmount || filters.orderType) && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="relative">
                <select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleDateRangeChange}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thismonth">This Month</option>
                  <option value="lastmonth">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              
              {showDatePicker && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleInputChange}
                    placeholder="Min"
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleInputChange}
                    placeholder="Max"
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                </div>
              </div>
            </div>
            
            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
              <div className="relative">
                <select
                  name="orderType"
                  value={filters.orderType}
                  onChange={handleInputChange}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Types</option>
                  <option value="product">Physical Products Only</option>
                  <option value="course">Courses Only</option>
                  <option value="mixed">Mixed Orders</option>
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            {/* Export button */}
            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1.5"
                onClick={() => onExport && onExport()}
              >
                <ArrowDownToLine className="h-4 w-4" />
                Export All Orders
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderFilterBar;