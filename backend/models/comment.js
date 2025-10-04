import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentions: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        offset: {
          type: Number,
        },
        lenght: {
          type: Number,
        },
      },
    ],
    reactions: [
      {
        emoji: {
          type: String,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    attachments: [
      {
        fileName: {
          type: String,
        },
        fileUrl: {
          type: String,
        },
        fileType: {
          type: String,
        },
        fileSize: {
          type: Number,
        },
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Comment = model("Comment", commentSchema);

export default Comment;
