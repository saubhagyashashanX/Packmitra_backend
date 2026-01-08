import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    customerPhone: String,
    pickupCity: String,
    dropCity: String,

    // Job details used for pricing / matching
    distanceKm: Number,
    weightKg: Number,
    speed: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    vehicleType: String,
    price: Number,

    status: {
      type: String,
      default: "pending",
    },

    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
    },

    // Payment fields
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: String, // Razorpay payment ID
    orderId: String, // Razorpay order ID
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

