module.exports = (app) => {
    
    const profileController = require('../controllers/profile.controller.js');
    const verifyJWTOptional = require('../middleware/verifyJWTOptional');
    const verifyJWT = require('../middleware/verifyJWT');

    // Get profile - authentication optional
    app.get('/:username', verifyJWTOptional, profileController.getProfile);

    // Follow a user
    app.post('/:username/follow', verifyJWT, profileController.followUser);

    // unfollow a user
    app.delete('/:username/follow', verifyJWT, profileController.unFollowUser);

    // Get user profile
    app.get('/profile/:username', verifyJWTOptional, profileController.getProfile_User);
}