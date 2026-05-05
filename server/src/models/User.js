import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    bio: { type: String, default: "" },
    birthday: { type: String, default: "" },
    favoriteTeams: [{ type: String }],
    favoritePlayers: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
