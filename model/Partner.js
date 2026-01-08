import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    companyName: String,
    ownerName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,

    services: [String],
    cities: [String],
    basePrice: Number, // e.g. price per km or per move

    // Simple rating model so customers can compare partners
    rating: {
      type: Number,
      default: 4.5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
