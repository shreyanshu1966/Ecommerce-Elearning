// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // const protect = async (req, res, next) => {
// //     try {
// //         const token = req.header('Authorization');
// //         if (!token) {
// //             return res.status(401).json({ message: 'No token, authorization denied' });
// //         }

// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //         req.user = await User.findById(decoded.id).select('-password');
// //         next();
// //     } catch (error) {
// //         res.status(401).json({ message: 'Invalid token' });
// //     }
// // };
// const protect = async (req, res, next) => {
//     let token = req.header("Authorization");

//     if (token && token.startsWith("Bearer ")) {
//         token = token.split(" ")[1]; // Extract token part
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select("-password");
//             next();
//         } catch (error) {
//             return res.status(401).json({ message: "Invalid token" });
//         }
//     } else {
//         return res.status(401).json({ message: "No token, authorization denied" });
//     }
// };
// const admin = (req, res, next) => {
//     if (req.user && req.user.isAdmin) {
//         next();
//     } else {
//         res.status(403).json({ message: 'Admin access denied' });
//     }
// };

// module.exports = { protect, admin };



// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//     let token = req.header("Authorization");

//     console.log("Token received:", token); // Debugging

//     if (!token || !token.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "No token, authorization denied" });
//     }

//     try {
//         token = token.split(" ")[1]; // Extract token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = await User.findById(decoded.id).select("-password");
//         if (!req.user) {
//             return res.status(401).json({ message: "User no longer exists" });
//         }

//         next();
//     } catch (error) {
//         if (error.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Token expired. Please login again." });
//         }
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };

// const admin = (req, res, next) => {
//     if (req.user && req.user.isAdmin) {
//         next();
//     } else {
//         res.status(403).json({ message: "Admin access denied" });
//     }
// };

// module.exports = { protect, admin };


const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token = req.header("Authorization");

    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1]; // Extract token part
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired. Please login again." });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
    } else {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Admin access denied" });
    }
};

module.exports = { protect, admin };
