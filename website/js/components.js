/* 
 * FILE: components.js
 * PURPOSE: Shared UI components for DRY header and footer injection.
 * DEPENDENCIES: styles.css
 * KEY FEATURES: Context-aware Layout (Public vs Portal), Side Nav injection, Mobile menu toggle.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const currentPath = window.location.pathname;
    
    // Define which pages belong to the Portal "App"
    const portalPages = [
        '/portal.html',
        '/inbox.html',
        '/documents.html',
        '/timetable.html',
        '/lectures.html',
        '/people.html'
    ];

    const isPortalPage = portalPages.some(page => currentPath.endsWith(page));

    // 1. Inject Header Component
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        // Determine if we show "Portal Login" or "Logout" in top bar
        const isAuth = localStorage.getItem('hz_userName') !== null;
        const topBarLink = isAuth ? 
            `<a href="#" id="topBarLogout">Logout</a>` : 
            `<a href="/login.html">Portal Login</a>`;

        headerPlaceholder.innerHTML = `
            <div id="site-header">
                <div class="top-bar">
                    <div class="top-bar-inner">
                        <div class="top-links">
                            <a href="#">Campus Network</a> | 
                            <a href="#">Magazine</a> | 
                            <a href="#">Intranet</a> | 
                            <a href="/archive.html">Archive</a> | 
                            ${topBarLink}
                        </div>
                    </div>
                </div>
                <header>
                    <div class="header-inner">
                        <div class="logo-container">
                            <span class="logo-icon">H</span>
                            <div class="logo-text">
                                <h1>HORIZON</h1>
                                <p>INSTITUTE OF ADVANCED STUDIES</p>
                            </div>
                        </div>
                    </div>
                </header>
                <button class="burger-menu" id="burgerMenu" aria-label="Toggle navigation menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav id="navMenu">
                    <!-- Links will be injected dynamically below -->
                </nav>
            </div>
        `;

        // Top Bar Logout Handler
        const topBarLogout = document.getElementById('topBarLogout');
        if (topBarLogout) {
            topBarLogout.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await axios.post('/logout');
                    localStorage.removeItem('hz_userName');
                    localStorage.removeItem('hz_userRole');
                    window.location.href = '/index.html';
                } catch (err) {
                    localStorage.clear();
                    window.location.href = '/index.html';
                }
            });
        }

        // Event Delegation for Burger Menu (Fixed: works regardless of HTML replacement)
        document.addEventListener('click', (e) => {
            if (e.target.closest('#burgerMenu')) {
                const nav = document.getElementById('navMenu');
                const btn = document.getElementById('burgerMenu');
                if (nav && btn) {
                    nav.classList.toggle('active');
                    btn.classList.toggle('active');
                }
            }
        });

        // Dynamic Navigation Link Injection
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            let linksHTML = '';
            if (isPortalPage) {
                // Portal-specific links
                linksHTML = `
                    <a href="/portal.html" class="nav-link ${currentPath.endsWith('portal.html') ? 'active-link' : ''}">Dashboard</a>
                    <a href="/inbox.html" class="nav-link ${currentPath.endsWith('inbox.html') ? 'active-link' : ''}">Inbox</a>
                    <a href="/documents.html" class="nav-link ${currentPath.endsWith('documents.html') ? 'active-link' : ''}">Documents</a>
                    <a href="/timetable.html" class="nav-link ${currentPath.endsWith('timetable.html') ? 'active-link' : ''}">Timetable</a>
                    <a href="/lectures.html" class="nav-link ${currentPath.endsWith('lectures.html') ? 'active-link' : ''}">Lectures</a>
                    <a href="/people.html" class="nav-link ${currentPath.endsWith('people.html') ? 'active-link' : ''}">People</a>
                    <a href="#" id="mobileLogout" class="nav-link">Logout</a>
                `;
            } else {
                // Public links
                linksHTML = `
                    <a href="/index.html" class="nav-link" data-page="home">Home</a>
                    <a href="/about.html" class="nav-link" data-page="about">About Us</a>
                    <a href="/academics.html" class="nav-link" data-page="academics">Academics</a>
                    <a href="/admissions.html" class="nav-link" data-page="admissions">Admissions</a>
                    <a href="/campus-life.html" class="nav-link" data-page="campus-life">Campus Life</a>
                    <a href="/research.html" class="nav-link" data-page="research">Research</a>
                    <a href="/faculty.html" class="nav-link" data-page="faculty">Faculty & Staff</a>
                    <a href="/news.html" class="nav-link" data-page="news">News & Events</a>
                `;
            }
            
            // Inject links ONLY.
            navMenu.innerHTML = linksHTML;
            
            // Handle mobile logout
            const mobileLogout = document.getElementById('mobileLogout');
            if (mobileLogout) {
                mobileLogout.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await axios.post('/logout');
                        localStorage.removeItem('hz_userName');
                        localStorage.removeItem('hz_userRole');
                        window.location.href = '/index.html';
                    } catch (err) {
                        localStorage.clear();
                        window.location.href = '/index.html';
                    }
                });
            }
        }

        // Highlight active public links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (currentPath === href || (currentPath === '/' && href === '/index.html') || currentPath.endsWith(href))) {
                link.classList.add('active-link');
            }
        });
    }

    // 2. Portal Side Navigation Injection
    if (isPortalPage) {
        document.body.classList.add('portal-mode');
        
        const sideNav = document.createElement('aside');
        sideNav.className = 'side-nav';
        sideNav.innerHTML = `
            <div class="side-nav-header">
                <h3>Horizon Portal</h3>
            </div>
            <div class="side-nav-links">
                <a href="/portal.html" class="side-nav-link ${currentPath.endsWith('portal.html') ? 'active-side' : ''}">Dashboard</a>
                <a href="/inbox.html" class="side-nav-link ${currentPath.endsWith('inbox.html') ? 'active-side' : ''}">Inbox</a>
                <a href="/documents.html" class="side-nav-link ${currentPath.endsWith('documents.html') ? 'active-side' : ''}">Documents</a>
                <a href="/timetable.html" class="side-nav-link ${currentPath.endsWith('timetable.html') ? 'active-side' : ''}">Timetable</a>
                <a href="/lectures.html" class="side-nav-link ${currentPath.endsWith('lectures.html') ? 'active-side' : ''}">Lectures</a>
                <a href="/people.html" class="side-nav-link ${currentPath.endsWith('people.html') ? 'active-side' : ''}">People</a>
            </div>
            <div class="side-nav-footer">
                <button id="sideLogoutBtn" class="logout-btn-side">Logout</button>
            </div>
        `;
        
        document.body.prepend(sideNav);

        // Side Nav Logout Handler
        const sideLogoutBtn = document.getElementById('sideLogoutBtn');
        if (sideLogoutBtn) {
            sideLogoutBtn.addEventListener('click', async () => {
                try {
                    await axios.post('/logout');
                    localStorage.removeItem('hz_userName');
                    localStorage.removeItem('hz_userRole');
                    window.location.href = '/index.html';
                } catch (err) {
                    localStorage.clear();
                    window.location.href = '/index.html';
                }
            });
        }
    }

    // 3. Inject Footer Component
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer>
                <div class="footer-links">
                    <a href="/index.html">Home</a> | 
                    <a href="/about.html">About Us</a> | 
                    <a href="/academics.html">Academics</a> | 
                    <a href="/admissions.html">Admissions</a> | 
                    <a href="/campus-life.html">Campus Life</a> | 
                    <a href="/research.html">Research</a> | 
                    <a href="/faculty.html">Faculty</a> | 
                    <a href="/news.html">News & Events</a> | 
                    <a href="/login.html">Portal Login</a>
                </div>
                <p>&copy; 2012 Horizon Institute of Advanced Studies. All Rights Reserved.</p>
            </footer>
        `;
    }
});
