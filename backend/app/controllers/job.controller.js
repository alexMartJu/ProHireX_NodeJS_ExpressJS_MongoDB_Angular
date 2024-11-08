const Job = require('../models/job.model.js'); 
const Category = require('../models/category.model.js');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require('../models/auth.model.js');

// CREATE JOB
const createJob = asyncHandler(async (req, res) => { //

    const jobData = {
        name: req.body.name || null,
        price: req.body.price || 0,
        description: req.body.description || null,
        images: req.body.images,
        img: req.body.img || null,
        id_cat: req.body.id_cat || null,
        company_name: req.body.company_name || null,  
        published_at: req.body.published_at || Date.now(),  
        location: req.body.location || null,
        requirements: req.body.requirements || null,
        state: req.body.state || 'pending'
    };

    const id_cat = req.body.id_cat;
    
    const category = await Category.findOne({id_cat}).exec();

    if (!category) {
        res.status(400).json({message: "Ha ocurrido un error al buscar la categoria"});
    }

    const nuevoJob = await new Job(jobData); 
    await nuevoJob.save(); 

    if (!nuevoJob) { 
        res.status(400).json({message: "Ha ocurrido un error"});
    }

    await category.addJob(nuevoJob._id); 

    return res.status(200).json({
        job: await nuevoJob.toJobResponse() 
    })
});

//FIND ALL JOB
const findAllJob = asyncHandler(async (req, res) => { //

    let query = {};
    let transUndefined = (varQuery, otherResult) => {
        return varQuery != "undefined" && varQuery ? varQuery : otherResult;
    };

    let limit = transUndefined(req.query.limit, 3);
    let offset = transUndefined(req.query.offset, 0);
    let category = transUndefined(req.query.category, "");
    let name = transUndefined(req.query.name, "");
    let price_min = transUndefined(req.query.price_min, 0);
    let price_max = transUndefined(req.query.price_max, Number.MAX_SAFE_INTEGER);
    let nameReg = new RegExp(name);
    let favorited = transUndefined(req.query.favorited, null);
    // let favorited = transUndefined(req.query.favorited, null);

    query = {
        name: { $regex: nameReg },
        state: 'accepted',
        $and: [{ price: { $gte: price_min } }, { price: { $lte: price_max } }],
    };

    if (category != "") {
        query.id_cat = category;
    }

    if (favorited) {
        const favoriter = await User.findOne({ username: favorited });
        query._id = { $in: favoriter.favorites };
    }

    const jobs = await Job.find(query).limit(Number(limit)).skip(Number(offset)); 
    const job_count = await Job.find(query).countDocuments(); 


    if (!jobs) { 
        res.status(404).json({ msg: "Falló" });
    }

    const user = await User.findById(req.userId);

    return res.status(200).json({
        jobs: await Promise.all(jobs.map(async job => { 
            return await job.toJobResponse(user);
        })), job_count: job_count 
    });
});

