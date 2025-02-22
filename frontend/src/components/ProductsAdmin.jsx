import { useState, useEffect } from "react";
import axios from "axios";

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

  // const updateProduct = async () => {
  //   if (!editProduct) return;
  
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.error("No token found. User must be logged in.");
  //       return;
  //     }
  
  //     const config = { headers: { Authorization: `Bearer ${token}` } };
  
  //     const { data } = await axios.put(`/api/products/${editProduct._id}`, editData, config);
      
  //     setProducts(products.map((p) => (p._id === editProduct._id ? data : p)));
  //     setEditProduct(null);
  //     setEditData({ name: "", description: "", price: "", image: "" });
  //   } catch (error) {
  //     console.error("Error updating product:", error.response?.data || error.message);
  //   }
  // };
  
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
  
      // Ensure we're using the correct data format
      setProducts(products.map((p) => (p._id === editProduct._id ? data.product || data : p)));
  
      setEditProduct(null);
      setEditData({ name: "", description: "", price: "", image: "" });
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
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>
      <input type="text" placeholder="Product Name" value={newProduct.name} 
             onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 mr-2" />
      <input type="text" placeholder="Description" value={newProduct.description} 
             onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border p-2 mr-2" />
      <input type="number" placeholder="Price" value={newProduct.price} 
             onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="border p-2 mr-2" />
      <input type="text" placeholder="Image URL" value={newProduct.image} 
             onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="border p-2 mr-2" />
      <input type="text" placeholder="Category" value={newProduct.category} 
             onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border p-2 mr-2" />
      <input type="number" placeholder="Stock" value={newProduct.stock} 
             onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="border p-2 mr-2" />
      <button onClick={addProduct} className="bg-green-500 text-white px-4 py-2">Add</button>

      <ul className="mt-4">
        {products.map((product, index) => (
          <li key={product._id || index} className="flex justify-between bg-gray-100 p-2 my-2">
            {editProduct?._id === product._id ? (
              <>
                <input type="text" value={editData.name} 
                       onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="border p-1" />
                <input type="text" value={editData.description} 
                       onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="border p-1" />
                <input type="number" value={editData.price} 
                       onChange={(e) => setEditData({ ...editData, price: e.target.value })} className="border p-1" />
                <input type="text" value={editData.image} 
                       onChange={(e) => setEditData({ ...editData, image: e.target.value })} className="border p-1" />
                <input type="text" value={editData.category} 
                       onChange={(e) => setEditData({ ...editData, category: e.target.value })} className="border p-1" />
                <input type="number" value={editData.stock} 
                       onChange={(e) => setEditData({ ...editData, stock: e.target.value })} className="border p-1" />
              </>
            ) : (
              <>
                <span>{product.name} - {product.description} - ${product.price} - {product.category} - Stock: {product.stock}</span>
                {product.image && <img src={product.image} alt={product.name} className="w-16 h-16" />}
              </>
            )}
            <div>
              {editProduct?._id === product._id ? (
                <button onClick={updateProduct} className="bg-blue-500 text-white px-2 py-1 mx-2">Save</button>
              ) : (
                <button onClick={() => { setEditProduct(product); setEditData(product); }} className="bg-yellow-500 text-white px-2 py-1 mx-2">Edit</button>
              )}
              <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsAdmin;
