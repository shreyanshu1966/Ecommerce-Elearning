import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../../store/cartSlice";
import { Clock, BookOpen, Rocket, ShoppingCart, CheckCircle } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/api/courses/${id}`);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!course) return;
    dispatch(addToCart({ itemId: course._id, itemType: "Course", quantity: 1 }));
  };

  const isInCart = cartItems.some(
    (item) =>
      item.itemType === "Course" &&
      ((item.course && item.course._id === course?._id) ||
       item.course === course?._id)
  );

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Course Header */}
        <div className="relative bg-gray-900">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-96 object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent flex items-end p-8">
            <h1 className="text-4xl font-bold text-white max-w-3xl">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8 p-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                What You&apos;ll Learn
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {course.curriculum?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing and CTA */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-gray-800">
                    ${course.price}
                  </span>
                  {course.price && (
                    <span className="text-sm line-through text-gray-400">
                      ${course.price * 2}
                    </span>
                  )}
                </div>

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

                {/* Hours, Lessons, Level */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>{course.duration} Hours Content</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <span>{course.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Rocket className="h-5 w-5 text-blue-500" />
                    <span>{course.level} Level</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            {course.instructor && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructor</h3>
                <div className="flex items-center gap-4">
                  {course.instructorImage && (
                    <img
                      src={course.instructorImage}
                      alt={course.instructor}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{course.instructor}</p>
                    {course.instructorBio && (
                      <p className="text-gray-600 mt-1">{course.instructorBio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
