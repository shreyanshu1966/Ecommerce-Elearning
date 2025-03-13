import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig'; // Replace axios with axiosInstance

const CourseSection = () => {
  const [courses, setCourses] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Make sure to use the correct API path
        const { data } = await axiosInstance.get("/courses"); // Remove /api prefix
        // Check if data is an array
        if (Array.isArray(data)) {
          setCourses(data.slice(0, 6)); // Fetch only 6 courses
        } else {
          // If data is not an array, set courses as empty array
          console.error("API response doesn't contain an array:", data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Failed to fetch courses");
        setCourses([]); // Set as empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Courses</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Choose from our selection of specialized courses designed for all skill levels
          </p>
        </div>
        
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {!loading && !error && courses.length === 0 && (
          <p className="text-center py-12 text-gray-500">No courses available at the moment.</p>
        )}
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {Array.isArray(courses) && courses.map((course) => (
            <article key={course?._id || index} className="flex flex-col items-start">
              <div className="relative w-full">
                <Link to={`/courses/${course?._id}`} className="absolute inset-0 z-10" />
                <img
                  src={course?.image}
                  alt={course?.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime="2020-03-16" className="text-gray-500">
                    {course?.duration}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {course?.level}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link to={`/courses/${course?._id}`} className="absolute inset-0" />
                    {course?.title}
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-gray-600">{course?.description}</p>
                </div>
                <div className="mt-8">
                  <Link
                    to={`/courses/${course?._id}`}
                    className="text-blue-600 hover:text-blue-500 inline-flex items-center text-sm font-semibold"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="mt-12 text-center">
          <Link
            to="/courses"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-blue-700"
          >
            Explore More Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseSection;
