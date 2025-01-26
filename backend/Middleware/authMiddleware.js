// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};




// Middleware to update SLA breach date      ticket controller  part   
export const updateSLABreach = async (ticket) => {
  const standardSLADays = 3; // Adjust based on your business rules
  const slaBreachDate = new Date(ticket.createdAt);
  slaBreachDate.setDate(slaBreachDate.getDate() + standardSLADays);
  
  ticket.slaBreachDate = slaBreachDate;
  await ticket.save();
};