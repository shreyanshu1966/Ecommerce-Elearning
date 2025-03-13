import { useState, useEffect } from "react";
import { 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Shield, 
  ShieldOff, 
  User, 
  Key, 
  Check, 
  AlertCircle
} from "lucide-react";
import axiosInstance from '../utils/axiosConfig'; // Replace api with axiosInstance

const UserManagementAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [resetPasswordResult, setResetPasswordResult] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
      setFilteredUsers(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!editUser) return;
    
    try {
      const { data } = await axiosInstance.put(`/users/${editUser._id}`, editData);
      
      setUsers(users.map(u => u._id === editUser._id ? data : u));
      setEditUser(null);
      setSuccessMessage("User updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "Failed to update user");
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      setFilteredUsers(filteredUsers.filter(user => user._id !== id));
      setSuccessMessage("User deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.response?.data?.message || "Failed to delete user");
      setTimeout(() => setError(null), 3000);
    }
  };

  const resetUserPassword = async (userId) => {
    try {
      const { data } = await axiosInstance.post(`/users/${userId}/reset-password`);
      
      setResetPasswordResult({
        success: true,
        message: data.message,
        password: data.tempPassword
      });
      
      setTimeout(() => {
        setResetPasswordResult(null);
      }, 30000);
      
    } catch (error) {
      console.error("Error resetting user password:", error);
      setResetPasswordResult({
        success: false,
        message: error.response?.data?.message || "Failed to reset password"
      });
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      isAdmin: user.isAdmin,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {resetPasswordResult && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-center mb-2">
            <Key className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="font-semibold text-yellow-800">Temporary Password</h3>
          </div>
          <p className="text-yellow-700 mb-1">
            A new temporary password has been set for this user:
          </p>
          <p className="bg-white p-3 rounded font-mono text-yellow-900">
            {resetPasswordResult.tempPassword}
          </p>
          <p className="text-yellow-600 text-sm mt-2">
            Please communicate this password to the user securely. They should change it after their next login.
          </p>
          <button
            className="mt-3 px-4 py-2 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 transition-colors"
            onClick={() => setResetPasswordResult(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="relative w-full md:w-96 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search users by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Users ({filteredUsers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  {editUser && editUser._id === user._id ? (
                    <td colSpan="5" className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Edit Form Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        {/* Edit Form Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                              type="text"
                              value={editData.mobile}
                              onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 space-x-2">
                              <input
                                type="checkbox"
                                checked={editData.isAdmin}
                                onChange={(e) => setEditData({ ...editData, isAdmin: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span>Admin Privileges</span>
                            </label>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={updateUser}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditUser(null)}
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
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.mobile || "-"}</td>
                      <td className="px-6 py-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Shield className="h-3.5 w-3.5 mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <User className="h-3.5 w-3.5 mr-1" />
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                            title="Edit User"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => resetUserPassword(user._id)}
                            className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-md"
                            title="Reset Password"
                          >
                            <Key className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete User"
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
        {filteredUsers.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No users found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementAdmin;