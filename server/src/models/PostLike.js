import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema(
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

postLikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const PostLike = mongoose.model("PostLike", postLikeSchema);

export default PostLike;
