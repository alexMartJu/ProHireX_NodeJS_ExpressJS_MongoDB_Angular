module.exports = (app) => {
    
    const verifyJWT = require('../middleware/verifyJWT');
    const verifyJWTOptional = require('../middleware/verifyJWTOptional');
    const comment = require('../controllers/comments.controller');
    
    //GET COMMENTS OF A PRODUCT
    app.get('/:slug/comments', verifyJWTOptional, comment.getCommentsFromJob);

    app.post('/:slug/comments', verifyJWT, comment.addCommentsToJob);

    app.delete('/:slug/comments/:id', verifyJWT, comment.deleteComment)

}