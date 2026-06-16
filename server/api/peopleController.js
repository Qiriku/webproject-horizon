const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const peopleController = {
    getPeople: (req, res) => {
        try {
            const usersPath = path.join(__dirname, '..', 'staticFiles', 'users.json');
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

            const safeUsers = users.map(u => ({ name: u.name, role: u.role, email: u.email }));
            
            const students = safeUsers.filter(u => u.role === 'Student');
            const staff = safeUsers.filter(u => u.role === 'Admin' || u.role === 'Teacher');

            sendResponse(req, res, 200, { students, staff });
        } catch (error) {
            console.error('Error fetching people:', error);
            sendResponse(req, res, 500, { error: 'Failed to load directory.' });
        }
    }
};

module.exports = peopleController;