const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const lecturesPath = path.join(__dirname, '..', 'staticFiles', 'lectures.json');

const timetableController = {
    /**
     * @swagger
     * /api/timetable:
     *   get:
     *     summary: Get current timetable
     *     tags: [Portal]
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: List of lectures
     *       500:
     *         description: Internal server error
     */
    getTimetable: (req, res) => {
        try {
            const data = JSON.parse(fs.readFileSync(lecturesPath, 'utf8'));
            sendResponse(req, res, 200, data);
        } catch (error) {
            sendResponse(req, res, 500, { error: 'Failed to read timetable.' });
        }
    },
    /**
     * @swagger
     * /api/timetable:
     *   post:
     *     summary: Add a new lecture to timetable
     *     tags: [Portal]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               datetime:
     *                 type: string
     *     responses:
     *       201:
     *         description: Lecture added
     *       400:
     *         description: Missing fields
     *       500:
     *         description: Internal server error
     */
    addLecture: (req, res) => {
        try {
            const { title, datetime } = req.body;
            if (!title || !datetime) return sendResponse(req, res, 400, { error: 'Missing fields' });

            const data = JSON.parse(fs.readFileSync(lecturesPath, 'utf8'));
            data.lectures.push({ title, datetime });
            
            fs.writeFileSync(lecturesPath, JSON.stringify(data, null, 2));
            sendResponse(req, res, 201, { message: 'Lecture added successfully', lecture: { title, datetime } });
        } catch (error) {
            sendResponse(req, res, 500, { error: 'Failed to add lecture.' });
        }
    }
};

module.exports = timetableController;