const Post = require('../models/posts');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const Users = require('../models/user_auth');


// Get single post
exports.getSinglePost = (req, res) => {
    // Get post
    // Get single post and populate comment field
    Post.findById(req.params.id).populate('comments').exec((err, post) => {
        if(err) {
            return res.status(500).json({
                message: 'Error getting post'
            })
        }
        res.status(200).json({
            post
        })
    }
    )
}

// Get all posts
exports.getAllPosts = (req, res) => {
    // Get posts and populate comment field
    Post.find({}).populate('comments').exec((err, posts) => {
        if(err) {
            return res.status(500).json({
                message: 'Error getting posts'
            })
        }
        res.status(200).json({
            posts
        })
    }

    )
}

// Create new post
exports.createPost = [
    body('title').trim().isLength({min:1}).withMessage('Add a title to your post!'),
    body('content').trim().isLength({min:1}).withMessage('Add content to your blog post'),
  
    async (req, res, next) => {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array(),
          data: req.body
        })
      }
      try {
        const post = new Post ({
          title: req.body.title,
          content: req.body.content,
          user: '62c49cee73dc5789993283e2',
          })
          post.save(err =>{
            if (err){
              return next(err)
            }
            console.log('message saved')
            res.status(200).json({post, token: req.user})
          })
            await Users.findOneAndUpdate(
              {_id: post.user},
              {$push: {posts: post}}
            )
          } catch(err){
            res.status(400).json({err})
          }
        }
        ];

// Edit a post GET
exports.editPostGET = (req, res) => {
    // verify jwt token
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
            authData
        } else{
            Post.findById(req.params.id, (err, post) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting post'
                    })
                }
                res.status(200).json({
                    post
                })
            })
        }
    })
}

// Edit a post POST
exports.editPost = (req, res) => {
    // verify jwt token
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            res.sendStatus(403);
            authData
            } else {
                // Validate and sanitize fields
                body('title').trim().isLength({min:1}).withMessage('Enter title').escape(),
                body('content').trim().isLength({min:1}).withMessage('Enter content').escape(),
                body('timestamp').trim().isLength({min:1}).withMessage('Enter timestamp').escape(),

                // Check for errors
                (req, res, next) => {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        res.status(400).json({
                            errors: errors.array()
                        });
                    } else {
                        next();
                    }
                }
                // Update post
                Post.findByIdAndUpdate(req.params.id, {
                    title: req.body.title,
                    content: req.body.content,
                    timestamp: req.body.formattedTimestamp,
                }, (err, post) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(post);
                    }
                }
            )}
            }
        )}
    
// Delete a post GET
exports.deletePostGET = (req, res) => {
//    Find post to be deleted
    Post.findById(req.params.id, (err, post) => {
    if(err) {
        return res.status(500).json({
            message: 'Error getting post'
        })
    }
    res.status(200).json({
        post
    })
}
)
}

// Delete a post POST
exports.deletePostPOST = (req, res) => {
    // verify jwt token
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            res.sendStatus(403);
            authData
            } else {
                // Delete post
                Post.findByIdAndRemove(req.params.id, (err, post) => {
                    if (err) {
                        res.send(err);
                        } else {
                            res.json(post);
                        }
                    }
                )}
    }
    )}
