const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const archiveController = {
    /**
     * @swagger
     * /getArchive:
     *   get:
     *     summary: Get all archive posts
     *     tags: [Archive]
     *     responses:
     *       200:
     *         description: List of archive posts
     *       500:
     *         description: Internal server error
     */
    getArchivePosts: (req, res) => {
        try {
            const archivePath = path.join(__dirname, '..', 'staticFiles', 'archive.json');
            const rawData = fs.readFileSync(archivePath, 'utf8');
            const archivePosts = JSON.parse(rawData);

            sendResponse(req, res, 200, archivePosts, 'archive');
        } catch (error) {
            console.error('Error reading archive data:', error);
            sendResponse(req, res, 500, {
                error: 'Internal Server Error',
                message: 'Unable to retrieve archive posts at this time.'
            });
        }
    }
};

module.exports = archiveController;
