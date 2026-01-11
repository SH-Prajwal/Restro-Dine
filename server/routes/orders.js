const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.post("/create", auth, async (req, res) => {
  try {
    const { items, subtotal, gst, vat, discount, couponCode, totalAmount } =
      req.body;

    console.log("[Create Order] Request received for user:", req.userId);
    console.log("[Create Order] Order data:", {
      items: items?.length,
      subtotal,
      gst,
      vat,
      discount,
      couponCode,
      totalAmount,
    });

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    const order = await Order.create({
      userId: req.userId,
      items,
      subtotal,
      gst: gst || 0,
      vat: vat || 0,
      discount: discount || 0,
      couponCode: couponCode || null,
      totalAmount,
      status: "confirmed",
    });

    console.log("[Create Order] Order created successfully:", order._id);
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("[Create Order] Error:", error);
    console.error("[Create Order] Stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ orderDate: -1 })
      .populate("items.foodItemId");

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .populate("userId", "email mobile")
      .populate("items.foodItemId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
