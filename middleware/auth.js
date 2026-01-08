import jwt from "jsonwebtoken";

// Middleware to verify partner JWT token
export const authenticatePartner = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Attach partner ID to request
    req.partnerId = decoded.id;
    req.role = decoded.role;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
