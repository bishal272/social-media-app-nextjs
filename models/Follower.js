import mongoose, { Schema, model } from "mongoose";
const FollowerSchema = new Schema({
  source: { type: mongoose.Types.ObjectId, required: true },
  destination: { type: mongoose.Types.ObjectId, required: true },
});

const Follower = model("Follower") || model("Follower", FollowerSchema);

export default Follower;
