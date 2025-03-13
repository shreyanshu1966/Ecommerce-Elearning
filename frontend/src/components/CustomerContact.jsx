import { useState } from "react";
import axiosInstance from "../utils/axiosConfig"; // Replace axios import
import { Mail, Send, AlertCircle } from "lucide-react";

const CustomerContact = ({ order }) => {
  const [subject, setSubject] = useState(`Order #${order._id.substring(order._id.length - 8)}`);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }
    
    try {
      setLoading(true);
      await axiosInstance.post(
        `/orders/admin/${order._id}/contact`, // Remove /api prefix
        { 
          subject,
          message,
          email: order.user?.email
        }
      );
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-500" />
          Contact Customer
        </h3>
      </div>
      
      <div className="p-6">
        {success ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-700">Message sent successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="text"
                value={order.user?.email || "N/A"}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white ${
                loading || !message.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerContact;