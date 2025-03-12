import { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  BookOpen,
  User,
} from "lucide-react";

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    image: "", 
    category: "", 
    stock: "" 
  });
  const [editProduct, setEditProduct] = useState(null);
  const [editData, setEditData] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    image: "", 
    category: "", 
    stock: "" 
  });

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      console.error("All fields are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post("/api/products", newProduct, config);
  
      setProducts([...products, data.product]); 
      setNewProduct({ name: "", description: "", price: "", image: "", category: "", stock: "" });
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
    }
  };

  const updateProduct = async () => {
    if (!editProduct) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`/api/products/${editProduct._id}`, editData, config);
      
      setProducts(products.map((p) => (p._id === editProduct._id ? data.product || data : p)));
      setEditProduct(null);
      setEditData({ name: "", description: "", price: "", image: "", category: "", stock: "" });
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
    }
  };
  
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/products/${id}`, config);
      
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Products</h2>
      
      {/* New Product Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-500" />
          Add New Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <button
          onClick={addProduct}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          <Plus className="h-5 w-5" />
          Create Product
        </button>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Existing Products ({products.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  {editProduct?._id === product._id ? (
                    <td colSpan="5" className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Edit Form Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              value={editData.description}
                              onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              type="text"
                              value={editData.image}
                              onChange={(e) =>
                                setEditData({ ...editData, image: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        {/* Edit Form Right Column */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Price</label>
                              <input
                                type="number"
                                value={editData.price}
                                onChange={(e) =>
                                  setEditData({ ...editData, price: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Stock</label>
                              <input
                                type="number"
                                value={editData.stock}
                                onChange={(e) =>
                                  setEditData({ ...editData, stock: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                              type="text"
                              value={editData.category}
                              onChange={(e) =>
                                setEditData({ ...editData, category: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-4">
                            <button
                              onClick={updateProduct}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => { setEditProduct(null); setEditData({ name: "", description: "", price: "", image: "", category: "", stock: "" }); }}
                              className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4">Stock: {product.stock}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditProduct(product); setEditData(product); }}
                            className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-md"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;
