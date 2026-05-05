import mongoose from "mongoose";

const postFavoriteSchema = new mongoose.Schema(
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

postFavoriteSchema.index({ userId: 1, postId: 1 }, { unique: true });

const PostFavorite = mongoose.model("PostFavorite", postFavoriteSchema);

export default PostFavorite;
