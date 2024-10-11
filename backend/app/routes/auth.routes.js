module.exports = (app) => {
    const userController = require('../controllers/auth.controller.js');
    const verifyJWT = require('../middleware/verifyJWT');

    // Authentication
    app.post('/users/login', userController.userLogin);

    // Registration
    app.post('/users', userController.registerUser);

    // Get Current User
    app.get('/user', verifyJWT, userController.getCurrentUser);

    // Update User
    app.put('/user', verifyJWT, userController.updateUser);

    // Refresh Token
    app.post('/users/refresh-token', userController.refreshToken);

    // Logout --> Blacklist refresh token al hacer logout
    app.post('/users/logout', userController.logout);
}