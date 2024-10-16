const Job = require('../models/job.model');
const User = require('../models/auth.model');
const Comment = require('../models/comments.model');
const asyncHandler = require('express-async-handler');

// addCommentsToJob --> Un usuario autenticado (commenter) añade un comentario a un trabajo identificado por 'slug'.
// El comentario se guarda en la base de datos y se asocia con el trabajo y el autor. 
// Se devuelve la respuesta del comentario creado.
const addCommentsToJob = asyncHandler(async (req, res) => {
    console.log("Entro aqui");
    const id = req.userId; // ID del usuario autenticado
    // return res.json(id)

    const commenter = await User.findById(id).exec(); // Buscar al usuario por ID
    // return res.json(commenter)
    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    const { slug } = req.params; // 'slug' del trabajo
    // console.log(`the slug is ${slug}`)

    const job = await Job.findOne({slug}).exec(); // Buscar el trabajo por 'slug'
    // return res.json(job)
    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    var body = req.body.comment.body; // Obtener el cuerpo del comentario desde el request
    // return res.json(body.body)
    const newComment = await Comment.create({
        body: body,
        author: commenter._id, // Asociar el comentario al usuario que lo creó
        job: job._id           // Asociar el comentario al trabajo
    });
    await job.addComment(newComment._id); // Añadir el comentario al trabajo

    return res.status(200).json({
        comment: await newComment.toCommentResponse(commenter) // Devolver el comentario en el formato de respuesta
    })
});


// getCommentsFromJob --> Recupera todos los comentarios asociados a un trabajo identificado por 'slug'.
// Si el usuario está autenticado, se devuelve la información completa del comentario, incluyendo 
// si el usuario sigue al autor del comentario. Si no está autenticado, se devuelve una versión simplificada.
const getCommentsFromJob = asyncHandler(async (req, res) => {
    // return req.params;
    const { slug } = req.params; // 'slug' del trabajo

    const job = await Job.findOne({slug}).exec(); // Buscar el trabajo por 'slug'
    // return res.json(job)

    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }

    const loggedin = req.loggedin; // Verificar si el usuario está autenticado
    // return res.json(loggedin)

    if (loggedin) {
        const loginUser = await User.findById(req.userId).exec(); // Buscar al usuario autenticado
        // return res.json(loginUser);
        return await res.status(200).json({
            comments: await Promise.all(job.comments.map(async commentId => {
                // return await res.json(comments);
                const commentObj = await Comment.findById(commentId).exec(); // Buscar cada comentario por ID
                // return res.json(commentObj);
                return await commentObj.toCommentResponse(loginUser); // Devolver el comentario con la información del usuario autenticado
            }))
        })
    } else {
        // return res.json("not logged")
        return await res.status(200).json({
            comments: await Promise.all(job.comments.map(async (commentId) => {
                const commentObj = await Comment.findById(commentId).exec();
                // return res.json(commentObj)
                // console.log(commentObj);
                const temp =  await commentObj.toCommentResponse(null); // Devolver el comentario sin la información del usuario
                // console.log(temp);
                return temp;
            }))
        })
    }
});


// deleteComment -->  Un usuario autenticado puede eliminar un comentario que haya hecho previamente
// en un trabajo identificado por 'slug'.
// Solo el autor del comentario tiene permiso para eliminarlo.
const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.userId; // ID del usuario autenticado

    const commenter = await User.findById(userId).exec();  // Buscar al usuario por ID

    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    const { slug, id } = req.params; // 'slug' del trabajo y 'id' del comentario

    const job = await Job.findOne({slug}).exec(); // Buscar el trabajo por 'slug'

    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }

    const comment = await Comment.findById(id).exec(); // Buscar el comentario por ID

    // console.log(`comment author id: ${comment.author}`);
    // console.log(`commenter id: ${commenter._id}`)

    // Verificar que el autor del comentario es el mismo que el usuario autenticado
    if (comment.author.toString() === commenter._id.toString()) {
        await job.removeComment(comment._id); // Eliminar el comentario del trabajo
        await Comment.deleteOne({ _id: comment._id }); // Eliminar el comentario de la base de datos
        return res.status(200).json({
            message: "Comment has been successfully deleted!"
        });
    } else {
        return res.status(403).json({
            error: "Only the author of the comment can delete the comment"
        })
    }
});

module.exports = {
    addCommentsToJob,
    getCommentsFromJob,
    deleteComment
}