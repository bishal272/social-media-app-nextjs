import { Schema, model } from "mongoose";
const UserSchema = Schema({
  name: String,
  email: String,
  image: String,
  username: String,
  cover: String,
  bio: String,
});

// * if a user model is already present use that one otherwise create one
const User = model("User") || model("User", UserSchema);

export default User;
