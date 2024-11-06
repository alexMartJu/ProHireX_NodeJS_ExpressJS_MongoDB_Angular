module.exports = (app) => {
    const application = require('../controllers/application.controller');
    const verifyJWT = require('../middleware/verifyJWT');

    // Ruta para aplicar a una oferta
    app.post('/apply', verifyJWT, application.applyToJob);
    app.get('/hasUserApplied/ch', verifyJWT, application.hasUserApplied);
};