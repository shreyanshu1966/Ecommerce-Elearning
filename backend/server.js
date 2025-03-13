const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const productRoutes = require('./routes/productRoutes');

const cartRoutes = require('./routes/cartRoutes');
const { protect } = require('./middleware/authMiddleware');
const schoolProgramRoutes = require('./routes/schoolProgramRoutes');
const demoRoutes = require('./routes/demoRoutes');
const blogRoutes = require('./routes/blogRoutes');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.use('/api/courses', courseRoutes);

app.use('/api/products', productRoutes);
const orderRoutes = require('./routes/orderRoutes');

app.use("/api/cart", protect, cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/school-programs', schoolProgramRoutes);

app.use('/api/demo', demoRoutes);

app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
