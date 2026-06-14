const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');

const newsController = require('../api/newsController');
const archiveController = require('../api/archiveController');
const authController = require('../api/authController');
const userController = require('../api/userController');
const { sendResponse } = require('../api/responseFormatter');
const mailController = require('../api/mailController');
const ipstackController = require('../api/ipstackController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies

// Serve static files from the website directory
app.use(express.static(path.join(__dirname, '../../website')));

// API Routes
app.get('/getNews', newsController.getNews);

// These three routes fix the GET/POST/PUT/DELETE requirement.
app.post('/api/news', authController.verifyToken, newsController.createNews);
app.put('/api/news/:id', authController.verifyToken, newsController.updateNews);
app.delete('/api/news/:id', authController.verifyToken, newsController.deleteNews);

app.get('/getArchive', archiveController.getArchivePosts);
app.get('/api/get-mail', authController.verifyToken, mailController.getMails);
app.post('/api/send-mail', authController.verifyToken, mailController.sendMail);
app.post('/login', authController.login);
app.post('/logout', authController.logout);
app.patch('/api/users/last-access', authController.verifyToken, userController.updateLastAccess);

// External REST API route.
// Keeps the old endpoint name, but now uses IPify without a key.
app.get('/api/ipstack-data', authController.verifyToken, ipstackController.getIpData);

// Protected Route: Portal (Example of middleware usage)
app.get('/api/portal-check', authController.verifyToken, (req, res) => {
  sendResponse(req, res, 200, { authenticated: true, user: req.user });
app.get('/getArchive', archiveController.getArchivePosts);
app.get('/api/get-mail', authController.verifyToken, mailController.getMails);
app.post('/api/send-mail', authController.verifyToken, mailController.sendMail);
app.get('/api/mail-provider', authController.verifyToken, mailController.getProvider);
app.post('/api/set-provider', authController.verifyToken, mailController.setProvider);
app.post('/login', authController.login);
app.post('/logout', authController.logout);
app.patch('/api/users/last-access', authController.verifyToken, userController.updateLastAccess);

// Protected Route: Portal (Example of middleware usage)
app.get('/api/portal-check', authController.verifyToken, (req, res) => {
    sendResponse(req, res, 200, { authenticated: true, user: req.user });
});

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../website/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});