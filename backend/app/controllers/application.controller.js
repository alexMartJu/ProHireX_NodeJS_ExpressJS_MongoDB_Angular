const axios = require('axios');
const asyncHandler = require('express-async-handler');
const User = require('../models/auth.model');

// Método para verificar si el usuario ha aplicado a un trabajo
const hasUserApplied = asyncHandler(async (req, res) => {
    console.log("entro checkif");
    const { slug } = req.query; // Obtener el slug de los parámetros de consulta

    if (!slug) {
        return res.status(400).json({ message: "slug es requerido" });
    }
    
    try {
        // Obtener el userId del token
        const userId = req.userId; // Esto se establece en el middleware verifyJWT

        console.log("userId obtenido del token:", userId);

        // Verifica que userId no esté vacío
        if (!userId) {
            return res.status(401).json({ message: "Autenticación fallida: userId no encontrado en el token" });
        }

        // Buscar el usuario en la base de datos para obtener el uuid
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userUuid = user.uuid; // Ahora tenemos el uuid
        console.log("userUuid:", userUuid);

        // Verificar si el usuario ya ha aplicado en backend2
        const response = await axios.get(`http://localhost:3017/api/application/check/aa?slug=${slug}&uuid=${userUuid}`);
        
        // Suponiendo que backend2 devuelve un objeto como { applied: true/false }
        return res.status(200).json({ applied: response.data.hasApplied });
    } catch (error) {
        console.error("Error al verificar la aplicación:", error);
        return res.status(500).json({ message: "Error al verificar la aplicación" });
    }
});

/**
 * Controlador para manejar la solicitud de aplicación a una oferta
 * Envía los datos de `slug` y `uuid` al backend de TypeORM
 */
const applyToJob = asyncHandler(async (req, res) => {
    const { slug } = req.body; 

    if (!slug) {
        return res.status(400).json({ message: "slug es requerido" });
    }

    try {
        // Obtener el userId del token
        const userId = req.userId; // Esto se establece en el middleware verifyJWT

        // Buscar el usuario en la base de datos para obtener el uuid
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userUuid = user.uuid; 

        // Enviar los datos al backend de TypeORM
        const response = await axios.post("http://localhost:3017/api/application/apply", { slug, uuid: userUuid });

        if (response.status === 201) {
            return res.status(201).json({ message: "Solicitud de aplicación procesada con éxito", application: response.data });
        } else {
            return res.status(500).json({ message: "Error al procesar la solicitud en el backend de TypeORM" });
        }
    } catch (error) {
        console.error("Error al aplicar a la oferta:", error);
        return res.status(500).json({ message: "Error al aplicar a la oferta" });
    }
});

module.exports = {
    applyToJob,
    hasUserApplied
};