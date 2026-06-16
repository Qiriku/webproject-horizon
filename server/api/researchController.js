const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const researchController = {
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
