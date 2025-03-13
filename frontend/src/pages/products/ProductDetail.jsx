import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosConfig"; // Replace axios with axiosInstance
import { addToCart } from "../../store/cartSlice";
import { ShoppingCart, CheckCircle, Package, Tag, Info, Shield, Battery } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`); // Remove the duplicate /api prefix
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!product) return;
    dispatch(addToCart({ itemId: product._id, itemType: "Product", quantity: 1 }));
  };

  const isInCart = cartItems.some(
    (item) =>
      item.itemType === "Product" &&
      ((item.product && item.product._id === product?._id) ||
       item.product === product?._id)
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Product Header */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          <div className="relative bg-gray-50 rounded-xl p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              ${product.price}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>Category:</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Product Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className="font-medium">
                    {product.stock} units available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Warranty</p>
                  <p className="font-medium">
                    {product.warranty || "1 Year"}
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="border-t pt-6 space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                  isInCart 
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                } text-white shadow-lg`}
              >
                {isInCart ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Added to Cart
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </div>
                )}
              </button>
            </div>

            {/* Product Features */}
            {product.specs && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Product Specifications
                </h3>
                <div className="grid gap-3">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;