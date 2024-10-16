const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require("jsonwebtoken");
const crypto = require('crypto'); 

const userSchema = new mongoose.Schema({
    uuid: { 
        type: String, 
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    favouriteJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followersUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true
});

userSchema.plugin(uniqueValidator);

// Generar el uuid antes de validar el esquema
userSchema.pre('validate', async function (next) {
    if (!this.uuid) {
        console.log('Generando UUID...');
        this.uuid = crypto.randomUUID(); 
    }
    // console.log(this.uuid);
    next();
});

userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
    );
    return accessToken;
}

userSchema.methods.toUserResponse = function(accessToken = '', refreshToken = '') {
    return {
        uuid: this.uuid, 
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: accessToken,         
        refreshToken: refreshToken
    }
};

userSchema.methods.toProfileJSON = function (user) {
    return {
        uuid: this.uuid,
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user.isFollowing(this._id)
    };
};

userSchema.methods.toProfileUnloggedJSON = function () {
    return {
        uuid: this.uuid,
        username: this.username,
        bio: this.bio,
        image: this.image
    }
};

//-------------------FOLLOWS-------------------

// Verifica si el usuario actual está siguiendo a otro usuario por su ID.
userSchema.methods.isFollowing = function (id) {
    const idStr = id.toString();
    for (const followingUser of this.followingUsers) {
        if (followingUser.toString() === idStr) {
            return true; // El usuario está siendo seguido
        }
    }
    return false; // El usuario no está siendo seguido
};

// Añade a otro usuario a la lista de usuarios seguidos (followingUsers) si aún no lo está siguiendo.
userSchema.methods.follow = function (id) {
    if(this.followingUsers.indexOf(id) === -1){
        this.followingUsers.push(id); // Añadir el ID del usuario a la lista de seguidos
    }
    return this.save(); // Guardar los cambios en la base de datos
};

// Elimina a otro usuario de la lista de usuarios seguidos (followingUsers) si está siendo seguido.
userSchema.methods.unfollow = function (id) {
    if(this.followingUsers.indexOf(id) !== -1){
        this.followingUsers.remove(id); // Eliminar el ID del usuario de la lista de seguidos
    }
    return this.save(); // Guardar los cambios en la base de datos
};

// Añade al usuario actual a la lista de seguidores (followersUsers) del otro usuario si aún no lo sigue.
userSchema.methods.addFollower = function (id) {
    if(this.followersUsers.indexOf(id) === -1){
        this.followersUsers.push(id); // Añadir el ID del usuario a la lista de seguidores
    }
    return this.save(); // Guardar los cambios en la base de datos
};

// Elimina al usuario actual de la lista de seguidores (followersUsers) del otro usuario.
userSchema.methods.removeFollower = function (id) {
    if(this.followersUsers.indexOf(id) !== -1){
        this.followersUsers.remove(id); // Eliminar el ID del usuario de la lista de seguidores
    }
    return this.save();  // Guardar los cambios en la base de datos
};


//-------------------FAVORITES-------------------

// Verifica si el usuario actual ha marcado un trabajo como favorito por su ID.
userSchema.methods.isFavorite = function (id) {
    const idStr = id.toString();
    for (const job of this.favouriteJobs) {
        if (job.toString() === idStr) {
            return true; // El trabajo está en la lista de favoritos
        }
    }
    return false; // El trabajo no está en la lista de favoritos
}

// Añade un trabajo a la lista de favoritos del usuario si aún no lo ha añadido.
userSchema.methods.favorite = function (id) {
    if(this.favouriteJobs.indexOf(id) === -1){
        this.favouriteJobs.push(id); // Añadir el ID del trabajo a la lista de favoritos
    }
    return this.save(); // Guardar los cambios en la base de datos
}

// Elimina un trabajo de la lista de favoritos del usuario si está marcado como favorito.
userSchema.methods.unfavorite = function (id) {
    if(this.favouriteJobs.indexOf(id) !== -1){
        this.favouriteJobs.remove(id); // Eliminar el ID del trabajo de la lista de favoritos
    }
    return this.save(); // Guardar los cambios en la base de datos
};

// Método para ver el perfil de un usuario, dependiendo de si el usuario está autenticado (user_logged) o no.
// Devuelve un objeto con los detalles del perfil, como los seguidores, seguidos, trabajos, etc.
userSchema.methods.toSeeProfileUser = function (user_logged,followers,n_followers,follows,n_follows,jobs, favouriteJobs) {
    if (user_logged){
        return {
            username: this.username,
            bio: this.bio,
            image: this.image,
            followers: followers,
            n_followers: n_followers,
            follows: follows,
            n_follows: n_follows,
            following: user_logged.isFollowing(this._id),
            jobs: jobs,
            favouriteJobs: favouriteJobs
        }
    } else {
        return {
            username: this.username,
            bio: this.bio,
            image: this.image,
            followers: followers,
            n_followers: n_followers,
            follows: follows,
            n_follows: n_follows,
            following: false,
            jobs: jobs,
            favouriteJobs: favouriteJobs
        }
    }
};

module.exports = mongoose.model('User', userSchema);
