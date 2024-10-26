const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const { log } = require('console');
const User = require('../models/auth.model.js');

const JobSchema = mongoose.Schema({
    slug: { 
        type: String, 
        lowercase: true, 
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [],
    img: {
        type: String,
        required: true
    },
    id_cat: { 
        type: String,
        required: true
    },
    company_name: {  
        type: String,
        required: true
    },
    published_at: {  
        type: Date,
        default: Date.now
    },
    location: {  
        type: String,
        required: true
    },
    requirements: { 
        type: String,
        required: true 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    state: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'], // Valores permitidos
        default: 'pending', // Valor por defecto
        required: true
    }
});


JobSchema.plugin(uniqueValidator, { msg: "already taken" }); 

JobSchema.pre('validate',  async function (next) { 
    if (!this.slug) {
        console.log('dentro del if');
        await this.slugify();
    }
    console.log(this.slug);  
    next();
});

JobSchema.methods.slugify = async function () { 
    this.slug = slugify(this.name) + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};

JobSchema.methods.toJobResponse = async function  (user) { 

    const authorObj = await User.findById(this.author).exec();

    if (user !== null) {
        // return "hay usuario"
        return {
            slug: this.slug,
            name : this.name,
            price: this.price,
            description: this.description,
            id_cat : this.id_cat,
            img : this.img,
            images: this.images,
            company_name: this.company_name,    
            published_at: this.published_at,    
            location: this.location,
            requirements: this.requirements,
            favorited: user ? user.isFavorite(this._id) : false,
            favoritesCount: this.favoritesCount,
            author: authorObj ? authorObj.toProfileJSON(user) : null,
            state: this.state
        }
    } else {
        // return "no hay usuario"
        return {
            slug: this.slug,
            name : this.name,
            price: this.price,
            description: this.description,
            id_cat : this.id_cat,
            img : this.img,
            images: this.images,
            company_name: this.company_name,    
            published_at: this.published_at,    
            location: this.location,
            requirements: this.requirements,
            favorited: false,
            favoritesCount: this.favoritesCount,
            author:  authorObj ? authorObj.toProfileJSON(user) : null,
            state: this.state
            
        }
    }
}

JobSchema.methods.toJobCarouselResponse = async function () { 
    return {
        images: this.images
    }
}

// Añadir un comentario al trabajo
JobSchema.methods.addComment = function (commentId) { 
    // Si el comentario no está ya en la lista de comentarios, lo añade
    if(this.comments.indexOf(commentId) === -1){
        this.comments.push(commentId); // Añadir el ID del comentario a la lista
    }
    return this.save(); // Guardar los cambios en la base de datos
};

// Eliminar un comentario del trabajo
JobSchema.methods.removeComment = function (commentId) {
    // Si el comentario está en la lista de comentarios, lo elimina
    if(this.comments.indexOf(commentId) !== -1){
        this.comments.remove(commentId); // Eliminar el ID del comentario de la lista
    }
    return this.save(); // Guardar los cambios en la base de datos
};

// Actualizar el contador de favoritos del trabajo
JobSchema.methods.updateFavoriteCount = async function () {
    // Cuenta cuántos usuarios han añadido este trabajo a su lista de favoritos
    const favoriteCount = await User.count({
        favouriteJobs: {$in: [this._id]} // Busca usuarios que tengan este trabajo en su lista de favoritos
    });

    this.favoritesCount = favoriteCount; // Actualiza el número de favoritos del trabajo

    return this.save(); // Guardar los cambios en la base de datos
}

module.exports = mongoose.model('Job', JobSchema); 