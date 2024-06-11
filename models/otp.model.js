import mongoose, { Schema } from "mongoose";
const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      expires: "30s",
      default: Date.now,
    },
  },
  { timestamps: true }
);
export const Otp = mongoose.model("Otp", OtpSchema);