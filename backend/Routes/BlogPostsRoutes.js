const express = require("express");
const verify = require("../middleware/privateRoute");
const router = express.Router();

const {
  getBlogPosts,
  getBlogPostsById,
  createABlogPost,
  updateABlogPost,
  deleteABlogPost,
} = require("../Controller/blogPosts");

router.get("/", verify, getBlogPosts);

router.get("/tag/:id", verify, getBlogPostsById);

router.post("/", verify, createABlogPost);

router.delete("/:id", verify, deleteABlogPost);

router.patch("/:id", verify, updateABlogPost);

module.exports = router;
