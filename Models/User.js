import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  cdsid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
