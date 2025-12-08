const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("./userModel");


let pendingOtps = {}; 

router.post("/register", async (req, res) => {
  console.log("REGISTER BODY:", req.body);

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = User.getUserByEmail(email);
  if (existing)
    return res.status(400).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = User.addUser({
    email,
    role: role || "user",
    passwordHash,
  });

  res.json({
    message: "Registered",
    user: { email: newUser.email, role: newUser.role },
  });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = User.getUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

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

  res.json({ message: "OTP sent to email" });
});


router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const record = pendingOtps[email];
  if (!record) return res.status(400).json({ error: "No OTP request" });

  if (record.expiresAt < Date.now())
    return res.status(400).json({ error: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  const user = User.getUserByEmail(email);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  delete pendingOtps[email];

  res.json({ token });
});


module.exports = router;
