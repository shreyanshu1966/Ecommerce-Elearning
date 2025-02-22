const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrder, getOrderById, updateOrderToPaid, updateOrderToDelivered, getAllOrders, getMyOrders } = require('../controllers/orderController');

// User Routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin Routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
