import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('role');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    if (!req.user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // SUPER ADMIN bypasses all permission checks
    if (req.user.email === 'ssaiprasanth333@gmail.com' || (req.user.role && req.user.role.name === 'SUPER ADMIN')) {
      return next();
    }
    
    const hasPermission = req.user.permissions && req.user.permissions.includes(requiredPermission);
    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
    }
    
    next();
  };
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.email === 'ssaiprasanth333@gmail.com' || (req.user.role && req.user.role.name === 'SUPER ADMIN'))) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
