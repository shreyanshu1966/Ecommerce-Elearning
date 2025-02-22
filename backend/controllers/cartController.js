const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Course = require("../models/Course");

// Get User Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product")
      .populate("items.course"); // ✅ Fixed: Populating courses as well

    res.json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
  const { itemId, itemType, quantity } = req.body;

  try {
    let item;
    if (itemType === "Product") {
      item = await Product.findById(itemId);
    } else if (itemType === "Course") {
      item = await Course.findById(itemId);
    } else {
      return res.status(400).json({ message: "Invalid item type" });
    }

    if (!item) return res.status(404).json({ message: `${itemType} not found` });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });

    const itemIndex = cart.items.findIndex((i) =>
      (i.product && i.product.toString() === itemId) ||
      (i.course && i.course.toString() === itemId) // ✅ Fixed: Checking for both product & course
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        itemType,
        product: itemType === "Product" ? itemId : null, // ✅ Fixed: Assign correctly
        course: itemType === "Course" ? itemId : null, // ✅ Fixed: Assign correctly
        quantity,
        price: item.price,
      });
    }

    cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    // await cart.save();
    // res.json(cart);
    await cart.save();
const populatedCart = await Cart.findById(cart._id)
  .populate("items.product")
  .populate("items.course");

res.json(populatedCart);

  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        item.product?.toString() !== req.params.id &&
        item.course?.toString() !== req.params.id // ✅ Fixed: Checking both product & course
    );

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // await cart.save();
    // res.json(cart);

    await cart.save();
const populatedCart = await Cart.findById(cart._id)
  .populate("items.product")
  .populate("items.course");

res.json(populatedCart);

  } catch (error) {
    console.error("Error removing item from cart:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    console.log("Requested ID:", req.params.id);
    console.log("Stored Cart:", cart);

    // Find the item inside the cart
    const item = cart.items.find(
      (i) =>
        (i.product?.toString() === req.params.id) || // ✅ Fixed: Checking product correctly
        (i.course?.toString() === req.params.id) || // ✅ Fixed: Checking course correctly
        i._id.toString() === req.params.id // Also allow updating by cart item ID
    );

    if (!item) {
      console.log("❌ Item not found for ID:", req.params.id);
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity
    item.quantity = req.body.quantity;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await cart.save();
const populatedCart = await Cart.findById(cart._id)
  .populate("items.product")
  .populate("items.course");

res.json(populatedCart);

  } catch (error) {
    console.error("Error updating cart item:", error.message);
    res.status(500).json({ message: error.message });
  }
};
