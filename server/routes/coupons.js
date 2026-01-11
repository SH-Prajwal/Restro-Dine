const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true }).sort({
      minOrderAmount: 1,
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/all", auth, adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error("[Get All Coupons] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/create", auth, adminAuth, async (req, res) => {
  try {
    const { code, discountPercent, minOrderAmount, description } = req.body;

    console.log("[Create Coupon] Request:", {
      code,
      discountPercent,
      minOrderAmount,
    });

    if (!code || !discountPercent || !minOrderAmount) {
      return res.status(400).json({
        message:
          "Code, discount percent, and minimum order amount are required",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercent,
      minOrderAmount,
      description:
        description ||
        `${discountPercent}% off on orders above ₹${minOrderAmount}`,
      isActive: true,
    });

    console.log("[Create Coupon] Created successfully:", coupon._id);
    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("[Create Coupon] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[Delete Coupon] Request for ID:", id);

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    console.log("[Delete Coupon] Deleted successfully:", id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("[Delete Coupon] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/toggle", auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    console.log(
      "[Toggle Coupon] Status updated:",
      id,
      "isActive:",
      coupon.isActive
    );
    res.json({
      message: `Coupon ${
        coupon.isActive ? "activated" : "deactivated"
      } successfully`,
      coupon,
    });
  } catch (error) {
    console.error("[Toggle Coupon] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/apply", auth, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res
        .status(400)
        .json({ message: "Coupon code and order amount are required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
        minOrderAmount: coupon.minOrderAmount,
      });
    }

    const discountAmount = (orderAmount * coupon.discountPercent) / 100;
    const finalAmount = orderAmount - discountAmount;

    res.json({
      message: "Coupon applied successfully!",
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        description: coupon.description,
      },
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
