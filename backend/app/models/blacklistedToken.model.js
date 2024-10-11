const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true, // Cada token en la blacklist debe ser único
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de usuario
        required: true,
    },
}, {
    timestamps: true // Guarda la fecha de creación y actualización
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
