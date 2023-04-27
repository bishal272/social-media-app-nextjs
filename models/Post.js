const { Schema, model, models } = require("mongoose");
const mongoose = require("mongoose");
const PostSchema = new Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    text: String,
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    parent: { type: mongoose.Types.ObjectId, ref: "Post" },
    images: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || model("Post", PostSchema);
module.exports = Post;
