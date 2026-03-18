const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        // Expected token format: "Bearer <token>"
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

        const verified = jwt.verify(tokenString, JWT_SECRET);
        req.user = verified; // Add user data (id, role) to the request object
        next(); // Move to the next middleware or route controller
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            next();
        } else {
            res.status(403).json({ message: 'Access Denied: Requires Admin/Staff privileges' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
