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
      showIpWarning();
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

        <h2>Unknown IP detected.</h2>

        <p>
          Current access point:
          <strong>${data.ip}</strong>
        </p>

        <p class="arg-warning">
          This address was not present in the previous continuity record.
          Please confirm that the person accessing this account is still the original user.
        </p>

        <p class="arg-warning-small">
          If this message appears repeatedly, do not attend Orientation Review after 22:04.
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