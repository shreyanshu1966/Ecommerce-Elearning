import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("/api/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id} className="p-2 border-b">
            <Link to={`/courses/${course._id}`} className="text-blue-500 hover:underline">
              {course.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
