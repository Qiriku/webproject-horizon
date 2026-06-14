const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const newsController = require('../api/newsController');
const authController = require('../api/authController');
const mailController = require('../api/mailController');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies

// Serve static files from the website directory
app.use(express.static(path.join(__dirname, '../../website')));

// API Routes
app.get('/getNews', newsController.getNews);
app.get('/api/get-mail', authController.verifyToken, mailController.getMails);
app.post('/api/send-mail', authController.verifyToken, mailController.sendMail);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

// Protected Route: Portal (Example of middleware usage)
app.get('/api/portal-check', authController.verifyToken, (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
});

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
