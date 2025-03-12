// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";

// // const Courses = () => {
// //   const [courses, setCourses] = useState([]);

// //   useEffect(() => {
// //     axios.get("/api/courses").then((res) => setCourses(res.data));
// //   }, []);

// //   return (
// //     <div>
// //       <h2 className="text-2xl font-bold mb-4">Courses</h2>
// //       <ul>
// //         {courses.map((course) => (
// //           <li key={course._id} className="p-2 border-b">
// //             <Link to={`/courses/${course._id}`} className="text-blue-500 hover:underline">
// //               {course.title}
// //             </Link>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Courses;


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Courses = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     axios.get("/api/courses").then((res) => setCourses(res.data));
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//         Explore Our Courses
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {courses.map((course) => (
//           <div
//             key={course._id}
//             className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//           >
//             <Link to={`/courses/${course._id}`}>
//               <div className="relative aspect-video">
//                 <img
//                   src={course.image}
//                   alt={course.title}
//                   className="absolute inset-0 w-full h-full object-cover"
//                 />
//               </div>

//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
//                   {course.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//                   {course.description}
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                     View Course
//                   </button>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Courses;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("/api/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Explore Our Courses
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
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
                  /* 
                    - "object-cover" fills the area, cropping the image if needed.
                    - If you prefer to see the entire image (possibly with empty space),
                      use "object-contain" instead:
                      className="absolute inset-0 w-full h-full object-contain p-2"
                  */
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
    </div>
  );
};

export default Courses;
