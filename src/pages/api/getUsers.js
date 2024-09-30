import { initMongoose } from "../../../lib/mongoose";
import User from "../../../models/User";

export default async function handle(req, res) {
  await initMongoose();

  if (req.method === "GET") {
    const users = await User.find({});

    res.json({ users });
  }
}
