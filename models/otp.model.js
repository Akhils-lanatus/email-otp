import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 480,
    },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", OtpSchema);
