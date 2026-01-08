import express from "express";
import {
  createBooking,
  getAllBookings,
  assignBooking,
  startBooking,
  completeBooking,
  getBookingOptions,
  getBookingsByPhone,
  getPartnerBookings,
} from "../controller/bookingController.js";
import { authenticatePartner } from "../middleware/auth.js";

const router = express.Router();

/* Create booking (customer) */
router.post("/", createBooking);

/* Get partner options for a given job */
router.post("/options", getBookingOptions);

/* Customer tracking by phone */
router.get("/by-phone/:phone", getBookingsByPhone);

/* Get all bookings (admin) */
router.get("/", getAllBookings);

/* Assign booking to partner (admin) */
router.put("/assign/:id", assignBooking);

router.put("/start/:id", authenticatePartner, startBooking);
router.put("/complete/:id", authenticatePartner, completeBooking);

/* Get bookings for logged-in partner */
router.get("/partner", authenticatePartner, getPartnerBookings);

export default router;

