import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../utils/axiosConfig'; // Using configured axios

const Courses = () => {
  const [courses, setCourses] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/courses"); // Remove /api prefix
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error("API response is not an array:", data);
          setCourses([]); // Set as empty array if data is invalid
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        setCourses([]); // Ensure courses is always an array
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Explore Our Courses
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No courses available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(courses) && courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/courses/${course._id}`}>
                {/* Image container with consistent 16:9 aspect ratio */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Course details */}
                <div className="p-6">
                  {/* Instructor name on the left */}
                  <div className="mb-2">
                    <span className="text-sm text-gray-700 font-medium">
                      Instructor: {course.instructor}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Course
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
