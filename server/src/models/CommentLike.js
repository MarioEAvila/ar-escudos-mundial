import mongoose from "mongoose";

const commentLikeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

commentLikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

const CommentLike = mongoose.model("CommentLike", commentLikeSchema);

export default CommentLike;
