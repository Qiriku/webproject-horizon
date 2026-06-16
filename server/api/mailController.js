const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { sendResponse } = require('./responseFormatter');

const MAILS_FILE = path.join(__dirname, '../staticFiles/mails.json');
const USERS_FILE = path.join(__dirname, '../staticFiles/users.json');
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
        sendResponse(req, res, 200, userMails, 'mails');
    } catch (err) {
        sendResponse(req, res, 500, { error: 'Failed to read mail data' }, 'error');
    }
};

exports.setProvider = (req, res) => {
    const { provider } = req.body;
    if (provider === 'resend' || provider === 'gmail') {
        currentProvider = provider;
        return sendResponse(req, res, 200, { success: true, currentProvider }, 'providerUpdate');
    }
    sendResponse(req, res, 400, { error: 'Invalid provider specified.' }, 'error');
};

exports.getProvider = (req, res) => {
    sendResponse(req, res, 200, { currentProvider }, 'provider');
};

exports.sendMail = async (req, res) => {
    const { email, content } = req.body;
    const senderEmail = req.user ? req.user.email : 'system@horizon.ac.at';

    if (!email || !content) {
        return res.status(400).json({ error: 'Email and content are required' });
    }

    try {
        // 1. Check if recipient exists in the system (Internal Route)
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const recipient = users.find(u => u.email === email);

        if (recipient) {
            // Save to internal mails.json
            const mailsData = JSON.parse(fs.readFileSync(MAILS_FILE, 'utf8'));
            
            const newMail = {
                id: Date.now(),
                from: senderEmail,
                subject: 'Internal Communication',
                date: new Date().toISOString().split('T')[0],
                content: content
            };

            if (!mailsData[email]) {
                mailsData[email] = [];
            }
            mailsData[email].push(newMail);
            fs.writeFileSync(MAILS_FILE, JSON.stringify(mailsData, null, 2));

            return sendResponse(req, res, 200, { success: true, message: 'Internal mail delivered to user mailbox.' }, 'mailResponse');
        }

        // 2. External Route
        // Check for ARG trigger phrase
        if (TRIGGER_PHRASE && content.toUpperCase().includes(TRIGGER_PHRASE)) {
            // Retrieve the password of Dean Oren Vale for the ARG trigger
            const oren = users.find(u => u.email === 'oren.vale@horizon.ac.at');
            const password = oren ? oren.password : 'Password unavailable';

            const professionalSubject = 'Security Notification: Account Password Recovery';
            const professionalBody = `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
                    <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">Horizon Institute of Advanced Studies</h2>
                    <p>Dear User,</p>
                    <p>A request has been processed for the recovery of academic credentials associated with the Dean's office.</p>
                    <div style="background: #f4f4f4; padding: 15px; border: 1px dashed #999; text-align: center; font-family: monospace; font-size: 1.2rem; margin: 20px 0;">
                        <strong>${password}</strong>
                    </div>
                    <p>If you did not request this information, please ignore this message or contact the System Administrator immediately.</p>
                    <p style="font-size: 0.8rem; color: #777; margin-top: 30px;">
                        This is an automated message from the Horizon Continuity System. 
                        Please do not reply to this address.
                    </p>
                </div>
            `;

            if (currentProvider === 'resend') {
                await resend.emails.send({
                    from: process.env.RESEND_FROM,
                    to: [email],
                    subject: professionalSubject,
                    html: professionalBody,
                });
            } else {
                await gmailTransporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: professionalSubject,
                    html: professionalBody,
                });
            }
            
            return sendResponse(req, res, 200, { success: true, message: 'Mail sent successfully. The signal has been received.' }, 'mailResponse');
        }

        // 3. Normal External Mail
        if (currentProvider === 'resend') {
            await resend.emails.send({
                from: process.env.RESEND_FROM,
                to: [email],
                subject: "Message from Horizon Institute",
                html: `<p>${content}</p>`,
            });
        } else {
            await gmailTransporter.sendMail({
                from: process.env.GMAIL_USER,
                to: email,
                subject: "Message from Horizon Institute",
                text: content,
            });
        }
        
        return sendResponse(req, res, 200, { success: true, message: 'External mail sent successfully.' }, 'mailResponse');

    } catch (error) {
        console.error(`[MAIL ERROR]:`, error);
        return sendResponse(req, res, 500, { error: 'An error occurred while processing the mail.' }, 'error');
    }
};
