const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Comment Schema
const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        minLength: [1, 'Comment must be at least 3 characters long']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'}
})

module.exports = mongoose.model('Comment', CommentSchema)
