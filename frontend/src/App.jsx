

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store/store";
// import NavBar from "./components/NavBar";
// import Courses from "./pages/Courses";
// import Products from "./pages/Products";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ProductDetail from "./pages/products/ProductDetail";
// import CourseDetail from "./pages/courses/CourseDetail";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Cart from "./pages/Cart";
// import "react-toastify/dist/ReactToastify.css";
// import Signup from "./pages/Signup";
// import Hero from "./components/Hero";
// import Features from './components/Features';
// import CourseSection from './components/CourseSection';
// import ProductSection from "./components/ProductSection";
// import Footer from './components/Footer';

// const App = () => {
//   return (
//     <Provider store={store}>
//       <Router>
//         <NavBar/>
//         <Routes>
//         <Route
//           path="/"
//           element={
//             <div className="min-h-screen bg-white">
//               <Hero />
//               <Features />
//               <CourseSection />
//               <ProductSection />
//               <Footer />
              
//             </div>
//           }
//         />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/products/:id" element={<ProductDetail />} />
//           <Route path="/courses/:id" element={<CourseDetail />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
        
//       </Router>
//     </Provider>
//   );
// };

// export default App;



// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import NavBar from "./components/NavBar";
import Courses from "./pages/Courses";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/products/ProductDetail";
import CourseDetail from "./pages/courses/CourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CourseSection from "./components/CourseSection";
import ProductSection from "./components/ProductSection";
import Footer from "./components/Footer";
import SchoolPrograms from "./pages/SchoolPrograms"; // new import
import SchoolProgramDetail from "./pages/SchoolProgramDetail"; // new import
import BlogDetail from "./pages/BlogDetail";
import BlogAdmin from "./components/BlogAdmin";
import Blogs from "./pages/Blogs";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Routes>
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
          <Route path="/school-programs" element={<SchoolPrograms />} /> {/* new route */}
          <Route path="/school-programs/:id" element={<SchoolProgramDetail />} /> {/* new route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/blogs" element={<Blogs />} />
<Route path="/blogs/:id" element={<BlogDetail />} />
<Route path="/admin/blogs" element={<ProtectedRoute><BlogAdmin /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
