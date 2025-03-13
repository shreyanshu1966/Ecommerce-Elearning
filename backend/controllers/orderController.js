const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order and Razorpay payment
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get the user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .populate('items.course');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Format order items from cart
    const orderItems = cart.items.map(item => {
      let itemType, itemId, name, image;
      
      if (item.itemType === 'Product' && item.product) {
        itemType = 'Product';
        itemId = item.product._id;
        name = item.product.name;
        image = item.product.image;
      } else if (item.itemType === 'Course' && item.course) {
        itemType = 'Course';
        itemId = item.course._id;
        name = item.course.title;
        image = item.course.image;
      }

      return {
        name,
        quantity: item.quantity,
        image,
        price: item.price,
        itemType,
        itemId,
      };
    });

    // Calculate prices
    const itemsPrice = cart.totalPrice;
    const taxRate = 0.18; // 18% GST 
    const taxPrice = parseFloat((itemsPrice * taxRate).toFixed(2));
    
    // Only apply shipping charges if there are physical products
    const hasPhysicalProducts = orderItems.some(item => item.itemType === 'Product');
    const shippingPrice = hasPhysicalProducts ? 100 : 0; // ₹100 shipping for physical products
    
    const totalPrice = parseFloat((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    // Create order in database
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress: hasPhysicalProducts ? shippingAddress : {},
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    await order.save();

    // Send order confirmation email
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${order._id} has been placed successfully. Total amount: ₹${totalPrice}.`,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // Amount in paise
      currency: 'INR',
      receipt: order._id.toString(),
    });

    res.status(201).json({
      orderID: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPrice,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment and update order status
// @route   POST /api/orders/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      orderID 
    } = req.body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order payment status
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      status: 'success',
    };

    const updatedOrder = await order.save();

    // Clear the user's cart after successful payment
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [], totalPrice: 0 } }
    );

    // Send payment confirmation email
    await sendEmail({
      to: req.user.email,
      subject: 'Payment Confirmation',
      text: `Your payment for order ID ${order._id} has been confirmed. Thank you for your purchase!`,
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged in user or admin
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check order payment status
// @route   GET /api/orders/:id/status
// @access  Private
exports.checkOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the logged in user or admin
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }

    // Return payment status information
    res.status(200).json({
      orderId: order._id,
      isPaid: order.isPaid,
      paidAt: order.paidAt || null,
      paymentMethod: order.paymentMethod,
      paymentResult: order.paymentResult || null,
      totalPrice: order.totalPrice,
      retryPaymentUrl: !order.isPaid ? `/checkout/retry/${order._id}` : null
    });
  } catch (error) {
    console.error('Check order status error:', error);
    res.status(500).json({ message: 'Error checking order status: ' + error.message });
  }
};

// @desc    Retry payment for an existing order
// @route   POST /api/orders/retry-payment
// @access  Private
exports.retryPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Find the existing order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check authorization
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to retry payment for this order' });
    }
    
    // Check if already paid
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }
    
    // Create a new Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalPrice * 100), // Amount in paise
      currency: 'INR',
      receipt: order._id.toString(),
    });
    
    res.status(200).json({
      orderID: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalPrice,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Retry payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add these admin controller methods to your existing orderController.js file

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Admin
exports.getOrders = async (req, res) => {
  try {
    // Add pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // Get filter parameters
    const searchKeyword = req.query.keyword
      ? {
          $or: [
            { _id: { $regex: req.query.keyword, $options: 'i' } },
            { "user.name": { $regex: req.query.keyword, $options: 'i' } },
            { "user.email": { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};
      
    const paymentStatus = req.query.paymentStatus 
      ? { isPaid: req.query.paymentStatus === 'paid' }
      : {};
      
    const deliveryStatus = req.query.deliveryStatus
      ? { isDelivered: req.query.deliveryStatus === 'delivered' }
      : {};
      
    // Handle order type filter
    let orderTypeFilter = {};
    if (req.query.orderType === 'product') {
      orderTypeFilter = { "orderItems.itemType": "Product" };
    } else if (req.query.orderType === 'course') {
      orderTypeFilter = { 
        "orderItems.itemType": "Course",
        "orderItems": { $not: { $elemMatch: { itemType: "Product" } } }
      };
    } else if (req.query.orderType === 'mixed') {
      orderTypeFilter = { 
        "orderItems": { 
          $elemMatch: { itemType: "Course" } 
        },
        "orderItems": { 
          $elemMatch: { itemType: "Product" } 
        }
      };
    }
      
    // Combine filters
    const filters = {
      ...searchKeyword,
      ...paymentStatus,
      ...deliveryStatus,
      ...orderTypeFilter
    };
    
    // Handle sorting
    let sortOptions = {};
    const sortField = req.query.sortField || 'createdAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
    
    // Map frontend sort fields to MongoDB fields if needed
    switch (sortField) {
      case 'user.name':
        sortOptions = { "user.name": sortDirection };
        break;
      case '_id':
      case 'createdAt':
      case 'totalPrice':
      case 'isPaid':
      case 'isDelivered':
        sortOptions = { [sortField]: sortDirection };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    const count = await Order.countDocuments(filters);
    
    const orders = await Order.find(filters)
      .populate('user', 'id name email')
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      count
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order details (Admin)
// @route   GET /api/orders/admin/:id
// @access  Admin
exports.getOrderDetailsAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.itemId',
        select: 'name title description stock'
      });
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered status (Admin only)
// @route   PUT /api/orders/admin/:id/deliver
// @access  Admin
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order has physical products
    const hasPhysicalProducts = order.orderItems.some(item => item.itemType === 'Product');
    
    if (!hasPhysicalProducts) {
      return res.status(400).json({ message: 'This order has no physical products to deliver' });
    }
    
    if (order.isDelivered) {
      return res.status(400).json({ message: 'Order is already marked as delivered' });
    }
    
    // Check if the order is paid
    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order is not paid yet' });
    }
    
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    
    // Add a note about the delivery status change
    if (!order.notes) {
      order.notes = [];
    }
    
    order.notes.push({
      user: req.user.id,
      content: `Order marked as DELIVERED by admin`,
      createdAt: Date.now()
    });
    
    const updatedOrder = await order.save();
    
    // Send delivery confirmation email to customer
    try {
      await sendEmail({
        to: order.user.email,
        subject: 'Order Delivery Confirmation',
        text: `Your order with ID ${order._id} has been marked as delivered. Thank you for shopping with us!`,
      });
    } catch (emailError) {
      // Log the error but don't fail the request if email fails
      console.error('Error sending delivery confirmation email:', emailError);
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order delivery status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/statistics
// @access  Admin
exports.getOrderStats = async (req, res) => {
  try {
    // Get total sales
    const totalSales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, amount: { $sum: '$totalPrice' } } }
    ]);
    
    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: today } } },
      { $group: { _id: null, amount: { $sum: '$totalPrice' } } }
    ]);
    
    // Get pending delivery orders
    const pendingDeliveries = await Order.countDocuments({
      isPaid: true,
      isDelivered: false,
      orderItems: { $elemMatch: { itemType: 'Product' } }
    });
    
    // Get recent orders (last 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id user totalPrice isPaid isDelivered createdAt')
      .populate('user', 'name');
      
    // Payment method breakdown
    const paymentMethodStats = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$totalPrice' } } }
    ]);
    
    // Order item type stats (products vs courses)
    const itemTypeStats = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      { $group: { 
          _id: '$orderItems.itemType', 
          count: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        } 
      }
    ]);
    
    // Add these new stats
    const pendingPayments = await Order.countDocuments({ isPaid: false });
    
    const paidOrders = await Order.countDocuments({ isPaid: true });
    
    const deliveredOrders = await Order.countDocuments({
      isDelivered: true
    });
    
    // Digital orders count (only courses)
    const digitalOrders = await Order.countDocuments({
      "orderItems.itemType": "Course",
      "orderItems": { $not: { $elemMatch: { itemType: "Product" } } }
    });
    
    // Update the response to include new stats
    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].amount : 0,
      todaySales: todaySales.length > 0 ? todaySales[0].amount : 0,
      pendingDeliveries,
      pendingPayments,
      paidOrders,
      deliveredOrders,
      digitalOrders,
      recentOrders,
      paymentMethodStats,
      itemTypeStats
    });
  } catch (error) {
    console.error('Error getting order statistics:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order payment status manually (Admin only)
// @route   PUT /api/orders/admin/:id/pay
// @access  Admin
exports.updateOrderPaymentAdmin = async (req, res) => {
  try {
    const { paymentId, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (paymentStatus === true) {
      order.isPaid = true;
      order.paidAt = Date.now();
      if (!order.paymentResult) {
        order.paymentResult = {
          status: 'success',
          update_time: new Date(),
        };
      }
      if (paymentId) {
        order.paymentResult.razorpay_payment_id = paymentId;
      }
      
      // Add a note about the manual payment update
      if (!order.notes) {
        order.notes = [];
      }
      
      order.notes.push({
        user: req.user.id,
        content: `Payment status manually updated to PAID by admin`,
        createdAt: Date.now()
      });
    } else if (paymentStatus === false) {
      order.isPaid = false;
      order.paidAt = undefined;
      
      // Add a note about the payment status change
      if (!order.notes) {
        order.notes = [];
      }
      
      order.notes.push({
        user: req.user.id,
        content: `Payment status manually updated to UNPAID by admin`,
        createdAt: Date.now()
      });
    } else {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order (Admin only)
// @route   DELETE /api/orders/admin/:id
// @access  Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add these new controller methods

// @desc    Get order notes
// @route   GET /api/orders/admin/:id/notes
// @access  Admin
exports.getOrderNotes = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If notes field doesn't exist yet, return empty array
    if (!order.notes) {
      return res.json([]);
    }
    
    res.json(order.notes);
  } catch (error) {
    console.error('Error fetching order notes:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add note to order
// @route   POST /api/orders/admin/:id/notes
// @access  Admin
exports.addOrderNote = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const newNote = {
      user: req.user.id,
      content,
      createdAt: Date.now()
    };
    
    // Initialize notes array if it doesn't exist
    if (!order.notes) {
      order.notes = [];
    }
    
    order.notes.push(newNote);
    await order.save();
    
    // Return the newly added note with the admin user data
    const addedNote = order.notes[order.notes.length - 1];
    
    res.status(201).json(addedNote);
  } catch (error) {
    console.error('Error adding order note:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order note
// @route   DELETE /api/orders/admin/:id/notes/:noteId
// @access  Admin
exports.deleteOrderNote = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (!order.notes) {
      return res.status(404).json({ message: 'No notes found for this order' });
    }
    
    const noteIndex = order.notes.findIndex(note => note._id.toString() === req.params.noteId);
    
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    order.notes.splice(noteIndex, 1);
    await order.save();
    
    res.json({ message: 'Note removed successfully' });
  } catch (error) {
    console.error('Error deleting order note:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Contact customer via email
// @route   POST /api/orders/admin/:id/contact
// @access  Admin
exports.contactCustomer = async (req, res) => {
  try {
    const { subject, message, email } = req.body;
    
    if (!subject || !message || !email) {
      return res.status(400).json({ message: 'Subject, message and email are required' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Send email to customer
    await sendEmail({
      to: email,
      subject,
      text: message,
    });
    
    // Log the contact in order notes
    if (!order.notes) {
      order.notes = [];
    }
    
    order.notes.push({
      user: req.user.id,
      content: `Email sent to customer: ${subject}`,
      createdAt: Date.now()
    });
    
    await order.save();
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error contacting customer:', error);
    res.status(500).json({ message: error.message });
  }
};