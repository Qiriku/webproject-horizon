/* 
 * FILE: news.js
 * PURPOSE: Handles dynamic fetching and rendering of news articles.
 * DEPENDENCIES: axios (via CDN), styles.css
 * KEY FEATURES: API integration, dynamic HTML generation, error handling.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const newsFeed = document.getElementById('news-feed');

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

            // 3. Map each news object to an HTML template
            const newsHTML = newsData.map(item => `
                <article class="section-card news-item">
                    <div class="news-meta">
                        <span class="date">${item.date}</span>
                    </div>
                    <h3>${item.title}</h3>
                    <div class="news-content">
                        ${item.content}
                    </div>
                </article>
            `).join('');

            // 4. Inject the generated HTML into the feed container
            newsFeed.innerHTML = newsHTML;

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

    // Initial call to load news
    fetchAndRenderNews();
});
