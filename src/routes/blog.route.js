const express = require("express");
const Blog = require("../models/blog.models");
const Comment = require("../models/comment.model");
const router = express.Router();

//create a blog post
router.post("/create-post", async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body });
    await newPost.save();
    res.status(201).send({
      message: "Blog post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post: ", error);
    res.status(500).json({ message: "Error creating post" });
  }
});
// get all blogs
router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;
    console.log(search);

    let query = {};
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (category) {
      query = {
        ...query,
        category,
      };
    }
    if (location) {
      query = {
        ...query,
        location,
      };
    }
    const post = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).send({
      message: "Get all blogs successfully",
      posts: post,
    });
  } catch (error) {
    console.error("Error getting post: ", error);
    res.status(500).json({ message: "Error getting post" });
  }
});

// get a single blog by id
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    const comment = await Comment.find({ postId: postId }).populate(
      "user",
      "username email"
    );
    res.status(200).send({
      message: "Get single blog successfully",
      post: post,
    });
  } catch (error) {
    console.error("Error getting single post: ", error);
    res.status(500).json({ message: "Error getting single post" });
  }
});

//update a blog post
router.patch("/update-post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Blog.findByIdAndUpdate(
      postId,
      {
        ...req.body,
      },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.status(200).send({
      message: "Update blog post successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post: ", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Blog.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    // delete all comments associated with the post
    await Comment.deleteMany({ postId: postId });

    res.status(200).send({
      message: "Delete blog post successfully",
      post: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

// get related blog posts by title
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: " Post's id is required" });
    }
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).send({ message: "Post not found" });
    }

    const titleRegex = new RegExp(blog.title.split("").join("|"), "i");
    const relatedQuery = {
      _id: { $ne: id },
      title: { $regex: titleRegex },
    };
    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send({
      message: "Get related posts successfully",
      posts: relatedPost,
    });
  } catch (error) {
    console.error("Error related post: ", error);
    res.status(500).json({ message: "Error related post" });
  }
});
module.exports = router;
