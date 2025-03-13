import { useState, useEffect } from "react";
import { Edit, Trash2, Save, X, Plus } from "lucide-react";
import axiosInstance from '../utils/axiosConfig'; // Replace api with axiosInstance

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    image: "",
    author: "",
  });
  const [editBlog, setEditBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/blogs");
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error.response?.data || error.message);
    }
  };

  const addBlog = async () => {
    const { title, content, image, author } = newBlog;
    if (!title || !content || !author) {
      console.error("Title, content, and author are required!");
      return;
    }
    try {
      await axiosInstance.post("/blogs", { title, content, image, author });
      fetchBlogs();
      setNewBlog({ title: "", content: "", image: "", author: "" });
    } catch (error) {
      console.error("Error adding blog:", error.response?.data || error.message);
    }
  };

  const updateBlog = async () => {
    if (!editBlog) return;
    try {
      await axiosInstance.put(`/blogs/${editBlog._id}`, editBlog);
      fetchBlogs();
      setEditBlog(null);
    } catch (error) {
      console.error("Error updating blog:", error.response?.data || error.message);
    }
  };

  const deleteBlog = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this blog post?");
    if (!isConfirmed) return;
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (blog) => {
    setEditBlog({ ...blog });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Blogs</h2>
      
      {/* Create Blog Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-500" />
          Add New Blog
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              placeholder="Blog Content"
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-32"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                placeholder="Image URL"
                value={newBlog.image}
                onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                placeholder="Author Name"
                value={newBlog.author}
                onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <button
          onClick={addBlog}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          <Plus className="h-5 w-5" />
          Create Blog
        </button>
      </div>
      
      {/* Blogs List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            Existing Blogs ({blogs.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  {editBlog && editBlog._id === blog._id ? (
                    <td colSpan="3" className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Edit Form Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              value={editBlog.title}
                              onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                              placeholder="Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea
                              value={editBlog.content}
                              onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                              placeholder="Content"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                            />
                          </div>
                        </div>
                        {/* Edit Form Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              type="text"
                              value={editBlog.image}
                              onChange={(e) => setEditBlog({ ...editBlog, image: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                              type="text"
                              value={editBlog.author}
                              onChange={(e) => setEditBlog({ ...editBlog, author: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                          <button
                            onClick={updateBlog}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditBlog(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4">{blog.title}</td>
                      <td className="px-6 py-4">{blog.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(blog)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteBlog(blog._id)}
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

export default BlogAdmin;
