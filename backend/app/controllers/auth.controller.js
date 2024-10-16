const User = require('../models/auth.model');
const asyncHandler = require('express-async-handler');
const argon2 = require('argon2');
const RefreshToken = require('../models/refreshToken.model');
const BlacklistedToken = require('../models/blacklistedToken.model');
const jwt = require("jsonwebtoken");

// @desc registration for a user
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // return res.json(user);
    // confirm data
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    // hash password
    const hashedPwd = await argon2.hash(user.password, 10); // salt rounds

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };

    const createdUser = await User.create(userObject);

    if (createdUser) { // user object created successfully
        res.status(201).json({
            user: createdUser.toUserResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user"
            }
        });
    }
});


// @desc login for a user
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const loginUser = await User.findOne({ email: user.email }).exec();

    // console.log(loginUser);

    if (!loginUser) {
        return res.status(404).json({message: "User Not Found"});
    }

    const match = await argon2.verify(loginUser.password, user.password);

    if (!match) return res.status(401).json({ message: 'Unauthorized: Wrong password' })

    // Invalida los Refresh Tokens antiguos
    await RefreshToken.deleteMany({ userId: loginUser._id }); // Elimina tokens anteriores

    // Generar un nuevo Refresh Token
    const newRefreshToken = jwt.sign(
        { id: loginUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '2d' }
    );

    // Guardar el nuevo Refresh Token en la base de datos
    await RefreshToken.create({ token: newRefreshToken, userId: loginUser._id });

    // Generar un nuevo Access Token
    const newAccessToken = jwt.sign(
        { user: { id: loginUser._id, email: loginUser.email, password: loginUser.password } }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
    );


    res.status(200).json({
        user: loginUser.toUserResponse(newAccessToken, newRefreshToken)
    });

});

// @desc get currently logged-in user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
    // After authentication; email and hashsed password was stored in req
    const email = req.userEmail;
    console.log('Email recibido en getCurrentUser:', email);

    const user = await User.findOne({ email }).exec();

    if (!user) {
        console.log('Usuario no encontrado con el email:', email);
        return res.status(404).json({message: "User Not Found"});
    }

    res.status(200).json({
        user: user.toUserResponse()
    })

});

// @desc update currently logged-in user
// Warning: if password or email is updated, client-side must update the token
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.status(400).json({message: "Required a User object"});
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPwd = await argon2.hash(user.password, 10);
        target.password = hashedPwd;
    }
    if (typeof user.image !== 'undefined') {
        target.image = user.image;
    }
    if (typeof user.bio !== 'undefined') {
        target.bio = user.bio;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });

});

//Refrescamos access token si refresh aun esta activo, si no esta activo se ñade a la blacklist.
const refreshToken = asyncHandler(async (req, res) => {
    const { token } = req.body;  // El refresh token se envía desde el cliente

    console.log('Token from client:', token);

    // Verificar si el refresh token está en la blacklist
    const blacklisted = await BlacklistedToken.findOne({ token }).exec();
    if (blacklisted) {
        console.error('Token has been blacklisted:', token);
        return res.status(403).json({ message: 'Token has been blacklisted' });
    }

    // Verificar si el refresh token es válido
    const foundToken = await RefreshToken.findOne({ token }).exec();
    if (!foundToken) {
        console.error('Invalid refresh token:', token);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verificar si el refresh token ha caducado o es válido
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            // Si el refresh token ha caducado, agregarlo a la blacklist y forzar logout
            console.error('Refresh token has expired:', token);
            await BlacklistedToken.create({ token, userId: foundToken.userId });
            return res.status(403).json({ message: 'Refresh token has expired. Please log in again.' });
        }

        // Recuperar el usuario de la base de datos usando el userId
        const user = await User.findById(foundToken.userId).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Si el refresh token es válido, generar un nuevo access token
        const newAccessToken = jwt.sign(
            { user: { id: user._id, email: user.email, password: user.password } }, // Aquí incluimos `user`
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            accessToken: newAccessToken,  // Devolver solo el nuevo access token
        });
    });
});

// @desc logout user and blacklist refresh token
// @access Private
// @required fields {token}
// @return Success Message
const logout = asyncHandler(async (req, res) => {
    const { token } = req.body;  // El refresh token se envía desde el cliente

    if (!token) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Buscar el token en la base de datos de refresh tokens
    const foundToken = await RefreshToken.findOne({ token }).exec();
    if (!foundToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Agregar el refresh token a la blacklist
    await BlacklistedToken.create({ token, userId: foundToken.userId });

    // Responder con éxito
    res.status(200).json({ message: 'Logged out successfully and token blacklisted' });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    refreshToken,
    logout
}