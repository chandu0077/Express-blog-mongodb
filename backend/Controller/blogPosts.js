const Blogposts = require("../model/Blogposts");

const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blogposts.find({ user: req.user._id });
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
const getBlogPostsById = async (req, res) => {
  try {
    const blogPosts = await Blogposts.find({
      tag: req.params.id,
      user: req.user._id,
    });
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const createABlogPost = async (req, res) => {
  try {
    const newBlogPost = Blogposts.create({
      title: req.body.title,
      body: req.body.body,
      tag: req.body.tag,
      user: req.user._id,
    });
    if (!newBlogPost)
      throw Error("Something went wrong while saving the Post.");
    res.status(200).json(newBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteABlogPost = async (req, res) => {
  try {
    const blogPost = await Blogposts.findById(req.params.id);
    if (!blogPost) throw Error("Something went wrong while deleting the Post.");
    const deleteABlogPost = await Blogposts.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

const updateABlogPost = async (req, res) => {
  try {
    const blogPost = await Blogposts.findById(req.params.id);
    if (!blogPost) throw Error("Something went wrong while updating the Post.");
    const UpdateABlogPost = await Blogposts.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostsById,
  createABlogPost,
  deleteABlogPost,
  updateABlogPost,
};
