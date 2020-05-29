const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
  async create(req, res) {
    const { content } = req.body;
    const { projectId } = req.params;

    const newComment = await Comment.create({
      content,
      project: projectId,
      author: req.user.id,
    });

    const post = await Post.findById(projectId);

    post.comments.push(newComment._id);

    await post.save();

    return res.json(newComment);
  },
  async index(req, res) {
    const { projectId } = req.params;

    const comments = await Comment.find({ project: projectId })
      .populate("author")
      .exec();

    return res.json(comments);
  },
  async update(req, res) {
    const { commentId } = req.params;
    const { content } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      content,
    });

    return res.json(updatedComment);
  },
};
