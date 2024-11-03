// controllers/hoots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Project = require('../models/project.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========


router.use(verifyToken); //verifies via the middleware that was given to us that the token is valid

router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const project = await Project.create(req.body);
        project._doc.author = req.user;
        res.status(201).json(project)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({}) //find all projects
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json(error);
    }
});



router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('author');
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json(error);
    }
});



router.put('/:projectId', async (req, res) => {
    try {
        // Find the project:
        const project = await Project.findById(req.params.projectId);

        // Check permissions:
        if (!project.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        // Update project:
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.projectId,
            req.body,
            { new: true }
        );

        // Append req.user to the author property:
        updatedProject._doc.author = req.user;

        // Issue JSON response:
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json(error);
    }
});



router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        //these lines verify the user's bearer token (which has the username in it) matches the auther's
        //name in the hoot. Ensures that other users are not able to update each others hoot
        //only the auther of the hoot may update their hoot
        //these lines check for that
        if (!project.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const deletedProject = await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json(deletedProject);
    } catch (error) {
        res.status(500).json(error);
    }
});



// controllers/hoots.js

router.post('/:hootId/comments', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const project = await Project.findById(req.params.projectId); //find the project you want to place a comment on
        project.comments.push(req.body); //add to the list of comments 
        await project.save(); //save that data in the database

        // Find the newly created comment:
        const newComment = project.comments[project.comments.length - 1];


        console.log(project.comments, newComment)

        //add to the auther property the req.user property
        newComment._doc.author = req.user;

        // Respond with the newComment:
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json(error);
    }
});



router.put('/:hootId/comments/:commentId', async (req, res) => {

    try {
        const project = await Project.findById(req.params.projectId); //gets the project by id
        const comment = project.comments.id(req.params.commentId); // find the specific comment from that project using the comment id 
        comment.text = req.body.text; //now that found the specific comment, we can update the text for it using the req.body.text value
        await project.save(); //save that to the DB
        res.status(200).json({ message: 'Ok' }); //return ok if okay
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:projectId/comments/:commentId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);//gets the project by id 
        project.comments.remove({ _id: req.params.commentId }); //using the commentId remove that comment
        await project.save(); //save that to the DB
        res.status(200).json({ message: 'Ok' });//return ok if okay
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
