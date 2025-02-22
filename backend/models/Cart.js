// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: { type: Number, required: true, default: 1 },
//         price: { type: Number, required: true },
//       },
//     ],
//     totalPrice: { type: Number, required: true, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cart", cartSchema);



// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [
//       {
//         itemType: { type: String, enum: ["Product", "Course"], required: true }, // New Field
//         product: { type: mongoose.Schema.Types.ObjectId, refPath: "items.itemType", required: true },
//         quantity: { type: Number, required: true, default: 1 },
//         price: { type: Number, required: true },
//       },
//     ],
//     totalPrice: { type: Number, required: true, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cart", cartSchema);


const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      itemType: {
        type: String, // Stores "Product" or "Course"
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
