
const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET.replace(/^"|"$/g, '');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}



const router = express.Router();

router.post("/posts", authenticateToken, async(req, res) => {
  let { title, content, created_at, category, image, long_description } = req.body;
  try {

    if (!created_at) {
      created_at = new Date();
    }
    const user_id = req.user.id;
    const result = await pool.query(
      "INSERT INTO posts (user_id, title, content, created_at, category, image, long_description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [user_id, title, content, created_at, category, image, long_description]
    );
    const post = result.rows[0];
    res.status(201).json({
      message: "Post created successfully",
      post: post
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/posts",async(req,res)=>{
  const result = await pool.query("SELECT id, user_id, title, content, created_at, category, image, long_description FROM posts");
  res.status(200).json({posts: result.rows})
})


router.get("/posts",async(req,res)=>{
  const result = await pool.query("Select posts FROM category");
  res.status(200).json({category: result.rows})
})

router.delete("/posts/:id", async(req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.status(200).json({ 
      message: "Post deleted successfully", 
      deletedPost: result.rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/posts/:id", async(req, res) => {
  const { id } = req.params;
  const { user_id, title, content, created_at, category, image, long_description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE posts SET user_id = $1, title = $2, content = $3, created_at = $4, category = $5, image = $6, long_description = $7 WHERE id = $8 RETURNING id, user_id, title, content, created_at, category, image, long_description",
      [user_id, title, content, created_at, category, image, long_description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.status(200).json({ 
      message: "Post updated successfully", 
      updatedPost: result.rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
  "SELECT id, user_id, title, content, created_at, category, image, long_description FROM posts WHERE id = $1",
  [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
