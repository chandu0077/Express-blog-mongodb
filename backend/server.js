require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
var rfs = require("rotating-file-stream"); 

const cors = require("cors");
const app = express();
app.use(morgan("combined"));

var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());

const mongoose = require("mongoose");

const PORT = process.env.PORT || 30001;

const MONGO_URL = process.env.MONGO_URL;

const authRoute = require("./Routes/AuthRoutes");
const blogPostsRoute = require("./Routes/BlogPostsRoutes")
const tagRoute = require("./Routes/TagRoutes");

app.use(express.json());

app.use("/api/user", authRoute);
app.use("/api/blog-posts", blogPostsRoute);
app.use("/api/tag", tagRoute);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
