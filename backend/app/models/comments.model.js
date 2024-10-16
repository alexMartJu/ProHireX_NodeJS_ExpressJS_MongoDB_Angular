const mongoose = require('mongoose');
const User = require("./auth.model");

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
},
    {
        timestamps: true
    });

// Este método devuelve una representación del comentario, incluyendo información sobre el autor.
// * Si el usuario está autenticado, se devuelve más información del autor (incluyendo si lo sigue o no).
// * Si el usuario no está autenticado, se devuelve una versión limitada de los datos del autor.
commentSchema.methods.toCommentResponse = async function (user) {
    // Busca al autor del comentario por su ID
    const authorObj = await User.findById(this.author).exec();
    if (user !== null) { // Si el usuario está autenticado
        return {
            id: this._id,
            body: this.body,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            author: authorObj.toProfileJSON(user)
        }
    }
    else { // Si el usuario no está autenticado
        return {
            id: this._id,
            body: this.body,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            author: authorObj.toProfileUnloggedJSON()
        }
    }
}

module.exports = mongoose.model('Comment', commentSchema);