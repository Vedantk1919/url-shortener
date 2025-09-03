const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); 
    
    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token structure' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;