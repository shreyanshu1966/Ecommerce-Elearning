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
  Clock,
} from "lucide-react";

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    instructor: "",
    curriculum: "",
    // NEW FIELDS
    duration: "",
    lessons: "",
    level: "",
    instructorBio: "",
    instructorImage: "",
  });

  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
    }
  };

  const addCourse = async () => {
    const {
      title,
      description,
      price,
      image,
      instructor,
      curriculum,
      duration,
      lessons,
      level,
      instructorBio,
      instructorImage,
    } = newCourse;

    // Basic validation
    if (!title || !description || !price || !image || !instructor) {
      console.error(
        "All required fields (title, description, price, image, instructor) must be filled!"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }

      // Convert multiline curriculum string to an array
      const curriculumArray = curriculum
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "/api/courses",
        {
          title,
          description,
          price,
          image,
          instructor,
          curriculum: curriculumArray,
          duration: duration ? Number(duration) : 0,
          lessons: lessons ? Number(lessons) : 0,
          level,
          instructorBio,
          instructorImage,
        },
        config
      );

      fetchCourses();
      setNewCourse({
        title: "",
        description: "",
        price: "",
        image: "",
        instructor: "",
        curriculum: "",
        duration: "",
        lessons: "",
        level: "",
        instructorBio: "",
        instructorImage: "",
      });
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
    }
  };

  const updateCourse = async () => {
    if (!editCourse) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }

      const curriculumArray = editCourse.curriculum
        ? editCourse.curriculum.split("\n").map((line) => line.trim()).filter((line) => line !== "")
        : [];

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `/api/courses/${editCourse._id}`,
        {
          ...editCourse,
          curriculum: curriculumArray,
          duration: editCourse.duration ? Number(editCourse.duration) : 0,
          lessons: editCourse.lessons ? Number(editCourse.lessons) : 0,
        },
        config
      );

      fetchCourses();
      setEditCourse(null);
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
    }
  };

  const deleteCourse = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/courses/${id}`, config);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (course) => {
    setEditCourse({
      ...course,
      curriculum: (course.curriculum || []).join("\n"),
      duration: course.duration?.toString() || "",
      lessons: course.lessons?.toString() || "",
      level: course.level || "",
      instructorBio: course.instructorBio || "",
      instructorImage: course.instructorImage || "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>

      {/* Create Course Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-500" />
          Add New Course
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Course Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCourse.image}
                  onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Additional Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                <input
                  type="number"
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lessons</label>
                <input
                  type="number"
                  placeholder="Lessons"
                  value={newCourse.lessons}
                  onChange={(e) => setNewCourse({ ...newCourse, lessons: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level (e.g. Beginner)</label>
              <input
                type="text"
                placeholder="Level"
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instructor Name</label>
              <input
                type="text"
                placeholder="Instructor Name"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor Image URL</label>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCourse.instructorImage}
                  onChange={(e) => setNewCourse({ ...newCourse, instructorImage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor Bio</label>
                <textarea
                  placeholder="Short bio"
                  value={newCourse.instructorBio}
                  onChange={(e) => setNewCourse({ ...newCourse, instructorBio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Curriculum</label>
              <textarea
                placeholder="One learning objective per line"
                value={newCourse.curriculum}
                onChange={(e) => setNewCourse({ ...newCourse, curriculum: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
              />
            </div>
          </div>
        </div>
        <button
          onClick={addCourse}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          <Plus className="h-5 w-5" />
          Create Course
        </button>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Existing Courses ({courses.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id}>
                  {editCourse && editCourse._id === course._id ? (
                    <td colSpan="5" className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Edit Form Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              value={editCourse.title}
                              onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                              placeholder="Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              value={editCourse.description}
                              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                              placeholder="Description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              value={editCourse.image}
                              onChange={(e) => setEditCourse({ ...editCourse, image: e.target.value })}
                              placeholder="Image URL"
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
                                value={editCourse.price}
                                onChange={(e) => setEditCourse({ ...editCourse, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Duration</label>
                              <input
                                type="number"
                                value={editCourse.duration}
                                onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Lessons</label>
                            <input
                              type="number"
                              value={editCourse.lessons}
                              onChange={(e) => setEditCourse({ ...editCourse, lessons: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Level</label>
                            <input
                              type="text"
                              value={editCourse.level}
                              onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}
                              placeholder="Level"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Instructor Image URL</label>
                              <input
                                type="text"
                                value={editCourse.instructorImage}
                                onChange={(e) => setEditCourse({ ...editCourse, instructorImage: e.target.value })}
                                placeholder="Image URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Instructor Bio</label>
                              <textarea
                                value={editCourse.instructorBio}
                                onChange={(e) => setEditCourse({ ...editCourse, instructorBio: e.target.value })}
                                placeholder="Bio"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Curriculum</label>
                            <textarea
                              value={editCourse.curriculum}
                              onChange={(e) => setEditCourse({ ...editCourse, curriculum: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-4">
                            <button
                              onClick={updateCourse}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditCourse(null)}
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
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">${course.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {course.instructor}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {course.duration}h
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course._id)}
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

export default CoursesAdmin;
