const express = require("express");
const router = express.Router();
const config = require("config");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
// @route  POST/posts
// @desc   create posts
// @access private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //   console.log(req);pubpublicpubliclicpublic
      const user = await User.findById(req.user.id).select("-password");
      console.log(user);
      const newPost = new Post({
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  GET/posts
// @desc   Get all the posts
// @access private

router.get("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  GET/posts/:id
// @desc   Get post by id
// @access private

router.get("/:id", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post); // @route  DELETE/posts/:id
    // @desc   Delete post
    // @access private
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route  DELETE/posts/:id
// @desc   Delete post
// @access private

router.delete("/:id", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route  PUT/posts/like/:id
// @desc   like post
// @access private

router.put("/like/:id", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findById(req.params.id);
    //check if post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      res.status(400).json({ msg: "post already liked." });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  PUT/posts/unlike/:id
// @desc   unlike post
// @access private

router.put("/unlike/:id", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findById(req.params.id);
    //check if post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "post has not yet been liked." });
    }
    const removeIndex = post.likes
      .filter(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST/posts/comment/:id
// @desc   comment on post
// @access private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //   console.log(req);pubpublicpubliclicpublic
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      console.log(user);
      const newComment = {
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  DELETE/posts/comment/:id/:comment_id
// @desc   delete comment on post
// @access private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist." });
    }

    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status("401").json({ msg: "User not authorized" });
    }
    const removeIndex = post.comments
      .filter(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
