const fs = require('fs');
const path = require('path');

/**
 * newsController handles all API requests related to the news feed.
 */
const newsController = {
    /**
     * GET /getNews
     * Reads the news.json file and returns the list of articles.
     */
    getNews: (req, res) => {
        try {
            const newsPath = path.join(__dirname, '..', 'staticFiles', 'news.json');
            const rawData = fs.readFileSync(newsPath, 'utf8');
            const newsData = JSON.parse(rawData);
            
            res.status(200).json(newsData);
        } catch (error) {
            console.error('Error reading news data:', error);
            res.status(500).json({ 
                error: 'Internal Server Error', 
                message: 'Unable to retrieve news articles at this time.' 
            });
        }
    }
};

module.exports = newsController;
