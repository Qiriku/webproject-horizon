/* 
 * FILE: portal.js
 * PURPOSE: Handles portal-specific logic and logout.
 * DEPENDENCIES: axios
 */

document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMsg = document.getElementById('welcomeMessage');
    const roleSpan = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');

    // Load user data from localStorage
    const userName = localStorage.getItem('hz_userName');
    const userRole = localStorage.getItem('hz_userRole');

    if (userName && userRole) {
        welcomeMsg.innerText = `Hello, ${userName}. Welcome back to your secure academic dashboard.`;
        roleSpan.innerText = userRole;
    } else {
        // Fallback if localStorage was cleared but cookie remains
        welcomeMsg.innerText = `Welcome to the Horizon Portal.`;
        roleSpan.innerText = `Unknown`;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await axios.post('/logout');
                localStorage.removeItem('hz_userName');
                localStorage.removeItem('hz_userRole');
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Logout failed:', error);
                // Still clear local storage and redirect
                localStorage.clear();
                window.location.href = '/login.html';
            }
        });
    }
});
