import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Send, User, Trash2 } from "lucide-react";

const OrderNotes = ({ orderId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [orderId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`/api/orders/admin/${orderId}/notes`, config);
      
      // Make sure data is always an array
      setNotes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching order notes:", error);
      setError("Failed to load notes. Please try again.");
      setNotes([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        `/api/orders/admin/${orderId}/notes`, 
        { content: newNote },
        config
      );
      
      setNotes([...notes, data]);
      setNewNote("");
      setError(null);
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/orders/admin/${orderId}/notes/${noteId}`, config);
      
      setNotes(notes.filter(note => note._id !== noteId));
      setError(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Order Notes
        </h3>
      </div>
      
      <div className="flex flex-col h-full">
        {/* Notes List */}
        <div className="p-4 flex-1 overflow-y-auto max-h-64">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No notes yet. Add the first note about this order.
            </div>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note._id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">{note.user?.name || "Admin"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap break-words">{note.content}</p>
                </li>
              ))}
            </ul>
          )}
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        
        {/* Add Note Form */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={addNote} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this order..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                !newNote.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Send className="h-4 w-4" />
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderNotes;