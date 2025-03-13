// SchoolPrograms.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig"; // Replace axios import

const SchoolPrograms = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await axiosInstance.get("/school-programs"); // Remove /api prefix
        setPrograms(data);
      } catch (error) {
        console.error("Error fetching school programs:", error.response?.data || error.message);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">School Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.isArray(programs) ? (
          programs.map((program) => (
            <Link key={program._id} to={`/school-programs/${program._id}`}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                {program.image && (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{program.title}</h2>
                  <p className="text-gray-600 mt-2">
                    {program.description.substring(0, 100)}...
                  </p>
                  <div className="mt-4">
                    
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No programs available</p>
        )}
      </div>
    </div>
  );
};

export default SchoolPrograms;
