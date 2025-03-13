import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosConfig';
import MyCourse from '../components/MyCourse';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const fetchMyCourses = async () => {
      try {
        const { data } = await axiosInstance.get("/users/my-courses");
        setCourses(data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch your courses");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyCourses();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!loading && courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">You don't have any courses yet</h2>
          <p className="text-gray-500 mb-6">Explore our courses and start your learning journey today.</p>
          <Link
            to="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <MyCourse key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;