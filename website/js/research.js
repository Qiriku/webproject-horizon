/*
 * FILE: research.js
 * PURPOSE: Loads research posts and filters them by title.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const researchPostsContainer = document.getElementById('research-posts');
    const researchSearch = document.getElementById('researchSearch');
    let researchPosts = [];

    function renderResearchPosts(posts) {
        if (!posts || posts.length === 0) {
            researchPostsContainer.innerHTML = '<p class="research-message">No research posts found.</p>';
            return;
        }

        const researchHTML = posts.map(post => `
            <article class="section-card research-post">
                <div class="research-meta">
                    <span class="research-category">${post.category}</span>
                    <span> | ${post.date}</span>
                </div>
                <h3>${post.title}</h3>
                <div class="research-content">
                    ${post.content}
                </div>
            </article>
        `).join('');

        researchPostsContainer.innerHTML = researchHTML;
    }

    function filterResearchPosts() {
        const searchText = researchSearch.value.toLowerCase();
        const filteredPosts = researchPosts.filter(post => post.title.toLowerCase().includes(searchText));

        renderResearchPosts(filteredPosts);
    }

    try {
        const response = await axios.get('/getResearch');
        researchPosts = response.data;
        renderResearchPosts(researchPosts);
    } catch (error) {
        console.error('Error fetching research posts:', error);
        researchPostsContainer.innerHTML = `
            <div class="section-card" style="border-color: #feb2b2; background-color: #fff5f5;">
                <p style="color: #c53030; text-align: center;">
                    <strong>Unable to retrieve research posts.</strong><br>
                    Please try again later.
                </p>
            </div>
        `;
    }

    researchSearch.addEventListener('input', filterResearchPosts);
});
