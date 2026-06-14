const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');

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

exports.getMails = (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const data = JSON.parse(fs.readFileSync(MAILS_FILE, 'utf8'));
        const userMails = data[username] || [];
        res.json(userMails);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read mail data' });
    }
};

exports.setProvider = (req, res) => {
    const { provider } = req.body;
    if (provider === 'resend' || provider === 'gmail') {
        currentProvider = provider;
        return res.json({ success: true, currentProvider });
    }
    res.status(400).json({ error: 'Invalid provider specified.' });
};

exports.getProvider = (req, res) => {
    res.json({ currentProvider });
};

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
            
            return res.json({ success: true, message: 'Mail sent successfully. The signal has been received.' });
        } catch (error) {
            console.error(`[${currentProvider.toUpperCase()} ERROR]:`, error);
            return res.status(500).json({ error: `Failed to send the signal via ${currentProvider}.` });
        }
    }

    // Normal mail send (simulated)
    console.log(`Normal mail sent to ${email}`);
    res.json({ success: true, message: 'Mail sent successfully.' });
};
