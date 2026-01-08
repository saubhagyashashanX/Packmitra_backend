import express from "express";
import { createPaymentOrder, verifyPayment } from "../controller/paymentController.js";

const router = express.Router();

// Create payment order
router.post("/order", createPaymentOrder);

// Verify payment
router.post("/verify", verifyPayment);

export default router;



