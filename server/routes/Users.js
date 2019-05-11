const express = require("express");
const users = express.Router();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const config = require('../../config.json');
const mongo = require('../database/MongoDB');

users.use(cors());
process.env.SECRET_KEY = config.auth.secretKey;

// Аутентификация
users.post('/login', (req, res) => {
    User.findOne({where: {email: req.body.email}})
        .then(user => {
            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {expiresIn: 1440});
                res.json({status: true, token: token})
            }
            else res.json({status: false, message: config.auth.wrongEmailOrPasswordMessage});
        })
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Регистрация
users.post('/register', (req, res) => {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        created: new Date()
    };
    User.findOne({where: {username: req.body.username}})
        .then(user => {
            if (user) {
                res.json({status: false, usernameErrorMessage: config.auth.usernameAlreadyExistsMessage});
                return Promise.reject();
            } else return User.findOne({where: {email: req.body.email}});
        })
        .then(user => {
            if (user) {
                res.json({status: false, emailErrorMessage: config.auth.emailAlreadyExistsMessage});
                return Promise.reject();
            } else return bcrypt.hash(req.body.password, config.auth.saltRounds);
        })
        .then(hash => {
            if (hash) {
                userData.password = hash;
                return User.create(userData);
            }
        })
        .then(user => {
            if (user) {
                res.json({status: true});
                console.log('\nNew user:\nEmail: ' + user.email + '\nUsername: ' + user.username);
            }
        })
        .catch(err => {
            if (err) {
                res.status(500).json({error: err.toString()});
                console.error(err);
            }
        })
});

// Подписка
users.post('/subscribe/:username', (req, res) => {
    mongo.subscribeUser(req.params.username, req.body.username)
        .then(user => {
            console.log('New subscription:');
            console.log(user);
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Получить данные пользователя
users.get('/:username', (req, res) => {
    User.findOne({where: {username: req.params.username}})
        .then(user => {
            if (user) res.json(user);
            else res.status(404).json({error: config.mysql.userNotFoundMessage});
        })
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Получить подписки пользователя
users.get('/subscriptions/:username', (req, res) => {
    mongo.getUserSubscriptions(req.params.username)
        .then(user => {
            if (user) res.json({subscriptions: user.subscriptions});
            else res.status(404).json({error: config.mongodb.subscriptionsNotFoundErrorMessage});
        })
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

module.exports = users;