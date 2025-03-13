const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        mobile 
      });
      await newUser.save();
  
      // Generate a token right after signup
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      // Return the same structure as login so your frontend can handle it
      res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          isAdmin: newUser.isAdmin,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return consistent user data structure
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                isAdmin: user.isAdmin,
                mobile: user.mobile 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile (Protected Route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin, mobile } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    
    // Only update isAdmin if explicitly provided
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      mobile: updatedUser.mobile
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reset user password (Admin only)
const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set a default password (you might want to generate a random one)
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = 'Password123';
    user.password = await bcrypt.hash(defaultPassword, salt);
    
    await user.save();
    
    res.json({ 
      message: 'Password reset successful',
      tempPassword: defaultPassword 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's purchased courses
const getMyCourses = async (req, res) => {
  try {
    // Import Order and Course models if not already at the top
    const Order = require('../models/Order');
    const Course = require('../models/Course');
    
    // Find all orders for this user that are paid
    const orders = await Order.find({
      user: req.user.id,
      isPaid: true,
    });

    // Extract course IDs from orders
    const courseIds = [];
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.itemType === 'Course' && item.itemId) {
          courseIds.push(item.itemId);
        }
      });
    });

    // Get unique course IDs
    const uniqueCourseIds = [...new Set(courseIds.map(id => id.toString()))];
    
    if (uniqueCourseIds.length === 0) {
      return res.json([]);
    }
    
    // Fetch the courses
    const courses = await Course.find({ _id: { $in: uniqueCourseIds } });
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  resetUserPassword,
  getMyCourses
};
