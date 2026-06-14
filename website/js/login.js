/* 
 * FILE: login.js
 * PURPOSE: Handles the login form submission and token storage.
 * DEPENDENCIES: axios
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await axios.post('/login', { email, password });
                const { user } = response.data;

                // Save profile data to localStorage
                localStorage.setItem('hz_userName', user.name);
                localStorage.setItem('hz_userRole', user.role);

                // Redirect to portal
                window.location.href = '/portal.html';
            } catch (error) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = error.response?.data?.error || 'An unexpected error occurred.';
            }
        });
    }
});
