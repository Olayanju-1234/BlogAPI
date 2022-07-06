const Comments = require('../models/comments')
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const Posts = require('../models/posts')

// Get all comments on a post GET
exports.getAllComments = (req, res) => {
    // Get all comments
    Comments.find({}, (err, comments) => {
        if(err) {
            return res.status(500).json({
                message: 'Error getting comments'
            })
        }
        res.status(200).json({
            comments
        })
    }
    ).populate('postId')
}

// Get a single comment
exports.getComment = (req, res, next) => {
    // Get a single comment
    Comments.findById(req.params.commentid, (err, comment) => {
        if(err) {
            return res.status(500).json({
                message: 'Error getting comment'
            })
        }
        res.status(200).json({
            comment
        })
    }
    ).populate('postId')
}

exports.addComment = [
    // Validate and sanitize fields
    body('comment').trim().isLength({min:1}).withMessage('Enter comment').escape(),

    async (req, res, next) => {
        // Check for errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                data: req.body
            });
        }
        try{
            // Create new comment
            const comment = new Comments({
                comment: req.body.comment,
                postId: req.params.postid
            })
            
            comment.save((err, comment) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error creating comment',
                        err
                    })
                }
                res.status(200).json({
                    comment  })

            })
            await Posts.findByIdAndUpdate(
                {_id: '62c55fac4baff3afd3016e38'},
                {$push: {comments: comment}},
            
            )}  catch(err) {
                return res.status(500).json({
                    message: 'Error adding comment to post',
                    err
                })
            }

        }
]

// Edit comment
exports.editComment = (req, res) => {
    //  edit comment
    Comments.findByIdAndUpdate(req.params.commentid, {$set: {comment: req.body.comment}}, (err, comment) => {
        if(err) {
            return res.status(500).json({
                message: 'Error editing comment'
            })
        }
        res.status(200).json({
            comment
        })
    }
        
    ).populate('postId')
}

// Delete comments on a post
exports.deleteAllComments = (req, res) => {
    // Delete all comments on a post
    Comments.deleteMany({postId: req.params.postid}, (err, comment) => {
        if(err) {
            return res.status(500).json({
                message: 'Error deleting comments'
            })
        }
        res.status(200).json({
            comment
        })
    }
    )

}

// Delete a single comment
exports.deleteComment = (req, res) => {
    // delete a single comment
    Comments.findByIdAndDelete(req.params.commentid, (err, comment) => {
        if(err) {
            return res.status(500).json({
                message: 'Error deleting comment'
            })
        }
        res.status(200).json({
            comment
        })
    }
    )
}