import User from "../../../models/User";

export default async function handle(req, res) {
  const { searchItem } = req.query;

  if (searchItem.charAt(0) === "@") {
    const search = searchItem.replace("@", "");
    const users = await User.find({ username: search });
    res.json(users);
  } else {
    const users = await User.find({ name: searchItem });
    res.json(users);
  }
}
