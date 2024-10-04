module.exports = (app) => {
    
    const profileController = require('../controllers/profile.controller.js');

    // Get profile - authentication optional
    app.get('/:username', profileController.getProfile);
}