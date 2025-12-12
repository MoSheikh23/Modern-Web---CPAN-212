const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("./userModel");

let pendingOtps = {};

router.post("/register", async (req, res) => {
  console.log("REGISTER HIT:", req.body);
  const { email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    passwordHash,
    role: role || "user",
  });

  res.json({
    message: "Registered",
    user: { email: newUser.email, role: newUser.role },
  });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res.status(400).json({ error: "Invalid credentials" });


  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  pendingOtps[email] = { otp, expiresAt };

 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  });

  res.json({ message: "OTP sent" });
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = pendingOtps[email];
  if (!record)
    return res.status(400).json({ error: "No OTP request found" });

  if (record.expiresAt < Date.now())
    return res.status(400).json({ error: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  const user = await User.findOne({ email });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  delete pendingOtps[email];

  res.json({ token });
});

module.exports = router;
