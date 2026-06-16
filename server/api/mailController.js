const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { sendResponse } = require('./responseFormatter');

const MAILS_FILE = path.join(__dirname, '../staticFiles/mails.json');
const TRIGGER_PHRASE = process.env.ARG_TRIGGER;

// Current Provider State (Defaults to .env value)
let currentProvider = process.env.MAIL_PROVIDER || 'resend';

// Initialize Resend Client
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Nodemailer Transporter
const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * @swagger
 * /api/get-mail:
 *   get:
 *     summary: Fetch emails for a specific user
 *     tags: [Mail]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of emails
 *       400:
 *         description: Username missing
 *       500:
 *         description: Server error
 */
exports.getMails = (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const data = JSON.parse(fs.readFileSync(MAILS_FILE, 'utf8'));
        const userMails = data[username] || [];
        sendResponse(req, res, 200, userMails, 'mails');
    } catch (err) {
        sendResponse(req, res, 500, { error: 'Failed to read mail data' }, 'error');
    }
};

/**
 * @swagger
 * /api/set-provider:
 *   post:
 *     summary: Change mail delivery provider
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [resend, gmail]
 *     responses:
 *       200:
 *         description: Provider updated
 *       400:
 *         description: Invalid provider
 */
exports.setProvider = (req, res) => {
    const { provider } = req.body;
    if (provider === 'resend' || provider === 'gmail') {
        currentProvider = provider;
        return sendResponse(req, res, 200, { success: true, currentProvider }, 'providerUpdate');
    }
    sendResponse(req, res, 400, { error: 'Invalid provider specified.' }, 'error');
};

/**
 * @swagger
 * /api/get-provider:
 *   get:
 *     summary: Get current mail provider
 *     tags: [Mail]
 *     responses:
 *       200:
 *         description: Returns current provider
 */
exports.getProvider = (req, res) => {
    sendResponse(req, res, 200, { currentProvider }, 'provider');
};

/**
 * @swagger
 * /api/send-mail:
 *   post:
 *     summary: Send an email
 *     description: Sends an email. If the content contains the ARG trigger phrase, it is sent via the active provider.
 *     tags: [Mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mail sent successfully
 *       400:
 *         description: Missing email or content
 *       500:
 *         description: API failure
 */
exports.sendMail = async (req, res) => {
    const { email, content } = req.body;

    if (!email || !content) {
        return res.status(400).json({ error: 'Email and content are required' });
    }

    // Check for ARG trigger phrase
    if (TRIGGER_PHRASE && content.toUpperCase().includes(TRIGGER_PHRASE)) {
        try {
            if (currentProvider === 'resend') {
                await resend.emails.send({
                    from: process.env.RESEND_FROM,
                    to: [email],
                    subject: "Horizon Institute - Signal Received",
                    html: `<p>${content}</p>`,
                });
                console.log(`[RESEND] Signal sent to ${email}`);
            } else {
                await gmailTransporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: "Horizon Institute - Signal Received",
                    text: content,
                });
                console.log(`[GMAIL] Signal sent to ${email}`);
            }
            
            return sendResponse(req, res, 200, { success: true, message: 'Mail sent successfully. The signal has been received.' }, 'mailResponse');
        } catch (error) {
            console.error(`[${currentProvider.toUpperCase()} ERROR]:`, error);
            return sendResponse(req, res, 500, { error: `Failed to send the signal via ${currentProvider}.` }, 'error');
        }
    }

    // Normal mail send (simulated)
    console.log(`Normal mail sent to ${email}`);
    sendResponse(req, res, 200, { success: true, message: 'Mail sent successfully.' }, 'mailResponse');
};
