const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]; //"Bearer ey12312412" -> ["Bearer", "ey12312412" ] -> "ey12312412"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assign decoded payload to req.user
        req.user = decoded;
        // Call next() to invoke the next middleware function
        next();
    } catch (error) {
        // If any errors, send back a 401 status and an 'Invalid token.' error message
        res.status(401).json({ error: 'Invalid authorization token.' });
    }
}

module.exports = verifyToken;