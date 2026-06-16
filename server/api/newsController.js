const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const newsPath = path.join(__dirname, '..', 'staticFiles', 'news.json');

function readNews() {
  return JSON.parse(fs.readFileSync(newsPath, 'utf8'));
}

function writeNews(news) {
  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2));
}

function canEditNews(req) {
  return req.user && (req.user.role === 'Admin' || req.user.role === 'Teacher');
}

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
      const newsData = readNews();
      sendResponse(req, res, 200, newsData, 'news');
    } catch (error) {
      console.error('Error reading news data:', error);
      sendResponse(req, res, 500, {
        error: 'Internal Server Error',
        message: 'Unable to retrieve news articles at this time.'
      });
    }
  },

  // POST /api/news
  // Teacher/Admin can create a new news article.
  createNews: (req, res) => {
    if (!canEditNews(req)) {
      return sendResponse(req, res, 403, {
        error: 'Only teachers or admins can create news.'
      });
    }

    const { title, date, content } = req.body;

    if (!title || !date || !content) {
      return sendResponse(req, res, 400, {
        error: 'Title, date and content are required.'
      });
    }

    const news = readNews();

    const newArticle = {
      id: Date.now(),
      title,
      date,
      content
    };

    news.unshift(newArticle);
    writeNews(news);

    sendResponse(req, res, 201, newArticle);
  },

  // PUT /api/news/:id
  // Teacher/Admin can update an existing news article.
  updateNews: (req, res) => {
    if (!canEditNews(req)) {
      return sendResponse(req, res, 403, {
        error: 'Only teachers or admins can update news.'
      });
    }

    const id = Number(req.params.id);
    const { title, date, content } = req.body;

    const news = readNews();
    const article = news.find(item => item.id === id);

    if (!article) {
      return sendResponse(req, res, 404, {
        error: 'News article not found.'
      });
    }

    article.title = title || article.title;
    article.date = date || article.date;
    article.content = content || article.content;

    writeNews(news);

    sendResponse(req, res, 200, article);
  },

  // DELETE /api/news/:id
  // Teacher/Admin can delete an existing news article.
  deleteNews: (req, res) => {
    if (!canEditNews(req)) {
      return sendResponse(req, res, 403, {
        error: 'Only teachers or admins can delete news.'
      });
    }

    const id = Number(req.params.id);
    const news = readNews();
    const filteredNews = news.filter(item => item.id !== id);

    if (filteredNews.length === news.length) {
      return sendResponse(req, res, 404, {
        error: 'News article not found.'
      });
    }

    writeNews(filteredNews);

    sendResponse(req, res, 200, {
      message: 'News article deleted.',
      deletedId: id
    });
  }
};

module.exports = newsController;