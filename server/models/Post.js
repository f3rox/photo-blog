const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
        author: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        pic: {
            type: String,
            required: true
        },
        text: String,
        createdAt: Date,
        likes: [String]
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('Post', PostSchema);