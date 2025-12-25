const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.route");
const baseUrl = "/api/v1";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(`${baseUrl}`, authRoutes);
app.use(`${baseUrl}`, postRoutes);

module.exports = app;
