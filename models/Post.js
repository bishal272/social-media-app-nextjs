import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    text: String,
    likeCount: { type: Number, default: 0 },
    parent: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || model("Post", PostSchema);
export default Post;
