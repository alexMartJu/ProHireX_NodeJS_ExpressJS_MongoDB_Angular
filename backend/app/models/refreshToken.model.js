const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true, // Cada token debe ser único
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de usuario
        required: true,
    },
}, {
    timestamps: true // Guarda la fecha de creación y actualización
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
