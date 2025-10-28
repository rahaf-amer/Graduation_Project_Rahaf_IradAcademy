const express = require("express");
const pool = require("../db");
const {Pool} = require("pg");
const router = express.Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;


router.post("/register", async(req, res) => {
  const { full_name, email, password, role } = req.body;
  try {
   
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    
    
    const password_hash = await bcrypt.hash(password, 10);
    
    
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, full_name, email, role",
      [full_name, email, password_hash, role]
    );
    const user = result.rows[0];
    console.log("New user created:", user);
    
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
      expiresIn: "1d",
    });

    res.status(201).json({ 
      message: "User registered successfully",
      user, 
      token 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    
   
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      },
      role: user.role,
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;