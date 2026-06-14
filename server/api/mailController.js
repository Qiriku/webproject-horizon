const fs = require('fs');
const path = require('path');

const MAILS_FILE = path.join(__dirname, '../staticFiles/mails.json');
const TRIGGER_PHRASE = process.env.ARG_TRIGGER;

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

exports.sendMail = (req, res) => {
    const { email, content } = req.body;

    if (!email || !content) {
        return res.status(400).json({ error: 'Email and content are required' });
    }

    // Check for ARG trigger phrase
    if (content.toUpperCase().includes(TRIGGER_PHRASE)) {
        console.log(`[ARG TRIGGER] Mailgun API call would be triggered for: ${email}`);
        // Here we would implement the actual Mailgun API call
        return res.json({ success: true, message: 'Mail sent successfully. The signal has been received.' });
    }

    // Normal mail send (simulated)
    console.log(`Normal mail sent to ${email}`);
    res.json({ success: true, message: 'Mail sent successfully.' });
};