//FIND ONE JOB
const findOneJob = asyncHandler(async (req, res) => { 

    const jobs = await Job.findOne(req.params) 
    const user = await User.findById(req.userId);

    if (!jobs) { 
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    return res.status(200).json({
        jobs: await jobs.toJobResponse(user)
    })
});

//DELETE ONE
const deleteOneJob = asyncHandler(async (req, res) => { 
    // return res.json("holaaa");
    const slug = req.params;

    // res.send(slug);
    const job = await Job.findOne(slug).exec(); 
    // res.send(job);
    if (!job) {
        res.status(400).json({message: "Job no encontrado"});
    }

    const id_cat = job.id_cat 
    // res.send(id_cat);
    const category = await Category.findOne({id_cat}).exec();

    if (!category) {
        res.status(400).json({message: "Ha ocurrido un error"});
    }

    await Job.deleteOne({ _id: job._id }); 
    await category.removeJob(job._id) 
    return res.status(200).json({
        message: "Job eliminado" 
    });
});

// JOBS BY CATEGORY
const GetJobsByCategory = asyncHandler(async (req, res) => {
    let offset = parseInt(req.query.offset) || 0;  // Offset que se envía desde el frontend
    let limit = parseInt(req.query.limit) || 3;    // Limite de productos por página
    const slug = req.params.slug;

    const category = await Category.findOne({ slug: slug }).exec();

    if (!category) {
        return res.status(400).json({ message: "Categoría no encontrada" });
    }

    // Verificar los trabajos asociados a la categoría
    console.log("Trabajos asociados a la categoría:", category.jobs);

    // Filtrar trabajos por 'id_cat' y estado 'accepted'
    const job_count = await Job.countDocuments({
        id_cat: category.id_cat, // Usamos id_cat de la categoría
        state: 'accepted'
    });

    // Consultar trabajos con estado 'accepted' y el id_cat de la categoría
    const jobs = await Job.find({
        id_cat: category.id_cat, // Usamos id_cat de la categoría
        state: 'accepted'
    })
    .skip(offset)
    .limit(limit)
    .exec();


    const user = await User.findById(req.userId);

    const jobResponses = await Promise.all(jobs.map(async (jobObj) => {
        return await jobObj.toJobResponse(user); 
    }));

    return res.status(200).json({
        jobs: jobResponses,
        job_count: job_count  // Enviamos el total de trabajos
    });
});

// UPDATE JOB
const updateJob = asyncHandler(async (req, res) => { 

    const  job  = req.body; 
    const { slug } = req.params;

    const target = await Job.findOne({ slug }).exec(); 

    if (job.name) { 
        target.name = job.name; 
    }
    if (job.description) { 
        target.description = job.description; 
    }
    if (job.price) { 
        target.price = job.price; 
    }
    if (job.company_name) {  
        target.company_name = job.company_name;
    }
    if (job.location) {  
        target.location = job.location;
    }
    if (job.published_at) {  
        target.published_at = job.published_at;
    }
    if (job.requirements) { 
        target.requirements = job.requirements;
    }

    await target.save();
    return res.status(200).json({
        article: await target.toJobResponse()
    })
});

// favouriteJob --> El usuario autenticado (loginUser) añade un trabajo identificado por 'slug' a su lista de trabajos favoritos.
// Después de marcarlo como favorito, se actualiza el contador de favoritos del trabajo y 
// se devuelve la respuesta del trabajo actualizado.
const favouriteJob = asyncHandler(async (req, res) => {
    const id = req.userId; // ID del usuario autenticado

    const { slug } = req.params; // 'slug' del trabajo

    const loginUser = await User.findById(id).exec(); // Buscar al usuario por ID

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const job = await Job.findOne({slug}).exec(); // Buscar el trabajo por 'slug'

    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    // console.log(`job info ${job}`);

    await loginUser.favorite(job._id); // Añadir el trabajo a la lista de favoritos del usuario

    const updatedJob = await job.updateFavoriteCount(); // Actualizar el contador de favoritos del trabajo

    return res.status(200).json({
        job: await updatedJob.toJobResponse(loginUser) // Devolver el trabajo actualizado con la información de favoritos
    });
});

// unfavoriteJob --> El usuario autenticado (loginUser) elimina un trabajo identificado por 'slug' de su lista de trabajos favoritos.
// Después de eliminarlo de favoritos, se actualiza el contador de favoritos del trabajo y 
// se devuelve la respuesta del trabajo actualizado.
const unfavoriteJob = asyncHandler(async (req, res) => {
    const id = req.userId; // ID del usuario autenticado

    const { slug } = req.params; // 'slug' del trabajo

    const loginUser = await User.findById(id).exec(); // Buscar al usuario por ID

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const job = await Job.findOne({slug}).exec(); // Buscar el trabajo por 'slug'

    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }

    await loginUser.unfavorite(job._id); // Eliminar el trabajo de la lista de favoritos del usuario

    await job.updateFavoriteCount(); // Actualizar el contador de favoritos del trabajo

    return res.status(200).json({
        job: await job.toJobResponse(loginUser) // Devolver el trabajo actualizado con la información de favoritos
    });
});

// GET JOB DETAILS BY ID
const getJobDetailsToApplicationAdmin = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    // Busca el trabajo por slug
    const job = await Job.findOne({ slug }).exec();

    if (!job) {
        return res.status(404).json({
            message: "Job Not Found"
        });
    }

    // Devuelve la respuesta del trabajo
    return res.status(200).json({
        job: await job.toJobResponse() // No necesitas el usuario en este contexto
    });
});


module.exports = { 
    createJob, 
    findAllJob,
    findOneJob,
    deleteOneJob,
    GetJobsByCategory,
    updateJob,
    favouriteJob,
    unfavoriteJob,
    getJobDetailsToApplicationAdmin
} 