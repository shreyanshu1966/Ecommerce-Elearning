import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ChevronRight, ShoppingBag } from 'lucide-react';

// Import your component tabs
import OrderSummary from "../components/OrderSummary";
import OrdersAdmin from "../components/OrdersAdmin";
import CoursesAdmin from "../components/CoursesAdmin";
import ProductsAdmin from "../components/ProductsAdmin";
import SchoolProgramsAdmin from "../components/SchoolProgramsAdmin";
import BlogAdmin from "../components/BlogAdmin";
import UserManagementAdmin from "../components/UserManagementAdmin";

const Dashboard = ({ tab: initialTab }) => {
  const location = useLocation();
  const [tab, setTab] = useState(initialTab || "courses");
  const [showOrderSummary, setShowOrderSummary] = useState(true);

  // Listen for route changes that might include a tab parameter
  useEffect(() => {
    // Check if there's a query parameter for tab
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ["courses", "products", "schoolPrograms", "Blog", "users", "orders"].includes(tabParam)) {
      setTab(tabParam);
    } else if (initialTab) {
      setTab(initialTab);
    }
  }, [location.search, initialTab]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {tab !== "orders" && tab !== "orderStats" && showOrderSummary && (
        <div className="mb-8">
          <OrderSummary />
          <button 
            onClick={() => setTab("orders")}
            className="text-blue-600 hover:underline text-sm mt-2 flex items-center gap-1"
          >
            View details <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setTab("courses")}
          className={`px-4 py-2 rounded ${tab === "courses" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Manage Courses
        </button>
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded ${tab === "products" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setTab("schoolPrograms")}
          className={`px-4 py-2 rounded ${tab === "schoolPrograms" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Manage School Programs
        </button>
        <button
          onClick={() => setTab("Blog")}
          className={`px-4 py-2 rounded ${tab === "Blog" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Blog
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded ${tab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          User Management
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded ${tab === "orders" || tab === "orderStats" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          <ShoppingBag className="h-4 w-4 inline mr-1" />
          Order Management
        </button>
      </div>
      
      {tab === "courses" && <CoursesAdmin />}
      {tab === "products" && <ProductsAdmin />}
      {tab === "schoolPrograms" && <SchoolProgramsAdmin />}
      {tab === "Blog" && <BlogAdmin />}
      {tab === "users" && <UserManagementAdmin />}
      {(tab === "orders" || tab === "orderStats") && (
        <OrdersAdmin initialTab={tab === "orderStats" ? "statistics" : "orders"} />
      )}
    </div>
  );
};

export default Dashboard;

