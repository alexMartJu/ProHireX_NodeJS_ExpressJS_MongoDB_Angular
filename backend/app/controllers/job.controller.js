const Job = require('../models/job.model.js'); //product x job
const Category = require('../models/category.model.js');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

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
        requirements: req.body.requirements || null
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

    // let limit = transUndefined(req.query.limit, 3);
    // let offset = transUndefined(req.query.offset, 0);
    let category = transUndefined(req.query.category, "");
    let name = transUndefined(req.query.name, "");
    let price_min = transUndefined(req.query.price_min, 0);
    let price_max = transUndefined(req.query.price_max, Number.MAX_SAFE_INTEGER);
    let nameReg = new RegExp(name);
    // let favorited = transUndefined(req.query.favorited, null);

    query = {
        name: { $regex: nameReg },
        $and: [{ price: { $gte: price_min } }, { price: { $lte: price_max } }],
    };

    if (category != "") {
        query.id_cat = category;
    }

    // if (favorited) {
    //     const favoriter = await User.findOne({ username: favorited });
    //     query._id = { $in: favoriter.favorites };
    // }

    const jobs = await Job.find(query); 
    const job_count = await Job.find(query).countDocuments(); 


    if (!jobs) { 
        res.status(404).json({ msg: "Falló" });
    }

    return res.status(200).json({
        jobs: await Promise.all(jobs.map(async job => { 
            return await job.toJobResponse();
        })), job_count: job_count //
    });
});

//FIND ONE JOB
const findOneJob = asyncHandler(async (req, res) => { 

    const jobs = await Job.findOne(req.params) 

    if (!jobs) { 
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    return res.status(200).json({
        jobs: await jobs.toJobResponse()
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

    // res.json("holaaa")
    let offset = 0;
    let limit = 3;
    const slug = req.params;
    let job_count = ""; //

    const category = await Category.findOne(slug).exec();

    if (!category) {
        res.status(400).json({message: "Categoria no encontrada"});
    }


    return await res.status(200).json({
        jobs: await Promise.all(category.jobs.map(async jobId => { 
            const jobObj = await Job.findById(jobId).exec();
            return await jobObj.toJobResponse();
        })),
        job_count : job_count //
    })
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

module.exports = { 
    createJob, 
    findAllJob,
    findOneJob,
    deleteOneJob,
    GetJobsByCategory,
    updateJob
}