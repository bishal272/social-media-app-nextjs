import { getServerSession } from "next-auth";
import { initMongoose } from "../../../lib/mongoose";
import User from "../../../public/models/User";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);

  const { trimmedBio: bio, trimmedName: name, trimmedUsername: username } = req.body;
  await User.findByIdAndUpdate(session.user.id, { bio, name, username });
  res.json("ok");
}
