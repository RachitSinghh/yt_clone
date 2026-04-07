/**
 * Enables pagination for aggregation queries on this schema.
 *
 * In simple terms: this line adds extra helper methods so you can
 * fetch aggregation results page by page (for example, 10 items at a time)
 * instead of loading everything at once.
 *
 * This helps keep responses faster and more memory-friendly when data grows.
 */

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);
