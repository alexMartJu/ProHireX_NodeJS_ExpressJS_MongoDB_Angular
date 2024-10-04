module.exports = (app) => {
    
    const profileController = require('../controllers/profile.controller.js');
    const verifyJWTOptional = require('../middleware/verifyJWTOptional');

    // Get profile - authentication optional
    app.get('/:username', verifyJWTOptional, profileController.getProfile);
}