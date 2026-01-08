import Partner from "../model/Partner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerPartner = async (req, res) => {
  try {
    const {
      companyName,
      ownerName,
      email,
      phone,
      password,
      basePrice,
    } = req.body;

    if (!companyName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await Partner.create({
      companyName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      basePrice: basePrice || undefined,
      status: "pending",
    });

    res.status(201).json({
      message: "Registration successful. Await admin approval.",
      partner,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ================= LOGIN =================
export const loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    if (partner.status === "pending") {
      return res.status(403).json({
        message: "Your account is under review. Please wait for admin approval.",
      });
    }

    if (partner.status === "rejected") {
      return res.status(403).json({
        message: "Your account has been rejected. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: partner._id, role: "partner" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      partner,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ================= PUBLIC / CUSTOMER =================
// Partners that customers can choose from while booking
export const getAvailablePartners = async (req, res) => {
  try {
    const partners = await Partner.find({ status: "approved" })
      .sort({ basePrice: 1 })
      .select("companyName basePrice rating totalRatings cities services");

    res.json(partners);
  } catch (error) {
    console.error("AVAILABLE PARTNERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch available partners" });
  }
};

// ================= ADMIN =================
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch partners" });
  }
};

export const approvePartner = async (req, res) => {
  try {
    await Partner.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Partner approved" });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};

export const rejectPartner = async (req, res) => {
  try {
    await Partner.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Partner rejected" });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed" });
  }
};