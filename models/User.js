import { Schema, model, models } from "mongoose";
const UserSchema = Schema({
  name: String,
  email: String,
  image: String,
  username: String,
  cover: String,
  bio: String,
});

// * if a user model is already present use that one otherwise create one
const User = models?.User || model("User", UserSchema);

export default User;
