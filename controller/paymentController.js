import Razorpay from "razorpay";
import Booking from "../model/booking.js";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_1234567890", // Replace with your actual key
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_key", // Replace with your actual secret
});

/* ================= CREATE PAYMENT ORDER ================= */
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: "Booking ID and amount are required" });
    }

    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
      },
    };

    const order = await razorpay.orders.create(options);

    // Update booking with order ID
    await Booking.findByIdAndUpdate(bookingId, {
      orderId: order.id,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_1234567890",
    });
  } catch (error) {
    console.error("PAYMENT ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;

    if (!orderId || !paymentId || !signature || !bookingId) {
      return res.status(400).json({ message: "All payment fields are required" });
    }

    // Verify signature
    const text = orderId + "|" + paymentId;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "your_secret_key")
      .update(text)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update booking with payment details
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
        paymentId: paymentId,
        status: "assigned", // Move to assigned status after payment
      },
      { new: true }
    );

    res.json({
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};



