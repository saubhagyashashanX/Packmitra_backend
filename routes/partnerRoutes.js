import express from "express";
import {
  registerPartner,
  loginPartner,
  getAllPartners,
  approvePartner,
  rejectPartner,
  getAvailablePartners,
} from "../controller/partnerController.js";

const router = express.Router();

// REGISTER & LOGIN
router.post("/register", registerPartner);
router.post("/login", loginPartner);

// Customer-facing list of approved partners
router.get("/available", getAvailablePartners);

// Admin: list all partners
router.get("/", getAllPartners);

// ADMIN ACTIONS
router.put("/approve/:id", approvePartner);
router.put("/reject/:id", rejectPartner);

export default router;



