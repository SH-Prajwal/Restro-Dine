const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({
        message: "Please provide email or mobile number and password",
      });
    }

    let existingUser;
    if (email) {
      existingUser = await User.findOne({ email });
    } else if (mobile) {
      existingUser = await User.findOne({ mobile });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      password: hashedPassword,
      role: "customer",
    };

    if (email) userData.email = email;
    if (mobile) userData.mobile = mobile;

    const user = await User.create(userData);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({
        message: "Please provide email or mobile number and password",
      });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (mobile) {
      user = await User.findOne({ mobile });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/update-profile", auth, async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const userId = req.user.userId;

    console.log("[Update Profile] Request received for userId:", userId);
    console.log("[Update Profile] Update data:", { name, email, mobile });

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;

    console.log("[Update Profile] Processed updateData:", updateData);

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        console.log("[Update Profile] Email already in use:", email);
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (mobile) {
      const existingUser = await User.findOne({ mobile, _id: { $ne: userId } });
      if (existingUser) {
        console.log("[Update Profile] Mobile already in use:", mobile);
        return res
          .status(400)
          .json({ message: "Mobile number already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      console.log("[Update Profile] User not found after update:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("[Update Profile] Profile updated successfully");
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Update Profile] Error:", error);
    console.error("[Update Profile] Stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    console.log("[Change Password] Request received for userId:", userId);

    if (!currentPassword || !newPassword) {
      console.log("[Change Password] Missing fields");
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      console.log("[Change Password] Password too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("[Change Password] User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("[Change Password] User found, checking password");

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      console.log("[Change Password] Current password incorrect");
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    console.log("[Change Password] Password verified, hashing new password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    console.log("[Change Password] Password updated successfully");
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("[Change Password] Error:", error);
    console.error("[Change Password] Stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
