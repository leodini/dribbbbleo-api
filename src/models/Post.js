const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const PostSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: {
      type: String,
      required: true,
    },
    category: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

PostSchema.plugin(deepPopulate);

module.exports = mongoose.model("Post", PostSchema);
