const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = 'horizon_secret_2204_continuance'; // In production, this would be in .env

const authController = {
    /**
     * POST /login
     * Verifies credentials and issues a JWT cookie.
     */
    login: (req, res) => {
        const { email, password } = req.body;

        try {
            const usersPath = path.join(__dirname, '..', 'staticFiles', 'users.json');
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            // Generate JWT
            const token = jwt.sign(
                { email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Set JWT in an HTTP-only cookie for security
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Set to true in production (HTTPS)
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            // Return user profile for localStorage
            res.status(200).json({
                message: 'Login successful',
                user: {
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Auth error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    /**
     * Middleware to verify JWT
     */
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }
    },

    /**
     * POST /logout
     * Clears the JWT cookie.
     */
    logout: (req, res) => {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully.' });
    }
};

module.exports = authController;
