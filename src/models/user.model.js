import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/**
 * @typedef {Object} User
 * @description Mongoose schema for application users.
 *
 * @property {string} username - Unique handle for the user; stored in lowercase, trimmed, and indexed for faster lookup.
 * @property {string} email - Unique user email; normalized to lowercase and trimmed.
 * @property {string} fullname - User's full display name; required and indexed.
 * @property {string} avatar - Required Cloudinary URL for the user's profile image.
 * @property {string} [coverImage] - Optional Cloudinary URL for the user's cover/banner image.
 * @property {import('mongoose').Types.ObjectId[]} watchHistory - Array of Video document references representing videos watched by the user.
 * @property {string} password - Required hashed password string.
 * @property {string} [refreshToken] - Optional token used to obtain new access tokens without forcing the user to log in again.
 * Stored server-side to support session continuity, token rotation, and secure logout/invalidation.
 * @property {Date} createdAt - Auto-generated timestamp for when the user document was created.
 * @property {Date} updatedAt - Auto-generated timestamp for the last update to the user document.
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * Runs before saving a user to the database.
 * If the password was changed, it turns the plain password into a hashed one
 * so the actual password is never stored directly.
 *
 * @param {function} next - Calls the next step in the save process.
 * @returns {Promise<void>}
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
}; //

export const User = mongoose.model("User", userSchema);

/**
 * doubts.
 *
 * is writing plugins this is actual way to do the production level security?
 * which apporach is better i've learnt somewhere to write middlewares but here i'm learing totally something different
 */
