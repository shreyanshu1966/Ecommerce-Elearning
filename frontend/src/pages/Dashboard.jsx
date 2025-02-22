import { useState } from "react";
import CoursesAdmin from "../components/CoursesAdmin";
import ProductsAdmin from "../components/ProductsAdmin";

const Dashboard = () => {
  const [tab, setTab] = useState("courses");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTab("courses")}
          className={`px-4 py-2 ${tab === "courses" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Manage Courses
        </button>
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 ${tab === "products" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Manage Products
        </button>
      </div>
      {tab === "courses" ? <CoursesAdmin /> : <ProductsAdmin />}
    </div>
  );
};

export default Dashboard;
