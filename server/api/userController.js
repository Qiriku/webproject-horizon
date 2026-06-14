const fs = require('fs');
const path = require('path');
const { sendResponse } = require('./responseFormatter');

const usersPath = path.join(__dirname, '..', 'staticFiles', 'users.json');

function getToday() {
    return new Date().toISOString().split('T')[0];
}

const userController = {
    updateLastAccess: (req, res) => {
        try {
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            const user = users.find(currentUser => currentUser.email === req.user.email);

            if (!user) {
                return sendResponse(req, res, 404, { error: 'User not found.' });
            }

            user.lastAccess = getToday();

            fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

            sendResponse(req, res, 200, {
                message: 'Last access updated.',
                lastAccess: user.lastAccess
            });
        } catch (error) {
            console.error('Last access update failed:', error);
            sendResponse(req, res, 500, { error: 'Could not update last access.' });
        }
    }
};

module.exports = userController;
