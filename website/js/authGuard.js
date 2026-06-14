/* 
 * FILE: authGuard.js
 * PURPOSE: Manages access control for protected pages.
 * DEPENDENCIES: axios
 */

(async function() {
    // Hide the page content immediately to prevent "flash" of protected content
    document.documentElement.style.visibility = 'hidden';

    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    
    const portalPages = [
        '/portal.html',
        '/inbox.html',
        '/documents.html',
        '/timetable.html',
        '/lectures.html',
        '/people.html'
    ];
    const isPortalPage = portalPages.some(page => currentPath.endsWith(page));

    // Helper to check if user is authenticated via server
    async function checkAuth() {
        try {
            // Call the protected endpoint
            await axios.get('/api/portal-check');
            return true;
        } catch (e) {
            return false;
        }
    }

    try {
        const isAuthenticated = await checkAuth();

        if (isPortalPage && !isAuthenticated) {
            // Not logged in, but trying to access portal -> redirect to login
            window.location.href = '/login.html';
            return;
        } else if (isLoginPage && isAuthenticated) {
            // Logged in, but trying to access login page -> redirect to portal
            window.location.href = '/portal.html';
            return;
        }

        // If we reached here, the user is allowed to see the page
        document.documentElement.style.visibility = 'visible';
    } catch (error) {
        console.error('AuthGuard Error:', error);
        if (isPortalPage) {
            window.location.href = '/login.html';
        } else {
            document.documentElement.style.visibility = 'visible';
        }
    }
})();
