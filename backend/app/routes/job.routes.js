module.exports = (app) => {
    
    const jobs = require('../controllers/job.controller.js');
    const verifyJWT = require('../middleware/verifyJWT');
    const verifyJWTOptional = require('../middleware/verifyJWTOptional');

    // Create
    app.post('/jobs', jobs.createJob);

    //GET ALL
    app.get('/jobs', verifyJWTOptional, jobs.findAllJob); 

    //GET ONE
    app.get('/jobs/:slug', verifyJWTOptional, jobs.findOneJob); 

    // Delete a Note with noteId
    app.delete('/jobs/:slug', jobs.deleteOneJob);

    //Update
    app.put('/jobs/:slug', verifyJWT, jobs.updateJob); 

    //Jobs By Category
    app.get('/categories/:slug/jobs', verifyJWTOptional, jobs.GetJobsByCategory);

    //Favorite
    app.post('/:slug/favorite', verifyJWT, jobs.favouriteJob);

    //Unfavorite
    app.delete('/:slug/favorite', verifyJWT, jobs.unfavoriteJob);
}