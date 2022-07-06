const express = require('express')
const router = express.Router()
const post_controller = require('../controllers/postsController')
const comment_controller = require('../controllers/commentsController')
const auth_controller = require('../controllers/authController')
const verifyToken = require('../auth/jwt')


// Get a single post
router.get('/posts/:id', post_controller.getSinglePost)

// Get all POSTS route
router.get('/posts', post_controller.getAllPosts)

// Create new post
router.post('/posts/create', verifyToken.verifyToken, post_controller.createPost)

router.get('/user/posts', auth_controller.usersPosts)
// update post get
router.get('/posts/update/:id', verifyToken.verifyToken, post_controller.editPostGET)

// Update post
router.put('/posts/update/:id', verifyToken.verifyToken, post_controller.editPost)

// Delete a post GET
router.get('/posts/delete/:id', post_controller.deletePostGET)

// Delete a post
router.delete('/posts/delete/:id',verifyToken.verifyToken, post_controller.deletePostPOST)



// Get all comment
router.get('/posts/:postid/comments', comment_controller.getAllComments)

// Add a new comment
router.post('/posts/:postid/comments', verifyToken.verifyToken, comment_controller.addComment)

// Get a single comment
router.get('/posts/:postid/comments/:commentid', comment_controller.getComment)

// Edit comment
router.put('/posts/:postid/comments/:commentid', comment_controller.editComment)

// Delete all comments on a post
router.delete('/posts/:postid/:commentid', comment_controller.deleteAllComments)

// Delete a single comment
router.delete('/posts/:postid/comments/:commentid', comment_controller.deleteComment)

// Login
router.post('/login', auth_controller.login)

// Logout
router.post('/logout', auth_controller.logout)

// Signup
router.post('/signup', auth_controller.signup)

module.exports = router;