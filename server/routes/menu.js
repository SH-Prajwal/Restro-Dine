const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const FoodItem = require("../models/FoodItem");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const items = await FoodItem.find()
      .populate("categoryId")
      .sort({ createdAt: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/items/category/:categoryId", async (req, res) => {
  try {
    const items = await FoodItem.find({ categoryId: req.params.categoryId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/category", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const category = await Category.create({ name, description, imageUrl });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/item", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl, isAvailable } =
      req.body;

    if (!name || !description || !price || !categoryId || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = await FoodItem.create({
      name,
      description,
      price,
      categoryId,
      imageUrl,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json({ message: "Food item created successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/item/:id", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl, isAvailable } =
      req.body;

    const item = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, categoryId, imageUrl, isAvailable },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ message: "Food item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/category/:id", auth, adminAuth, async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/item/:id", auth, adminAuth, async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/category/:id", auth, adminAuth, async (req, res) => {
  try {
    const itemsCount = await FoodItem.countDocuments({
      categoryId: req.params.id,
    });
    if (itemsCount > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with existing items" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
