import mongoose from "mongoose";

const repostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

repostSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Repost = mongoose.model("Repost", repostSchema);

export default Repost;
