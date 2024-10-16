const Tags = require("../model/Tags");

const getTagsList = async (req, res) => {
  try {
    const todos = await Tags.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const createATag = async (req, res) => {
  try {
    const tagData = await Tags.find({ name: req.body.name });
    if (tagData.length) {
      throw new Error("Tag already exists!!!");
    }
    const newTag = Tags.create({ name: req.body.name });
    res.status(200).json(newTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTagsList,
  createATag,
};
