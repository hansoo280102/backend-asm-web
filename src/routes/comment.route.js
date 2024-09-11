const express = require("express");
const Comment = require("../models/comment.model");

const router = express.Router();

//create a comment
router.post("/post-comment", async (req, res) => {
  try {
    console.log(req.body);
    const newComment = new Comment(req.body);
    await newComment.save();
    res
      .status(200)
      .send({ message: " Comment created successfully", comment: newComment });
  } catch (error) {
    console.log("Error creating comment", error);
    res.status(500).send({ message: "Error creating comment" });
  }
});

//get all comments count
router.get("/total-comments", async (req, res) => {
  try {
    const totalComment = await Comment.countDocuments({});
    res.status(200).send({ message: "Total comments count", totalComment });
  } catch (error) {
    console.log("Error get all comments", error);
    res.status(500).send({ message: "Error get all comments" });
  }
});
module.exports = router;
