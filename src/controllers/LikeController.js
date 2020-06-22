const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  async likePost(req, res) {
    const { id } = req.params;
    const user = req.user;

    const targetPost = await Post.findById(id);
    const currentUser = await User.findById(user._id);

    if (!targetPost) {
      return res.status(400).json({ error: "Post not found" });
    }

    if (targetPost.likes.includes(user._id)) {
      return res.json({ message: "you already liked this post" });
    }

    targetPost.likes.push(user._id);
    currentUser.liked.push(id);

    await targetPost.save();
    await currentUser.save();

    return res.json(targetPost);
  },
  async likeComment(req, res) {
    const { id } = req.params;
    const user = req.user;

    const targetComment = await Comment.findById(id);

    if (!targetComment) {
      return res.status(400).json({ error: "Post not found" });
    }

    if (targetComment.likes.includes(user._id)) {
      return res.json({ message: "you already liked this post" });
    }

    targetComment.likes.push(user._id);

    await targetComment.save();

    return res.json(targetComment);
  },
  async index(req, res) {
    const { id } = req.params;
    const numLikes = await Like.find({ post: id }).countDocuments();
    return res.json(numLikes);
  },
};
