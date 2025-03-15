import { useState, useEffect } from "react";
import { Edit, Trash2, Save, X, Plus, BookOpen, User, Clock, ChevronDown, ChevronRight, Video, Layers, Upload } from "lucide-react";
import axiosInstance from '../utils/axiosConfig';

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
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
    category: "",
    modules: [],
  });

  const [editCourse, setEditCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [uploadingVideo, setUploadingVideo] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axiosInstance.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const { data } = await axiosInstance.get(`/courses/${courseId}`);
      setModulesList(data.modules || []);
      setCurrentCourseId(courseId);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setModulesList([]);
    }
  };

  const addCourse = async () => {
    if (!newCourse.category) {
      alert("Category is required");
      return;
    }

    try {
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
        category,
      } = newCourse;

      const response = await axiosInstance.post('/courses', {
        title,
        description,
        price,
        image,
        instructor,
        curriculum: curriculum.split("\n").filter(item => item.trim() !== ""),
        duration: Number(duration) || 0,
        lessons: Number(lessons) || 0,
        level,
        instructorBio,
        instructorImage,
        category,
        modules: [],
      });

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
        category: "",
      });
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
      alert(`Failed to add course: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateCourse = async () => {
    if (!editCourse) return;

    if (!editCourse.category) {
      alert("Category is required");
      return;
    }

    try {
      const curriculumArray = editCourse.curriculum
        ? editCourse.curriculum.split("\n").map((line) => line.trim()).filter((line) => line !== "")
        : [];

      await axiosInstance.put(`/courses/${editCourse._id}`, {
        ...editCourse,
        curriculum: curriculumArray,
        duration: editCourse.duration ? Number(editCourse.duration) : 0,
        lessons: editCourse.lessons ? Number(editCourse.lessons) : 0,
        category: editCourse.category,
      });

      fetchCourses();
      setEditCourse(null);
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
      alert(`Failed to update course: ${error.response?.data?.message || error.message}`);
    }
  };

  const saveModules = async () => {
    try {
      await axiosInstance.put(`/courses/${currentCourseId}/modules`, {
        modules: modulesList,
      });
      fetchCourses();
      alert("Course modules updated successfully");
    } catch (error) {
      console.error("Error saving modules:", error);
      alert("Failed to save modules");
    }
  };

  const deleteCourse = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/courses/${id}`);
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
      category: course.category || "",
    });
  };

  const handleModuleClick = (courseId) => {
    setCurrentCourseId(courseId);
    fetchCourseDetails(courseId);
  };

  const addModule = () => {
    setModulesList([
      ...modulesList,
      {
        title: "New Module",
        description: "",
        lessons: []
      }
    ]);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...modulesList];
    updatedModules[index][field] = value;
    setModulesList(updatedModules);
  };

  const deleteModule = (index) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    const updatedModules = [...modulesList];
    updatedModules.splice(index, 1);
    setModulesList(updatedModules);
  };

  const toggleModuleExpand = (index) => {
    setExpandedModules({
      ...expandedModules,
      [index]: !expandedModules[index]
    });
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons = [
      ...(updatedModules[moduleIndex].lessons || []),
      {
        title: "New Lesson",
        description: "",
        videoUrl: "",
        duration: 0,
        isFree: false
      }
    ];
    setModulesList(updatedModules);
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModulesList(updatedModules);
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModulesList(updatedModules);
  };

  // Improve the handleVideoUpload function with progress tracking
