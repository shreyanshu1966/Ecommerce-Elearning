import { useState, useEffect } from "react";
import { Edit, Trash2, Save, X, Plus } from "lucide-react";
import axiosInstance from '../utils/axiosConfig'; // Replace api with axiosInstance

const SchoolProgramsAdmin = () => {
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
    image: "",
    youtubeLink: "",
  });
  const [editProgram, setEditProgram] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data } = await axiosInstance.get("/school-programs");
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching school programs:", error.response?.data || error.message);
    }
  };

  const addProgram = async () => {
    const { title, description, image, youtubeLink } = newProgram;
    if (!title || !description || !image) {
      console.error("Required fields missing");
      return;
    }
    
    try {
      await axiosInstance.post("/school-programs", {
        title,
        description,
        image,
        youtubeLink
      });
      
      fetchPrograms();
      setNewProgram({ title: "", description: "", image: "", youtubeLink: "" });
    } catch (error) {
      console.error("Error adding school program:", error.response?.data || error.message);
    }
  };

  const updateProgram = async () => {
    if (!editProgram) return;
    try {
      await axiosInstance.put(`/school-programs/${editProgram._id}`, {
        title: editProgram.title,
        description: editProgram.description,
        image: editProgram.image,
        youtubeLink: editProgram.youtubeLink
      });
      
      fetchPrograms();
      setEditProgram(null);
    } catch (error) {
      console.error("Error updating school program:", error.response?.data || error.message);
    }
  };

  const deleteProgram = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this program?");
    if (!isConfirmed) return;
    
    try {
      await axiosInstance.delete(`/school-programs/${id}`);
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting school program:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (program) => {
    setEditProgram({ ...program });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage School Programs</h2>
      
      {/* Create Program Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-500" />
          Add New Program
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              placeholder="Program Title"
              value={newProgram.title}
              onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Program Description"
              value={newProgram.description}
              onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              placeholder="Image URL"
              value={newProgram.image}
              onChange={(e) => setNewProgram({ ...newProgram, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube Demo Link</label>
            <input
              type="text"
              placeholder="YouTube Demo Link"
              value={newProgram.youtubeLink}
              onChange={(e) => setNewProgram({ ...newProgram, youtubeLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={addProgram}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          <Plus className="h-5 w-5" />
          Create Program
        </button>
      </div>
      
      {/* Programs List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            Existing Programs ({programs.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {programs.map((program) => (
                <tr key={program._id}>
                  {editProgram && editProgram._id === program._id ? (
                    <td colSpan="2" className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Edit Form Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              value={editProgram.title}
                              onChange={(e) => setEditProgram({ ...editProgram, title: e.target.value })}
                              placeholder="Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              value={editProgram.description}
                              onChange={(e) => setEditProgram({ ...editProgram, description: e.target.value })}
                              placeholder="Description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                            />
                          </div>
                        </div>
                        {/* Edit Form Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              type="text"
                              value={editProgram.image}
                              onChange={(e) => setEditProgram({ ...editProgram, image: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">YouTube Demo Link</label>
                            <input
                              type="text"
                              value={editProgram.youtubeLink}
                              onChange={(e) => setEditProgram({ ...editProgram, youtubeLink: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                          <button
                            onClick={updateProgram}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditProgram(null)}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={program.image}
                            alt={program.title}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{program.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {program.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(program)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteProgram(program._id)}
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

export default SchoolProgramsAdmin;

