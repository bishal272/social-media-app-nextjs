import { getServerSession } from "next-auth";
import { initMongoose } from "../../../lib/mongoose";
import Follower from "../../../models/Follower";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  const { destination } = req.body;
  const existingFollow = await Follower.findOne({ destination, source: session.user.id });
  if (existingFollow) {
    await existingFollow.deleteOne();
    res.json(null);
  } else {
    const follow = await Follower.create({ source: session.user.id, destination });
    res.json(follow);
  }
}
