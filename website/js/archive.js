/*
 * FILE: archive.js
 * PURPOSE: Loads archive posts and filters them by title.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const archivePostsContainer = document.getElementById('archive-posts');
    const archiveSearch = document.getElementById('archiveSearch');
    let archivePosts = [];

    function renderArchivePosts(posts) {
        if (!posts || posts.length === 0) {
            archivePostsContainer.innerHTML = '<p class="archive-message">No archive posts found.</p>';
            return;
        }

        const archiveHTML = posts.map(post => `
            <article class="section-card archive-post">
                <div class="archive-meta">
                    <span class="archive-category">${post.category}</span>
                    <span> | ${post.date}</span>
                </div>
                <h3>${post.title}</h3>
                <div class="archive-content">
                    ${post.content}
                </div>
            </article>
        `).join('');

        archivePostsContainer.innerHTML = archiveHTML;
    }

    function filterArchivePosts() {
        const searchText = archiveSearch.value.toLowerCase();
        const filteredPosts = archivePosts.filter(post => post.title.toLowerCase().includes(searchText));

        renderArchivePosts(filteredPosts);
    }

    try {
        const response = await axios.get('/getArchive');
        archivePosts = response.data;
        renderArchivePosts(archivePosts);
    } catch (error) {
        console.error('Error fetching archive posts:', error);
        archivePostsContainer.innerHTML = `
            <div class="section-card" style="border-color: #feb2b2; background-color: #fff5f5;">
                <p style="color: #c53030; text-align: center;">
                    <strong>Unable to retrieve archive posts.</strong><br>
                    Please try again later.
                </p>
            </div>
        `;
    }

    archiveSearch.addEventListener('input', filterArchivePosts);
});
