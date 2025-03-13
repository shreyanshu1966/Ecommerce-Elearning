import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect, useState, useRef } from "react";
import { fetchCart } from "../store/cartSlice";
import { 
  Rocket, 
  ShoppingCart, 
  User, 
  Menu, 
  Shield, 
  X, 
  ChevronDown, 
  LogOut, 
  Settings, 
  ShoppingBag,
  Heart,
  BookOpen
} from "lucide-react";

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <Rocket className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              RoboAcademy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="group flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link
              to="/courses"
              className="group flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
            >
              <span>Courses</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-500 group-hover:text-blue-600" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link
              to="/products"
              className="group flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
            >
              <span>Products</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-500 group-hover:text-blue-600" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link
              to="/school-programs"
              className="group flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
            >
              <span>School Programs</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-500 group-hover:text-blue-600" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link
              to="/blogs"
              className="group flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
            >
              <span>Blogs</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-500 group-hover:text-blue-600" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="group flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors relative"
              >
                <Shield className="h-4 w-4 mr-1 text-blue-600" />
                <span>Dashboard</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            <Link 
              to="/my-courses" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>My Courses</span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItems && cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <div className="bg-blue-100 rounded-full p-1.5">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="hidden md:inline font-medium">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-4 w-4 hidden md:block" />
                </button>
                
                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" />
                        My Orders
                      </Link>
                      
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Heart className="h-4 w-4 mr-3 text-gray-400" />
                        Wishlist
                      </Link>
                      
                      <Link
                        to="/account-settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        Account Settings
                      </Link>
                      
                      <div className="border-t border-gray-100"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          <Link
            to="/courses"
            className="flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-md font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Courses</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
          
          <Link
            to="/products"
            className="flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-md font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Products</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
          
          <Link
            to="/school-programs"
            className="flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-md font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>School Programs</span>
            <ChevronDown className="h-4 w-4" />
          </Link>

          <Link
            to="/blogs"
            className="flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-md font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Blogs</span>
            <ChevronDown className="h-4 w-4" />
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin"
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              <span>Dashboard</span>
            </Link>
          )}
          
          {!user && (
            <Link
              to="/login"
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-2 text-blue-600" />
              <span>Login</span>
            </Link>
          )}
          
          {user && (
            <div className="space-y-1 pt-2 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                <div className="bg-blue-100 rounded-full p-1 mr-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              
              <Link 
                to="/orders" 
                className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="h-5 w-5 mr-2 text-gray-500" />
                <span>My Orders</span>
              </Link>
              
              <Link 
                to="/wishlist" 
                className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-2 text-gray-500" />
                <span>Wishlist</span>
              </Link>
              
              <Link 
                to="/account-settings" 
                className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 mr-2 text-gray-500" />
                <span>Account Settings</span>
              </Link>
              
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-2 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
