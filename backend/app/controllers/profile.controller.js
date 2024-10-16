const User = require('../models/auth.model');
const asyncHandler = require('express-async-handler');
const Job = require('../models/job.model')

const getProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const loggedin = req.loggedin;

    // console.log(`print out username ${username}`)
    const user = await User.findOne({ username }).exec();

    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    if (!loggedin) {
        return res.status(200).json({
            profile: user.toProfileJSON(false)
        });
    } else {
        const loginUser = await User.findOne({ email: req.userEmail }).exec();
        return res.status(200).json({
            profile: user.toProfileJSON(loginUser)
        })
    }

});

// followUser --> El usuario actualmente autenticado (loginUser) comienza a seguir a otro usuario identificado por 'username'.
// Actualiza tanto los registros del seguidor como del usuario seguido, y devuelve el perfil actualizado del usuario seguido.
const followUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    // return res.json(req.params);

    const loginUser = await User.findOne({ email: req.userEmail }).exec();
    const user = await User.findOne({ username }).exec();

    console.log('Login User:', loginUser); // Log para verificar el loginUser
    console.log('User to follow:', user); // Log para verificar el user

    if (!user || !loginUser) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }

    await loginUser.follow(user._id); // Agrega al user a la lista de seguidos de loginUser
    await user.addFollower(loginUser._id); // Agrega a loginUser a la lista de seguidores del user

    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    })

});

// unfollowUser --> El usuario actualmente autenticado (loginUser) deja de seguir a otro usuario identificado por 'username'.
// Actualiza tanto los registros del seguidor como del usuario dejado de seguir, y devuelve el perfil actualizado del usuario dejado de seguir
const unFollowUser = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const loginUser = await User.findOne({ email: req.userEmail }).exec();
    const user = await User.findOne({ username }).exec();

    if (!user || !loginUser) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    await loginUser.unfollow(user._id); // Elimina al user de la lista de seguidos de loginUser
    await user.removeFollower(loginUser._id); // Elimina a loginUser de la lista de seguidores del user

    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    })

});

// getProfile_User --> Obtener el perfil de un usuario: Recupera el perfil de un usuario identificado por 'username', junto con 
// información sobre sus seguidores, usuarios que sigue y los trabajos asociados. 
// También verifica si el usuario autenticado sigue al usuario objetivo.
const getProfile_User = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user_logged = await User.findOne({ "email": req.userEmail })

    const user = await User.findOne({ username }).exec();

    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        })
    }

    const followers = await User.find({ followingUsers: { $in: [user._id] } })
    .select('username bio image -_id')
    .exec();

    const number_followers = followers.length;

    const follows = await User.find({ followersUsers: { $in: [user._id] } })
    .select('username bio image')
    .exec();

    const number_follows = follows.length;

    const jobs = await Job.find({ "author": user._id }).select('-_id -author').exec();

    // Obtener los trabajos favoritos
    const favouriteJobs = await Job.find({ _id: { $in: user.favouriteJobs } });

    // return res.json(jobs)
    return res.json({
        profile: user.toSeeProfileUser(user_logged,followers,number_followers,follows,number_follows,jobs, favouriteJobs)
    })
});

module.exports = {
    getProfile,
    followUser,
    unFollowUser,
    getProfile_User
}
