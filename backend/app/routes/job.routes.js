module.exports = (app) => {
    
    const jobs = require('../controllers/job.controller.js');

    // Create
    app.post('/jobs', jobs.createJob);

    //GET ALL
    app.get('/jobs', jobs.findAllJob); 

    //GET ONE
    app.get('/jobs/:slug', jobs.findOneJob); 

    // Delete a Note with noteId
    app.delete('/jobs/:slug', jobs.deleteOneJob);

    //Update
    app.put('/jobs/:slug', jobs.updateJob); 

    //Jobs By Category
    app.get('/categories/:slug/jobs', jobs.GetJobsByCategory);
}