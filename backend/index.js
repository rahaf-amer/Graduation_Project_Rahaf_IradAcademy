const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const app = express();
app.use(
cors({
origin: "http://localhost:5173", 
credentials: true,
})
);

app.use(express.json());
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));