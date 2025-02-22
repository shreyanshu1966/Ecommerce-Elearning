// import { useState, useEffect } from "react";
// import axios from "axios";

// const CoursesAdmin = () => {
//   const [courses, setCourses] = useState([]);
//   const [newCourse, setNewCourse] = useState({ title: "", description: "" });
//   const [editCourse, setEditCourse] = useState(null);
  
//   useEffect(() => {
//     axios.get("/api/courses").then((res) => setCourses(res.data));
//   }, []);

//   const addCourse = async () => {
//     if (!newCourse.title || !newCourse.description) return;
  
//     try {
//       const token = localStorage.getItem("token"); // Get the token from localStorage
//       if (!token) {
//         console.error("No token found. User must be logged in.");
//         return;
//       }
  
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`, // Send token in headers
//         },
//       };
  
//       const { data } = await axios.post("/api/courses", newCourse, config);
//       setCourses([...courses, data]);
//       setNewCourse({ title: "", description: "" });
//     } catch (error) {
//       console.error("Error adding course:", error.response?.data || error.message);
//     }
//   };
  
  

//   const updateCourse = async () => {
//     if (!editCourse) return;
  
//     try {
//       const token = localStorage.getItem("token");
//       const config = { headers: { Authorization: `Bearer ${token}` } };
  
//       const { data } = await axios.put(`/api/courses/${editCourse._id}`, editCourse, config);
//       setCourses(courses.map((c) => (c._id === editCourse._id ? data : c)));
//       setEditCourse(null);
//     } catch (error) {
//       console.error("Error updating course:", error.response?.data || error.message);
//     }
//   };
  
//   const deleteCourse = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const config = { headers: { Authorization: `Bearer ${token}` } };
  
//       await axios.delete(`/api/courses/${id}`, config);
//       setCourses(courses.filter((c) => c._id !== id));
//     } catch (error) {
//       console.error("Error deleting course:", error.response?.data || error.message);
//     }
//   };
  
  

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Manage Courses</h2>
//       <input type="text" placeholder="Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="border p-2 mr-2" />
//       <input type="text" placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} className="border p-2 mr-2" />
//       <button onClick={addCourse} className="bg-green-500 text-white px-4 py-2">Add</button>

//       <ul className="mt-4">
//         {courses.map((course) => (
//           <li key={course._id} className="flex justify-between bg-gray-100 p-2 my-2">
//             {editCourse?._id === course._id ? (
//               <>
//                 <input type="text" value={editCourse.title} onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })} className="border p-1" />
//                 <input type="text" value={editCourse.description} onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })} className="border p-1" />
//               </>
//             ) : (
//               <span>{course.title} - {course.description}</span>
//             )}
//             <div>
//               {editCourse?._id === course._id ? (
//                 <button onClick={updateCourse} className="bg-blue-500 text-white px-2 py-1 mx-2">Save</button>
//               ) : (
//                 <button onClick={() => setEditCourse(course)} className="bg-yellow-500 text-white px-2 py-1 mx-2">Edit</button>
//               )}
//               <button onClick={() => deleteCourse(course._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CoursesAdmin;


import { useState, useEffect } from "react";
import axios from "axios";

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    instructor: "",
  });
  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error.response?.data || error.message);
      }
    };

    fetchCourses();
  }, []);


  // const addCourse = async () => {
  //   const { title, description, price, image, instructor } = newCourse;
  //   if (!title || !description || !price || !image || !instructor) {
  //     console.error("All fields are required!");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.error("No token found. User must be logged in.");
  //       return;
  //     }

  //     const config = { headers: { Authorization: `Bearer ${token}` } };
  //     const { data } = await axios.post("/api/courses", newCourse, config);
  //     setCourses([...courses, data]);
  //     setNewCourse({ title: "", description: "", price: "", image: "", instructor: "" });
  //   } catch (error) {
  //     console.error("Error adding course:", error.response?.data || error.message);
  //   }
  // };


  const addCourse = async () => {
    const { title, description, price, image, instructor } = newCourse;
    if (!title || !description || !price || !image || !instructor) {
      console.error("All fields are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post("/api/courses", newCourse, config);
  
      // 🔥 Fetch fresh data after adding
      fetchCourses();
  
      setNewCourse({ title: "", description: "", price: "", image: "", instructor: "" });
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
    }
  };
  


  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  
  const updateCourse = async () => {
    if (!editCourse) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/courses/${editCourse._id}`, editCourse, config);
  
      // 🔥 Fetch fresh data after updating
      fetchCourses();
  
      setEditCourse(null);
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
    }
  };
  

  const deleteCourse = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
  
    if (!isConfirmed) return; // Exit if the user cancels
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be logged in.");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/courses/${id}`, config);
  
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error.message);
    }
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Courses</h2>

      <input
        type="text"
        placeholder="Title"
        value={newCourse.title}
        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={newCourse.description}
        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        placeholder="Price"
        value={newCourse.price}
        onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={newCourse.image}
        onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Instructor"
        value={newCourse.instructor}
        onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
        className="border p-2 mr-2"
      />
      <button onClick={addCourse} className="bg-green-500 text-white px-4 py-2">
        Add Course
      </button>

      <ul className="mt-4">
  {courses.map((course, index) => (
    <li key={course._id || index} className="flex justify-between bg-gray-100 p-2 my-2">
      {editCourse && editCourse._id === course._id ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={editCourse.title || ""}
            onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
            className="border p-1"
          />
          <input
            type="text"
            value={editCourse.description || ""}
            onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
            className="border p-1"
          />
          <input
            type="number"
            value={editCourse.price || ""}
            onChange={(e) => setEditCourse({ ...editCourse, price: e.target.value })}
            className="border p-1"
          />
          <input
            type="text"
            value={editCourse.image || ""}
            onChange={(e) => setEditCourse({ ...editCourse, image: e.target.value })}
            className="border p-1"
          />
          <input
            type="text"
            value={editCourse.instructor || ""}
            onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
            className="border p-1"
          />
        </div>
      ) : (
        <span>
          {course.title} - {course.description} - ${course.price} - {course.instructor}
        </span>
      )}
      <div>
        {editCourse && editCourse._id === course._id ? (
          <button onClick={updateCourse} className="bg-blue-500 text-white px-2 py-1 mx-2">
            Save
          </button>
        ) : (
          <button onClick={() => setEditCourse({ ...course })} className="bg-yellow-500 text-white px-2 py-1 mx-2">
            Edit
          </button>
        )}
        <button onClick={() => deleteCourse(course._id)} className="bg-red-500 text-white px-2 py-1">
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>


    </div>
  );
};

export default CoursesAdmin;
