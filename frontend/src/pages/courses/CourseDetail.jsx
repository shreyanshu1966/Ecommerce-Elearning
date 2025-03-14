import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import axiosInstance from "../../utils/axiosConfig";
import { BookOpen, CheckCircle, Clock, User, BarChart2, ShoppingCart, PlayCircle, Lock } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/courses/${id}`);
        setCourse(data);
        
        // Ensure we have modules property, even if empty
        if (!data.modules) {
          data.modules = [];
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (user) {
        try {
          const { data } = await axiosInstance.get('/users/my-courses');
          const enrolled = data.some(c => c._id === id);
          setIsEnrolled(enrolled);
        } catch (err) {
          console.error("Error checking enrollment:", err);
        }
      }
    };
    
    checkEnrollment();
  }, [id, user]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Make sure we're passing the actual ID from the course object
    if (!course || !course._id) {
      console.error("Cannot add to cart: course or course._id is undefined");
      return;
    }
    
    dispatch(addToCart({ 
      itemId: course._id, 
      itemType: "Course", 
      quantity: 1 
    }));
  };

  const isInCart = cartItems.some(
    (item) =>
      item.itemType === "Course" &&
      ((item.course && item.course._id === course?._id) ||
       item.course === course?._id)
  );

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

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg text-center">
          Course not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Course Header */}
        <div className="aspect-w-16 aspect-h-6 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                <span>{course.level || "All Levels"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{course.lessons || 0} lessons</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 p-8">
          {/* Course Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.isArray(course.curriculum) ? (
                  course.curriculum.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
                ) : (
                  <li>No curriculum details available</li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500">
                    {course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons • {course.duration} hours total
                  </p>
                </div>
                
                {course.modules && course.modules.map((module, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <div className="p-4 flex justify-between">
                      <h3 className="font-medium">{module.title}</h3>
                      <span className="text-sm text-gray-500">
                        {module.lessons?.length || 0} lessons
                      </span>
                    </div>
                    {module.lessons && module.lessons.slice(0, 3).map((lesson, idx) => (
                      <div key={idx} className="px-4 py-2 text-sm flex items-center gap-2 ml-4 border-t border-gray-100">
                        {lesson.isFree ? (
                          <PlayCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-gray-700">{lesson.title}</span>
                        {lesson.duration && (
                          <span className="text-gray-500 text-xs ml-auto">
                            {lesson.duration} min
                          </span>
                        )}
                        {lesson.isFree && (
                          <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                            Preview
                          </span>
                        )}
                      </div>
                    ))}
                    {module.lessons && module.lessons.length > 3 && (
                      <div className="px-4 py-2 text-sm text-gray-500 ml-4 border-t border-gray-100">
                        + {module.lessons.length - 3} more lessons
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {course.instructorBio && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About the Instructor</h2>
                <div className="flex items-start gap-4">
                  {course.instructorImage && (
                    <img
                      src={course.instructorImage}
                      alt={course.instructor}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{course.instructor}</h3>
                    <p className="text-gray-600 mt-2">{course.instructorBio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="mb-4">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-800">
                    ${course.price}
                  </span>
                  {course.price && (
                    <span className="text-sm line-through text-gray-400">
                      ${course.price * 2}
                    </span>
                  )}
                </div>

                {isEnrolled ? (
                  <Link
                    to={`/courses/${id}/learn`}
                    className="w-full py-3.5 rounded-xl font-semibold transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Start Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                      isInCart
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                    } text-white shadow-lg`}
                  >
                    {isInCart ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Added to Cart
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </div>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800">This course includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {course.duration || 0} hours on-demand video
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    {course.lessons || 0} lessons
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Full lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
