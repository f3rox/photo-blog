const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('./database/MongoDB');
const cors = require('cors');
const privateKey = fs.readFileSync('server/https/localhost-privateKey.key', 'utf8');
const certificate = fs.readFileSync('server/https/localhost.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const catapi = require('./utils/CatAPI');
const axios = require('axios');
const app = express();
const Users = require('./routes/Users');
const config = require("../config.json");

app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/users', Users);

mongo.setUpConnection()
    .then(() => console.log(config.mongodb.successMessage))
    .catch(error => console.error(config.mongodb.errorMessage + error));

// Получить все посты
app.get('/posts', (req, res) => {
    mongo.getAllPosts()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500);
            console.error(err);
        });
});

// Добавить пост
app.post('/posts', (req, res) => {
    axios.get(config.server.url + '/cat').then(e => {
        req.body.pic = e.data;
        mongo.createPost(req.body)
            .then(post => {
                console.log('New post:');
                console.log(post);
                res.send(post)
            })
    }).catch(err => {
        res.status(500);
        console.error(err);
    });
});

// Удалить пост по id
app.delete('/posts/:id', (req, res) => {
    mongo.deletePost(req.params.id)
        .then(data => {
            console.log('Post deleted:');
            console.log(data);
            res.send(data)
        })
        .catch(err => {
            res.status(500);
            console.error(err);
        });
});

// Удалить все посты
app.delete('/posts', (req, res) => {
    if (req.body.clear === 'all')
        mongo.deleteAllPosts()
            .then(data => {
                console.log('All posts deleted:');
                console.log(data);
                res.send(data)
            })
            .catch(err => {
                res.status(500);
                console.error(err);
            });
    else res.send(config.mysql.accessDeniedMessage);
});

// Обновить пост
app.patch('/posts/:id', (req, res) => {
    mongo.updatePost(req.params.id, req.body.title, req.body.text)
        .then(data => {
            console.log('Post updated:');
            console.log(data);
            res.send(data)
        })
        .catch(err => {
            res.status(500);
            console.error(err);
        });
});

// Поставить лайк
app.put('/posts/:id', (req, res) => {
    mongo.putLike(req.params.id, req.body.username)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500);
            console.error(err);
        });
});

// Получить рандомную картинку
app.get('/cat', (req, res) => {
    catapi.getRandomCat()
        .then(img => res.send(img.data[0].url))
        .catch(err => {
            res.status(500);
            console.error(err);
        });
});

// Получить нужное количество рандомных картинок (не более 100)
app.get('/cats/:qt', (req, res) => {
    catapi.getRandomCats(req.params.qt)
        .then(img => res.send(img.data.map(pic => pic.url)))
        .catch(err => {
            res.status(500);
            console.error(err);
        });
});

const httpServer = http.createServer(app);
httpServer.listen(config.server.httpPort, () => {
    console.log(config.server.httpLog + config.server.httpPort);
});
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(config.server.httpsPort, () => {
    console.log(config.server.httpsLog + config.server.httpsPort);
});