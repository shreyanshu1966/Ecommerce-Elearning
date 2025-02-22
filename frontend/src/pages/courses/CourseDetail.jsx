// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { addToCart } from "../../store/cartSlice";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const dispatch = useDispatch();
//   const { cartItems } = useSelector((state) => state.cart);

//   const handleAddToCart = () => {
//     if (!course) return; // Ensure course data exists
  
//     dispatch(addToCart({ itemId: course._id, itemType: "Course", quantity: 1 }));
//   };
  

//   useEffect(() => {
//     axios.get(`/api/courses/${id}`).then((res) => setCourse(res.data));
//   }, [id]);

//   const isInCart = cartItems.some((item) => item._id === id);

//   if (!course) return <p>Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
//       <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded" />
//       <p className="mt-4 text-gray-700">{course.description}</p>
//       <button
//   onClick={() => dispatch(handleAddToCart({ productId: course._id }))}
//   disabled={isInCart}
//   className={`px-4 py-2 mt-4 rounded ${isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
// >
//   {isInCart ? "Already in Cart" : "Add to Cart"}
// </button>
//     </div>
//   );
// };

// export default CourseDetail;


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { addToCart } from "../../store/cartSlice";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const dispatch = useDispatch();
//   const { cartItems } = useSelector((state) => state.cart);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const { data } = await axios.get(`/api/courses/${id}`);
//         setCourse(data);
//       } catch (error) {
//         console.error("Error fetching course:", error);
//       }
//     };

//     fetchCourse();
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!course) return;
//     dispatch(addToCart({ itemId: course._id, itemType: "Course", quantity: 1 }));
//   };

//   // Check if the course is already in the cart based on its _id
//   const isInCart = cartItems.some(
//     (item) =>
//       item.itemType === "Course" &&
//       ((item.course && item.course._id === course?._id) ||
//        item.course === course?._id)
//   );

//   if (!course) return <p>Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
//       <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded" />
//       <p className="mt-4 text-gray-700">{course.description}</p>
//       <button
//         onClick={handleAddToCart}
//         disabled={isInCart}
//         className={`px-4 py-2 mt-4 rounded ${
//           isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
//         }`}
//       >
//         {isInCart ? "Already in Cart" : "Add to Cart"}
//       </button>
//     </div>
//   );
// };

// export default CourseDetail;



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../../store/cartSlice";

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
    // If user is not logged in, navigate to /login.
    if (!user) {
      navigate("/login");
      return;
    }
    if (!course) return;
    dispatch(addToCart({ itemId: course._id, itemType: "Course", quantity: 1 }));
  };

  // Check if the course is already in the cart based on its _id
  const isInCart = cartItems.some(
    (item) =>
      item.itemType === "Course" &&
      ((item.course && item.course._id === course?._id) ||
       item.course === course?._id)
  );

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded" />
      <p className="mt-4 text-gray-700">{course.description}</p>
      <button
        onClick={handleAddToCart}
        disabled={isInCart}
        className={`px-4 py-2 mt-4 rounded ${
          isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
        }`}
      >
        {isInCart ? "Already in Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default CourseDetail;
