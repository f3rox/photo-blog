const mongoose = require('mongoose');
const Post = require('../models/Post');
const UserSubscriptions = require('../models/UserSubscriptions');
const config = require('../../config.json');

module.exports = {
    // Установить соединение
    setUpConnection: function () {
        return mongoose.connect(config.mongodb.url, {useNewUrlParser: true, useUnifiedTopology: true});
    },
    // Создать пост
    createPost: function (data) {
        const post = new Post({
            author: data.author,
            title: data.title,
            text: data.text,
            pic: data.image,
            createdAt: Date.now()
        });
        return post.save();
    },
    // Получить все посты
    getAllPosts: function () {
        return Post.find();
    },
    // Удалить пост по id
    deletePost: function (id) {
        return Post.findById(id).deleteOne();
    },
    // Лайк
    putLike: function (id, username) {
        return Post.findById(id)
            .then(post => {
                const index = post.likes.indexOf(username);
                if (index >= 0) post.likes.splice(index, 1);
                else post.likes.push(username);
                return post.save();
            });
    },
    // Удалить все посты
    deleteAllPosts: function () {
        return Post.find().deleteMany();
    },
    // Обновить пост
    updatePost: function (id, title, text) {
        return Post.findById(id)
            .then(post => {
                post.title = title;
                post.text = text;
                return post.save();
            });
    },
    // Подписка
    subscribeUser: function (whoUsername, targetUsername) {
        return UserSubscriptions.findOne({username: whoUsername})
            .then(user => {
                if (user) return user;
                else {
                    const user = new UserSubscriptions({username: whoUsername});
                    return user.save();
                }
            })
            .then(user => {
                const index = user.subscriptions.indexOf(targetUsername);
                if (index >= 0) user.subscriptions.splice(index, 1);
                else user.subscriptions.push(targetUsername);
                return user.save();
            })
    },
    // Получить подписки пользователя
    getUserSubscriptions: function (username) {
        return UserSubscriptions.findOne({username: username});
    }
};