const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/aurh.routes");
// const postRoutes = require("./routes/post.routes");
const baseUrl = "/api/v1";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(`${baseUrl}`, authRoutes);
// app.use("/posts", postRoutes);

module.exports = app;
