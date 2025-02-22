import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect } from "react";
import { fetchCart } from "../store/cartSlice"; // ✅ Import correct action

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch cart from backend/localStorage on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/courses" className="mr-4">Courses</Link>
        <Link to="/products" className="mr-4">Products</Link>
        <Link to="/cart" className="mr-4">
          Cart 
          <span className="bg-red-500 px-2 py-1 rounded text-xs ml-1">
            {cartItems.length}
          </span>
        </Link>

        {user?.isAdmin && (
          <Link to="/admin" className="mr-4 font-bold">Dashboard</Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.name}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup" className="mr-4">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
