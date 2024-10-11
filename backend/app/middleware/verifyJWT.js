const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    // return res.json(authHeader);

    if (!authHeader?.startsWith('Token ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token); 

    // return res.json(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.error('Error de verificación del token:', err.message);
                return res.status(403).json({ message: 'Forbidden' });
            }
            console.log('Decoded token:', decoded);
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            console.log('Email asignado a req.userEmail:', req.userEmail);
            next();
        }
    )
};

module.exports = verifyJWT;