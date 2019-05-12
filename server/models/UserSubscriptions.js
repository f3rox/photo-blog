const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSubscriptionsSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        subscriptions: [String]
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('UserSubscriptions', UserSubscriptionsSchema);