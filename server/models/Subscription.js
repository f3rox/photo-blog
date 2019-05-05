const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
        username: String,
        subscriptions: [String]
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('Subscription', SubscriptionSchema);