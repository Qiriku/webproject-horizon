const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const researchController = {
    /**
     * @swagger
     * /getResearch:
     *   get:
     *     summary: Get all research posts
     *     tags: [Research]
     *     responses:
     *       200:
     *         description: List of research posts
     *       500:
     *         description: Internal server error
     */
    getResearchPosts: (req, res) => {
        try {
            const researchPath = path.join(__dirname, '..', 'staticFiles', 'research.json');
            const rawData = fs.readFileSync(researchPath, 'utf8');
            const researchPosts = JSON.parse(rawData);

            sendResponse(req, res, 200, researchPosts, 'research');
        } catch (error) {
            console.error('Error reading research data:', error);
            sendResponse(req, res, 500, {
                error: 'Internal Server Error',
                message: 'Unable to retrieve research posts at this time.'
            });
        }
    }
};

module.exports = researchController;
