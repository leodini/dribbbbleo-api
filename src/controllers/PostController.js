const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  async store(req, res) {
    const { title, description, category } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ error: "user does not exist" });
    }

    const categoryArray = category
      .split(",")
      .map((category) => category.trim());

    const newPost = await Post.create({
      image: req.file.filename,
      title,
      description,
      category: categoryArray,
      author: req.user.id,
    });

    user.posts.push(newPost._id);

    await user.save();

    return res.json(newPost);
  },
  async index(req, res) {
    const { order_by } = req.query;

    if (order_by === "new") {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("author comments")
        .exec();
      return res.json(posts);
    }
    const posts = await Post.find()
      .sort({ likes: "desc" })
      .populate("author comments")
      .exec();
    return res.json(posts);
  },
  async uniquePost(req, res) {
    const { projectId } = req.params;
    const post = await Post.findById(projectId)
      .deepPopulate("author comments.author")
      .exec();

    return res.json(post);
  },
  async remove(req, res) {
    const { id } = req.params;
    const { id: userId } = req.user;

    const user = await User.findById(userId);
    const post = await Post.findById(id);

    if (user.posts.includes(post.id)) {
      await Post.findByIdAndDelete(post);
      return res.send({ message: "post removed" });
    }

    return res.json({ message: "user not found" });
  },
  async searchPost(req, res) {
    const { search } = req.query;
    console.log(search);
    const regex = new RegExp(search, "i"); // 'i' makes it case insensitive
    return Post.find({ category: regex }, function (err, query) {
      return res.json(query);
    })
      .populate("author")
      .exec();
  },
};