const handleVideoUpload = async (moduleIndex, lessonIndex, file) => {
  if (!currentCourseId || !file) return;
  
  // Validate file size before upload
  if (file.size > 100 * 1024 * 1024) { // 100 MB
    alert("File too large. Maximum size is 100MB.");
    return;
  }
  
  // Check file type
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    alert("Invalid file type. Only MP4, WebM, OGG and QuickTime formats are allowed.");
    return;
  }
  
  try {
    // Create FormData for the file upload
    const formData = new FormData();
    formData.append('video', file);
    
    // Set uploading state for this specific lesson
    setUploadingVideo({
      moduleIndex,
      lessonIndex,
      uploading: true,
      progress: 0
    });
    
    // Upload the video with progress tracking
    const { data } = await axiosInstance.post(
      `/courses/${currentCourseId}/modules/${moduleIndex}/lessons/${lessonIndex}/upload-video`,
      formData,
      { 
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingVideo(prev => ({
            ...prev,
            progress: percentCompleted
          }));
        }
      }
    );
    
    // Update the lesson with new video URL and thumbnail if available
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons[lessonIndex].videoUrl = data.videoUrl;
    if (data.thumbnailUrl) {
    updatedModules[moduleIndex].lessons[lessonIndex].thumbnailUrl = data.thumbnailUrl;
    }
    setModulesList(updatedModules);
    
    // Clear uploading state after a short delay for better UX
    setTimeout(() => {
    setUploadingVideo({});
    }, 1000);
    
  } catch (error) {
    console.error('Error uploading video:', error);
    alert(`Failed to upload video: ${error.response?.data?.message || error.message}`);
    setUploadingVideo({});
  }
};

  // Main component rendering
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
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Course Category (e.g. Programming, Robotics)"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                              value={editCourse.category}
                              onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                              placeholder="Category"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                            title="Edit course details"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleModuleClick(course._id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-md"
                            title="Manage modules and lessons"
                          >
                            <Layers className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete course"
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

      {/* Module and Lesson Manager */}
      {currentCourseId && (
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Course Modules & Lessons
            </h3>
            <button
              onClick={() => setCurrentCourseId(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-700">
                {courses.find(c => c._id === currentCourseId)?.title || "Course"} - Modules
              </h4>
              <button
                onClick={addModule}
                className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            </div>

            {modulesList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No modules yet. Add your first module to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {modulesList.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleModuleExpand(moduleIndex)}
                          className="p-1 rounded-md hover:bg-gray-200"
                        >
                          {expandedModules[moduleIndex] ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                          className="font-medium text-gray-800 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addLesson(moduleIndex)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded flex items-center gap-1 hover:bg-green-600"
                        >
                          <Plus className="h-3 w-3" />
                          Lesson
                        </button>
                        <button
                          onClick={() => deleteModule(moduleIndex)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {expandedModules[moduleIndex] && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Module Description</label>
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(moduleIndex, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                            placeholder="Enter module description..."
                          />
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Lessons ({module.lessons?.length || 0})</h5>
                          
                          {!module.lessons?.length ? (
                            <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-300 rounded-md">
                              No lessons yet. Add your first lesson.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="border border-gray-200 rounded-md p-3">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <Video className="h-4 w-4 text-blue-500" />
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                                        className="font-medium text-gray-800 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                      />
                                    </div>
                                    <button
                                      onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                      <textarea
                                        value={lesson.description}
                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, "description", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                                        placeholder="Lesson description..."
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Video</label>
                                        <div className="space-y-2">
                                          {lesson.videoUrl && (
                                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-center justify-between">
                                              <span className="truncate">{lesson.videoUrl}</span>
                                              <button
                                                type="button"
                                                onClick={() => updateLesson(moduleIndex, lessonIndex, "videoUrl", "")}
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                &times;
                                              </button>
                                            </div>
                                          )}

                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="text"
                                              value={lesson.videoUrl}
                                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, "videoUrl", e.target.value)}
                                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                              placeholder="External URL or upload"
                                            />
                                            
                                            <label className="relative cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors">
                                              <Upload className="h-4 w-4" />
                                              <input 
                                                type="file" 
                                                className="sr-only" 
                                                accept="video/mp4,video/webm,video/ogg"
                                                onChange={(e) => {
                                                  if (e.target.files?.[0]) {
                                                    handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0]);
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>
                                          
                                          {uploadingVideo.moduleIndex === moduleIndex && 
                                          uploadingVideo.lessonIndex === lessonIndex && 
                                          uploadingVideo.uploading && (
                                            <div className="flex items-center space-x-2 text-xs text-blue-600">
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                              <span>Uploading video...</span>
                                            </div>
                                          )}
                                          
                                          <p className="text-xs text-gray-500">
                                            Max file size: 100MB. Supported formats: MP4, WebM, OGG
                                          </p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">Duration (min)</label>
                                          <input
                                            type="number"
                                            value={lesson.duration}
                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "duration", Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            placeholder="0"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id={`free-${moduleIndex}-${lessonIndex}`}
                                            checked={lesson.isFree}
                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "isFree", e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                          />
                                          <label htmlFor={`free-${moduleIndex}-${lessonIndex}`} className="ml-2 text-xs font-medium text-gray-700">
                                            Preview (Free)
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveModules}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Save All Modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesAdmin;
