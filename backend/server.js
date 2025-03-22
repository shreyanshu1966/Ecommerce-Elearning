const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

const cartRoutes = require('./routes/cartRoutes');
const { protect } = require('./middleware/authMiddleware');
const schoolProgramRoutes = require('./routes/schoolProgramRoutes');
const demoRoutes = require('./routes/demoRoutes');
const blogRoutes = require('./routes/blogRoutes');
const streamRoutes = require('./routes/streamRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    'https://www.intuitiverobotics.in',
    'https://intuitiverobotics.in',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

app.use('/api/users', userRoutes);

app.use('/api/courses', courseRoutes);

app.use('/api/products', productRoutes);
const orderRoutes = require('./routes/orderRoutes');

app.use("/api/cart", protect, cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/school-programs', schoolProgramRoutes);

app.use('/api/demo', demoRoutes);

app.use('/api/blogs', blogRoutes);

app.use('/api/streams', streamRoutes);

// Add this middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
