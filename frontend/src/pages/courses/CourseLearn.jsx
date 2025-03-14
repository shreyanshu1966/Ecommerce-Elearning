import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, List } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import CourseContentPlayer from '../../components/CourseContentPlayer';

const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check if user is enrolled in this course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        // Get course details
        const courseResponse = await axiosInstance.get(`/courses/${id}`);
        setCourse(courseResponse.data);
        
        // Check if user is enrolled
        const enrollmentResponse = await axiosInstance.get('/users/my-courses');
        const enrolledCourses = enrollmentResponse.data;
        const enrolled = enrolledCourses.some(course => course._id === id);
        
        setIsEnrolled(enrolled);
        
        // If not enrolled, redirect to course details page
        if (!enrolled) {
          navigate(`/courses/${id}`);
        }
      } catch (err) {
        console.error("Error checking enrollment:", err);
        setError("Failed to verify course enrollment");
      } finally {
        setLoading(false);
      }
    };
    
    checkEnrollment();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Course Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={`/courses/${id}`} className="flex items-center text-gray-700 hover:text-blue-600 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="sr-only sm:not-sr-only">Back to course</span>
            </Link>
            <h1 className="text-lg font-medium text-gray-900 truncate max-w-xs sm:max-w-md">
              {course?.title}
            </h1>
          </div>
          
          <button 
            className="md:hidden flex items-center text-gray-700 hover:text-blue-600"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            <List className="h-5 w-5" />
            <span className="ml-2">Contents</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Content Player */}
        <CourseContentPlayer courseId={id} userEnrolled={isEnrolled} />
      </div>
    </div>
  );
};

export default CourseLearn;