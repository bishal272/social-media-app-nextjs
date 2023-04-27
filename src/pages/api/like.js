import { getServerSession } from "next-auth";
import { initMongoose } from "../../../lib/mongoose";
import Like from "../../../public/models/Like";
import Post from "../../../public/models/Post";
import { authOptions } from "./auth/[...nextauth]";

async function updateLikesCount(postId) {
  const post = await Post.findById(postId);
  post.likeCount = await Like.countDocuments({ post: postId });
  await post.save();
}
export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  const postId = req.body.id;
  const userId = session.user.id;
  const existingLike = await Like.findOne({ author: userId, post: postId });

  if (existingLike) {
    try {
      await existingLike.deleteOne();
      await updateLikesCount(postId);
      res.json(null);
    } catch (e) {
      console.error(e);
    }
  } else {
    const like = await Like.create({ author: userId, post: postId });
    await updateLikesCount(postId);
    res.json({ like });
  }
}
