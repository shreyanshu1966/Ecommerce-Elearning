import { Link } from "react-router-dom";
import { BookOpen, Clock, User, Play } from "lucide-react";

const MyCourse = ({ course }) => {
  if (!course) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-3">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.lessons || 0} lessons</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration || 0} hours</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{course.instructor}</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <Link
            to={`/courses/${course._id}`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors"
          >
            View Course
          </Link>
          <Link
            to={`/courses/${course._id}/learn`}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Play className="h-4 w-4 mr-1" /> Continue Learning
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;