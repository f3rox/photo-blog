const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
        author: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        title: String,
        pic: String,
        createdAt: Date,
        likes: [String]
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('Post', PostSchema);