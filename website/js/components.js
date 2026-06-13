/* 
 * FILE: components.js
 * PURPOSE: Shared UI components for DRY header and footer injection.
 * DEPENDENCIES: styles.css
 * KEY FEATURES: Navigation handling, Active link highlighting, Mobile menu toggle.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Header Component
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <div id="site-header">
                <div class="top-bar">
                    <div class="top-bar-inner">
                        <div class="top-links">
                            <a href="#">Campus Network</a> | 
                            <a href="#">Magazine</a> | 
                            <a href="#">Intranet</a> | 
                            <a href="/archive.html">Archive</a> | 
                            <a href="/login.html">Portal Login</a>
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
                <nav id="navMenu">
                    <button class="burger-menu" id="burgerMenu" aria-label="Toggle navigation menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <a href="/index.html" class="nav-link" data-page="home">Home</a>
                    <a href="/about.html" class="nav-link" data-page="about">About Us</a>
                    <a href="/academics.html" class="nav-link" data-page="academics">Academics</a>
                    <a href="/admissions.html" class="nav-link" data-page="admissions">Admissions</a>
                    <a href="/campus-life.html" class="nav-link" data-page="campus-life">Campus Life</a>
                    <a href="/faculty.html" class="nav-link" data-page="faculty">Faculty & Staff</a>
                    <a href="/news.html" class="nav-link" data-page="news">News & Events</a>
                </nav>
            </div>
        `;

        // Add burger menu click listener for mobile navigation
        const burgerMenu = document.getElementById('burgerMenu');
        const navMenu = document.getElementById('navMenu');
        if (burgerMenu && navMenu) {
            burgerMenu.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                burgerMenu.classList.toggle('active');
            });
        }

        // Highlight the active page in navigation
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath === href || 
                (currentPath === '/' && href === '/index.html') ||
                currentPath.endsWith(href)) {
                link.classList.add('active-link');
            }
        });
    }

    // 2. Inject Footer Component
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
                    <a href="/faculty.html">Faculty</a> | 
                    <a href="/news.html">News & Events</a>
                </div>
                <p>&copy; 2012 Horizon Institute of Advanced Studies. All Rights Reserved.</p>
            </footer>
        `;
    }
});

