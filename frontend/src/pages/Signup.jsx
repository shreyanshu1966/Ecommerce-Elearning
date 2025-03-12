
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { signupUser } from "../store/authSlice";
// import { useNavigate } from "react-router-dom";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState(""); // <-- new state

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     // Include mobile in the signup data
//     await dispatch(signupUser({ name, email, password, mobile }));
//     navigate("/");
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
//       <h2 className="text-2xl font-bold mb-4">Signup</h2>
//       <form onSubmit={handleSignup}>
//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full p-2 border mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 border mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 border mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {/* New Mobile Input */}
//         <input
//           type="text"
//           placeholder="Mobile Number"
//           className="w-full p-2 border mb-3"
//           value={mobile}
//           onChange={(e) => setMobile(e.target.value)}
//           // required={true} // Make this required if needed
//         />

//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white py-2 rounded"
//         >
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;



// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { signupUser } from "../store/authSlice";
// import { useNavigate } from "react-router-dom";
// import { User, Mail, Lock, Phone, UserPlus } from "lucide-react";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     await dispatch(signupUser({ name, email, password, mobile }));
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
//         <div className="text-center mb-8">
//           <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">
//             Start Learning Today
//           </h2>
//           <p className="text-gray-600">Create your free account to continue</p>
//         </div>

//         <form onSubmit={handleSignup} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name
//             </label>
//             <div className="relative">
//               <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 placeholder="John Doe"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Mobile Number
//             </label>
//             <div className="relative">
//               <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="tel"
//                 placeholder="+91 123 456 789"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email address
//             </label>
//             <div className="relative">
//               <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="email"
//                 placeholder="hello@example.com"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

          

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 rounded-lg font-semibold transition-all transform hover:shadow-lg"
//           >
//             Create Account
//           </button>

//           <div className="text-center text-sm text-gray-600 mt-4">
//             Already have an account?{" "}
//             <a
//               href="/login"
//               className="text-blue-600 hover:text-blue-700 font-medium"
//             >
//               Log in here
//             </a>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    await dispatch(signupUser({ name, email, password, mobile }));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Start Learning Today
          </h2>
          <p className="text-gray-600">Create your free account to continue</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 123 456 789"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password with visibility toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 rounded-lg font-semibold transition-all transform hover:shadow-lg"
          >
            Create Account
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
