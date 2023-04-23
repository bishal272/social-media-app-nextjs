import { getServerSession } from "next-auth";
import { initMongoose } from "../../../lib/mongoose";
import User from "../../../models/User";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "GET") {
    const id = req.query.id;
    const user = await User.findById(id);

    res.json({ user });
  }
  if (req.method === "PUT") {
    const { username } = req.body;
    await User.findByIdAndUpdate(session.user.id, { username });
    res.json("ok");
  }
}
