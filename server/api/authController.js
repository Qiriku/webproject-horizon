const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
    /**
     * @swagger
     * /login:
     *   post:
     *     summary: User login
     *     description: Verifies credentials and issues a JWT cookie.
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    login: (req, res) => {
        const { email, password } = req.body;

        try {
            const usersPath = path.join(__dirname, '..', 'staticFiles', 'users.json');
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return sendResponse(req, res, 401, { error: 'Invalid email or password.' });
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
            sendResponse(req, res, 200, {
                message: 'Login successful',
                user: {
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Auth error:', error);
            sendResponse(req, res, 500, { error: 'Internal server error.' });
        }
    },

    /**
     * Middleware to verify JWT
     */
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return sendResponse(req, res, 401, { error: 'Authentication required.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return sendResponse(req, res, 401, { error: 'Invalid or expired token.' });
        }
    },

    /**
     * @swagger
     * /logout:
     *   post:
     *     summary: User logout
     *     description: Clears the JWT cookie.
     *     tags: [Authentication]
     *     responses:
     *       200:
     *         description: Logged out successfully
     */
    logout: (req, res) => {
        res.clearCookie('token');
        sendResponse(req, res, 200, { message: 'Logged out successfully.' });
    }
};

module.exports = authController;
