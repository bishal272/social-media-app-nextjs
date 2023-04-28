import { getServerSession } from "next-auth";
import { initMongoose } from "../../../lib/mongoose";
import Follower from "../../../models/Follower";
import Like from "../../../models/Like";
import Post from "../../../models/Post";
import { authOptions } from "./auth/[...nextauth]";
//needed to add user variable so that it can get hold of the user model before the schema is created for populate
var User = require("../../../models/User");

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id)
        .populate("author")
        .populate({ path: "parent", populate: "author" });

      res.json({ post });
    } else {
      // * uses the parent id if passed as params other wise null used in index page
      const parent = req.query.parent || null;
      const author = req.query.author;
      let searchFilter;
      if (!author && !parent) {
        const myFollows = await Follower.find({ source: session.user.id }).exec();
        const idsOfPeopleIFollow = myFollows.map((f) => f.destination);
        searchFilter = { author: [...idsOfPeopleIFollow, session.user.id] };
      }
      if (author) {
        searchFilter = { author };
      }
      if (parent) {
        searchFilter = { parent };
      }

      const posts = await Post.find(searchFilter)
        .populate("author")
        .populate({ path: "parent", populate: "author" })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();
      // * get all the posts that are liked by me from the fetched 20 posts
      const postsLikedByMe = await Like.find({
        author: session?.user?.id,
        post: posts.map((post) => post._id),
      });
      // * get all the post ids liked by me
      const idsLikedByMe = postsLikedByMe.map((like) => like.post);
      res.json({ posts, idsLikedByMe });
    }
  }
  if (req.method === "POST") {
    const { text, parent, images } = req.body;
    const post = await Post.create({
      author: session.user.id,
      text,
      parent,
      images,
    });
    if (parent) {
      const parentPost = await Post.findById(parent);
      parentPost.commentCount = await Post.countDocuments({ parent });
      await parentPost.save();
    }
    res.json(post);
  }
}
