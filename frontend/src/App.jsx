import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Suspense } from "react";
import store from "./store/store";
import NavBar from "./components/NavBar";
import Courses from "./pages/Courses";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/products/ProductDetail";
import CourseDetail from "./pages/courses/CourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Cart from "./pages/Cart";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CourseSection from "./components/CourseSection";
import ProductSection from "./components/ProductSection";
import Footer from "./components/Footer";
import SchoolPrograms from "./pages/SchoolPrograms";
import SchoolProgramDetail from "./pages/SchoolProgramDetail";
import BlogDetail from "./pages/BlogDetail";
import BlogAdmin from "./components/BlogAdmin";
import Blogs from "./pages/Blogs";
import LoadingScreen from "./components/LoadingScreen";
import NotFound from "./components/NotFound";
import Checkout from "./pages/Checkout";

// Import admin components directly instead of lazy loading
import OrderDetailAdmin from "./components/OrderDetailAdmin";
import OrderStatistics from "./components/OrderStatistics";
import OrdersAdmin from "./components/OrdersAdmin";

// Import user order components directly
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import RetryPayment from "./pages/RetryPayment";

// Import other components directly
import MyCourses from "./pages/MyCourses";
import AccountSettings from "./pages/AccountSettings";
import OrderSuccess from "./pages/OrderSuccess";
import CourseLearn from "./pages/courses/CourseLearn";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-white">
                  <Hero />
                  <Features />
                  <CourseSection />
                  <ProductSection />
                  <Footer />
                </div>
              }
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/products" element={<Products />} />
            <Route path="/school-programs" element={<SchoolPrograms />} />
            <Route path="/school-programs/:id" element={<SchoolProgramDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/learn" element={<CourseLearn />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Dashboard />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/retry/:id" element={<RetryPayment />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Route>
            
            {/* Protected Admin Routes - Use AdminRoute */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/blogs" element={<BlogAdmin />} />
              
              {/* Order Management Routes */}
              <Route path="/admin/orders" element={<Dashboard tab="orders" />} />
              <Route path="/admin/orders/statistics" element={<Dashboard tab="orderStats" />} />
              <Route path="/admin/orders/:id" element={<OrderDetailAdmin />} />
              
              {/* Other Admin Routes */}
              <Route path="/admin/products" element={<Dashboard tab="products" />} />
              <Route path="/admin/courses" element={<Dashboard tab="courses" />} />
              <Route path="/admin/users" element={<Dashboard tab="users" />} />
              <Route path="/admin/school-programs" element={<Dashboard tab="schoolPrograms" />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
