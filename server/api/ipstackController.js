// External REST API controller.
// Uses IPify, a free API that returns the current public IP.
// No API key needed.

const https = require('https');
const { sendResponse } = require('./responseFormatter');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, response => {
        let data = '';

        response.on('data', chunk => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });
}

const ipstackController = {
  getIpData: async (req, res) => {
    try {
      // External REST API call.
      const data = await fetchJson('https://api.ipify.org?format=json');

      sendResponse(req, res, 200, {
        ip: data.ip || 'Unknown',
        source: 'IPify',
        note: 'External REST API response received.'
      });
    } catch (error) {
      console.error('External IP API error:', error);

      // Fallback so the ARG popup still works during local testing.
      sendResponse(req, res, 200, {
        ip: 'local-development',
        source: 'fallback',
        note: 'External API unavailable. Local fallback used.'
      });
    }
  }
};

module.exports = ipstackController;
