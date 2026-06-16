/* 
 * FILE: portal.js
 * PURPOSE: Handles portal-specific logic, logout, last access update,
 * and ARG IP warning popup.
 * DEPENDENCIES: axios
 */

document.addEventListener('DOMContentLoaded', async () => {
    const welcomeMsg = document.getElementById('welcomeMessage');
    const roleSpan = document.getElementById('userRole');
    const lastAccessSpan = document.getElementById('lastAccess');
    const logoutBtn = document.getElementById('logoutBtn');

    // Load user data from localStorage
    const userName = localStorage.getItem('hz_userName');
    const userRole = localStorage.getItem('hz_userRole');

    if (userName && userRole) {
        welcomeMsg.innerText = `Hello, ${userName}. Welcome back to your secure academic dashboard.`;
        roleSpan.innerText = userRole;

        try {
            // PATCH request: updates last access date.
            const response = await axios.patch('/api/users/last-access');
            lastAccessSpan.innerText = response.data.lastAccess;
        } catch (error) {
            console.error('Could not update last access:', error);
            lastAccessSpan.innerText = 'Unknown';
        }

        // ARG feature: teachers/admins see suspicious IP popup.
        if (userRole === 'Teacher' || userRole === 'Admin') {
            // Delay the trigger to create a "detection" effect.
            setTimeout(showIpWarning, 1500);
        }
    } else {
        // Fallback if localStorage was cleared but cookie remains
        welcomeMsg.innerText = `Welcome to the Horizon Portal.`;
        roleSpan.innerText = `Unknown`;
        lastAccessSpan.innerText = `Unknown`;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await axios.post('/logout');
                localStorage.removeItem('hz_userName');
                localStorage.removeItem('hz_userRole');
                localStorage.removeItem('hz_userEmail');
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Logout failed:', error);
                localStorage.clear();
                window.location.href = '/login.html';
            }
        });
    }

    // Admin Provider Toggle Logic
    if (userRole === 'Admin') {
        const adminSettings = document.getElementById('adminSettings');
        const providerSelect = document.getElementById('providerSelect');
        const saveProviderBtn = document.getElementById('saveProviderBtn');

        if (adminSettings) {
            adminSettings.style.display = 'block';

            // Load current provider
            try {
                const response = await axios.get('/api/mail-provider');
                providerSelect.value = response.data.currentProvider;
            } catch (err) {
                console.error('Failed to load current mail provider:', err);
            }

            // Save new provider
            saveProviderBtn.addEventListener('click', async () => {
                try {
                    const provider = providerSelect.value;
                    await axios.post('/api/set-provider', { provider });
                    alert(`Mail provider updated to ${provider}.`);
                } catch (err) {
                    alert('Failed to update mail provider.');
                }
            });
        }
    }
});

async function showIpWarning() {
    try {
        // GET request to your backend.
        // Backend then calls external IPify REST API.
        const response = await axios.get('/api/ipstack-data');
        const data = response.data;

        const overlay = document.createElement('div');
        overlay.className = 'ip-warning-overlay';

        overlay.innerHTML = `
            <div class="ip-warning-box">
                <button class="ip-warning-close" aria-label="Close warning">&times;</button>

                <h2>UNAUTHORIZED CONTINUITY DETECTED</h2>

                <p>
                    ACCESS POINT: 
                    <strong>${data.ip}</strong>
                </p>

                <p class="arg-warning">
                    THE BIOLOGICAL SIGNATURE DOES NOT MATCH THE REGISTERED RECORD. 
                    PLEASE REMAIN STATIONARY FOR VERIFICATION.
                </p>

                <p class="arg-warning-small">
                    IF THIS MESSAGE APPEARS REPEATEDLY, DO NOT ATTEND ORIENTATION REVIEW AFTER 22:04.
                </p>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('.ip-warning-close').addEventListener('click', () => {
            overlay.remove();
        });
    } catch (error) {
        console.error('Could not load external IP data:', error);
    }
}
