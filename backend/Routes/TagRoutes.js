const express = require("express");
const verify = require("../middleware/privateRoute");
const router = express.Router();

const { createATag, getTagsList } = require("../Controller/tag");

router.get("/", verify, getTagsList);

router.post("/", verify, createATag);

module.exports = router;
