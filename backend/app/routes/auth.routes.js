module.exports = (app) => {
    const userController = require('../controllers/auth.controller.js');

    // Authentication
    app.post('/users/login', userController.userLogin);

    // Registration
    app.post('/users', userController.registerUser);

    // Get Current User
    app.get('/user', userController.getCurrentUser);

    // Update User
    app.put('/user', userController.updateUser);
}