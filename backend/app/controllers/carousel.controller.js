const Category = require("../models/category.model.js");
const Job = require("../models/job.model.js");
const asyncHandler = require('express-async-handler');

//CATEGORIAS
const get_carousel_category = asyncHandler( async (req, res) => {

    const categories = await Category.find();

    if (!categories) {
        return res.status(401).json({
        message: "Categories not found"
        })
    }
    return res.status(200).json({
        categories: await Promise.all(categories.map( async categories => {
            return await categories.toCategoryCarouselResponse()
        }))
});
});

//TRABAJOS
const get_carousel_job = asyncHandler(async (req, res) => {
    const jobs = await Job.findOne(req.params)
    if (!jobs) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    return res.status(200).json({
        jobs: await jobs.toJobCarouselResponse()
    })
});

module.exports = {
    get_carousel_job,
    get_carousel_category
}