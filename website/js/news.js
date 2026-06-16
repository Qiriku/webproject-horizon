/* 
 * FILE: news.js
 * PURPOSE: Handles dynamic fetching and rendering of news articles.
 * DEPENDENCIES: axios (via CDN), styles.css
 * KEY FEATURES: API integration, dynamic HTML generation, error handling.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const newsFeed = document.getElementById('news-feed');
  const userRole = localStorage.getItem('hz_userRole');

  // Teachers/Admins can test POST, PUT and DELETE from the frontend.
  const canEdit = userRole === 'Admin' || userRole === 'Teacher';

  async function fetchAndRenderNews() {
    try {
      // 1. Fetch news data from the backend API
      const response = await axios.get('/getNews');
      const newsData = response.data;

      // 2. Clear the "Loading..." message
      newsFeed.innerHTML = '';

      if (!newsData || newsData.length === 0) {
        newsFeed.innerHTML = '<p style="text-align: center; color: var(--light-text);">No news articles available at this time.</p>';
        return;
      }

      const adminPanelHTML = canEdit ? renderAdminPanel() : '';

      // 3. Map each news object to an HTML template
      const newsHTML = newsData.map(item => renderNewsItem(item)).join('');

      // 4. Inject the generated HTML into the feed container
      newsFeed.innerHTML = adminPanelHTML + newsHTML;

      if (canEdit) {
        attachCreateHandler();
        attachEditHandlers();
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      newsFeed.innerHTML = `
        <div class="section-card" style="border-color: #feb2b2; background-color: #fff5f5;">
          <p style="color: #c53030; text-align: center;">
            <strong>Unable to retrieve latest updates.</strong><br>
            Please try again later or contact the administrative office.
          </p>
        </div>
      `;
    }
  }

  function renderAdminPanel() {
    return `
      <section class="section-card admin-news-panel">
        <h3>Administrative News Control</h3>
        <p class="small-muted">
          Teacher/Admin test area. This uses POST to create news.
        </p>

        <form id="createNewsForm">
          <div class="form-group">
            <label for="newTitle">Title</label>
            <input id="newTitle" required placeholder="News title">
          </div>

          <div class="form-group">
            <label for="newDate">Date</label>
            <input id="newDate" required placeholder="June 14, 2026">
          </div>

          <div class="form-group">
            <label for="newContent">Content</label>
            <textarea id="newContent" required placeholder="<p>Article content...</p>"></textarea>
          </div>

          <button class="btn btn-primary" type="submit">Create News</button>
        </form>
      </section>
    `;
  }

  function renderNewsItem(item) {
    return `
      <article class="section-card news-item" data-id="${item.id}">
        <div class="news-meta">
          <span class="date">${item.date}</span>
        </div>

        <h3 class="news-title">${item.title}</h3>

        <div class="news-content">
          ${item.content}
        </div>

        ${
          canEdit
            ? `
              <div class="admin-actions">
                <button class="btn btn-secondary edit-news-btn" data-id="${item.id}">
                  Update
                </button>
                <button class="btn btn-secondary delete-news-btn" data-id="${item.id}">
                  Delete
                </button>
              </div>
            `
            : ''
        }
      </article>
    `;
  }

  function attachCreateHandler() {
    const form = document.getElementById('createNewsForm');

    if (!form) return;

    form.addEventListener('submit', async event => {
      event.preventDefault();

      const title = document.getElementById('newTitle').value;
      const date = document.getElementById('newDate').value;
      const content = document.getElementById('newContent').value;

      // POST request.
      await axios.post('/api/news', {
        title,
        date,
        content
      });

      fetchAndRenderNews();
    });
  }

  function attachEditHandlers() {
    document.querySelectorAll('.delete-news-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;

        if (!confirm('Delete this news article?')) return;

        // DELETE request.
        await axios.delete(`/api/news/${id}`);
        fetchAndRenderNews();
      });
    });

    document.querySelectorAll('.edit-news-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const article = button.closest('.news-item');
        const id = button.dataset.id;

        const currentTitle = article.querySelector('.news-title').innerText;
        const currentDate = article.querySelector('.date').innerText;
        const currentContent = article.querySelector('.news-content').innerHTML.trim();

        const title = prompt('Update title:', currentTitle);
        if (title === null) return;

        const date = prompt('Update date:', currentDate);
        if (date === null) return;

        const content = prompt('Update content HTML:', currentContent);
        if (content === null) return;

        // PUT request.
        await axios.put(`/api/news/${id}`, {
          title,
          date,
          content
        });

        fetchAndRenderNews();
      });
    });
  }

  // Initial call to load news
  fetchAndRenderNews();
});