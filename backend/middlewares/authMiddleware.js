const jwt = require('jsonwebtoken');

exports.protect = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    if (role && decoded.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    req.user = decoded;
    next();
  });
};
