import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import partnerRoutes from "./routes/partnerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/partners", partnerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error(" MONGO_URI is not defined in .env file!");
      console.error("Please add MONGO_URI=mongodb://localhost:27017/logisticsagg to your .env file");
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
    console.error("Please check:");
    console.error("1. MongoDB is running on your system");
    console.error("2. MONGO_URI in .env file is correct");
    console.error("3. Network connection is available");
    process.exit(1);
  }
};

connectDB();

const PORT = 5000;

// Start server only after MongoDB connection
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
  console.log(`📡 API endpoints available at http://127.0.0.1:${PORT}/api`);
});



