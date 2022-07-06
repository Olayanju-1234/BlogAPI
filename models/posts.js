const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require('luxon')



// Set up PostSchema
const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [3, 'Title must be at least 3 characters long'],
        maxLength: [50, 'Title must be less than 50 characters long']
    },
    content: {
        type: String,
        required: true,
        minLength: [1, 'Content must be at least 3 characters long'],
        maxLength: [50000, 'Content must be less than 500 characters long']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments : [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
        }],
    timestamp: {
        type: Date,
        default: Date.now}
})

// Format timestamp with luxon
PostSchema.virtual('formattedTimestamp').get(function() {
    return DateTime.fromJSDate(this.timestamp).toFormat('LLLL dd, yyyy')
})


module.exports = mongoose.model('Post', PostSchema)

