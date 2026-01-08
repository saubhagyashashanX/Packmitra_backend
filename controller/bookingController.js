import Booking from "../model/booking.js";
import Partner from "../model/Partner.js";


export const createBooking = async (req, res) => {
  console.log("BOOKING BODY:", req.body);

  try {
    const {
      customerName,
      customerPhone,
      pickupCity,
      dropCity,
      partnerId,
      distanceKm,
      weightKg,
      speed,
      vehicleType,
    } = req.body;

    const numericDistance = Number(distanceKm) || 0;
    const numericWeight = Number(weightKg) || 0;

   
    let finalPrice = null;
    if (partnerId) {
      const partner = await Partner.findById(partnerId).lean();
      const base = partner?.basePrice ?? 50; // fallback base

      let price =
        base + numericDistance * 10 + numericWeight * 2; // 

      if (speed === "express") {
        price *= 1.3;
      }

      finalPrice = Math.round(price);
    }

    const booking = await Booking.create({
      customerName,
      customerPhone,
      pickupCity,
      dropCity,
      assignedPartner: partnerId || null,
      status: "pending", 
      distanceKm: numericDistance,
      weightKg: numericWeight,
      speed: speed || "standard",
      vehicleType: vehicleType || null,
      price: finalPrice,
      paymentStatus: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};


export const getBookingOptions = async (req, res) => {
  try {
    const { distanceKm, weightKg, speed } = req.body;

    const numericDistance = Number(distanceKm) || 0;
    const numericWeight = Number(weightKg) || 0;

    const partners = await Partner.find({ status: "approved" });

    const options = partners.map((p) => {
      const base = p.basePrice ?? 50;

      let price =
        base + numericDistance * 10 + numericWeight * 2; // distance + weight

      if (speed === "express") {
        price *= 1.3;
      }

      return {
        _id: p._id,
        companyName: p.companyName,
        price: Math.round(price),
        rating: p.rating ?? 0,
        totalRatings: p.totalRatings ?? 0,
      };
    });

   
    options.sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price;
      return (b.rating || 0) - (a.rating || 0);
    });

    res.json({ options });
  } catch (err) {
    console.error("BOOKING OPTIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch partner options" });
  }
};




export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/* ================= CUSTOMER TRACKING ================= */
// Simple tracking by customer phone (shows all their bookings)
export const getBookingsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const bookings = await Booking.find({ customerPhone: phone })
      .sort({ createdAt: -1 })
      .populate("assignedPartner", "companyName");

    res.json(bookings);
  } catch (err) {
    console.error("GET BY PHONE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/* ================= ASSIGN BOOKING ================= */
export const assignBooking = async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: "Partner ID required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "assigned",        // ✅ correct spelling
        assignedPartner: partnerId
      },
      { new: true }
    );

    res.json({ message: "Booking assigned", booking });
  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    res.status(500).json({ message: "Failed to assign booking" });
  }
};
// Partner starts job
export const startBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "in-progress" },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to start booking" });
  }
};

// Partner completes job
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete booking" });
  }
};

/* ================= PARTNER BOOKINGS ================= */
// Get bookings for a specific partner
export const getPartnerBookings = async (req, res) => {
  try {
    const partnerId = req.partnerId; // From auth middleware

    if (!partnerId) {
      return res.status(401).json({ message: "Partner authentication required" });
    }

    const bookings = await Booking.find({ assignedPartner: partnerId })
      .sort({ createdAt: -1 })
      .populate("assignedPartner", "companyName");

    res.json(bookings);
  } catch (err) {
    console.error("GET PARTNER BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch partner bookings" });
  }
};
