const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

// IMPORTANT: Order matters in routes! More specific routes first, then dynamic routes

// Admin routes (must come before the /:id route)
router.get('/admin', protect, admin, orderController.getOrders);
router.get('/admin/statistics', protect, admin, orderController.getOrderStats);

// Admin routes with parameters
router.get('/admin/:id', protect, admin, orderController.getOrderDetailsAdmin);
router.put('/admin/:id/deliver', protect, admin, orderController.updateOrderToDelivered);
router.put('/admin/:id/pay', protect, admin, orderController.updateOrderPaymentAdmin);
router.delete('/admin/:id', protect, admin, orderController.deleteOrder);

// Order notes routes
router.route('/admin/:id/notes')
  .get(protect, admin, orderController.getOrderNotes)
  .post(protect, admin, orderController.addOrderNote);

router.route('/admin/:id/notes/:noteId')
  .delete(protect, admin, orderController.deleteOrderNote);

// Customer contact route
router.post('/admin/:id/contact', protect, admin, orderController.contactCustomer);

// Customer routes
router.post('/', protect, orderController.createOrder);
router.post('/verify-payment', protect, orderController.verifyPayment);
router.get('/myorders', protect, orderController.getMyOrders);
router.post('/retry-payment', protect, orderController.retryPayment);

// Routes with dynamic parameters come LAST
router.get('/:id', protect, orderController.getOrderById);
router.get('/:id/status', protect, orderController.checkOrderStatus);

module.exports = router;