const fs = require('fs');
const http = require('http');
const express = require('express');
const multiparty = require('multiparty');
const bodyParser = require('body-parser');
const mongo = require('./database/MongoDB');
const cors = require('cors');
const catapi = require('./utils/CatAPI');
const app = express();
const Users = require('./routes/Users');
const config = require("../config.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: '*'}));
app.use('/users', Users);

mongo.setUpConnection()
    .then(() => console.log(config.mongodb.successMessage))
    .catch(error => console.error(config.mongodb.errorMessage + error));

// Получить все посты
app.get('/posts', (req, res) => {
    mongo.getAllPosts()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Получить изображение
app.get('/image/:id', (req, res) => {
    res.sendFile(config.server.imagesPath + req.params.id);
});

// Добавить пост
app.post('/posts', (req, res) => {
    let form = new multiparty.Form();
    let image;
    let title;
    let text;
    let author;
    form.on('close', function () {
        let newPost = {
            'title': title,
            'text': text,
            'author': author
        };
        if (image) {
            const fileName =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            const fileExtension = image.filename.substring(image.filename.lastIndexOf('.') + 1);
            const fileFullName = fileName + '.' + fileExtension;
            fs.writeFileSync('images/' + fileFullName, Buffer.concat(image.bytes));
            newPost.image = fileFullName;
        }
        mongo.createPost(newPost).then(post => {
            console.log('New post:');
            console.log(post);
            res.send(post);
        }).catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
    });
    form.on('field', function (name, val) {
        if (name === 'title') title = val;
        else if (name === 'text') text = val;
        else if (name === 'author') author = val;
    });
    form.on('part', function (part) {
        if (!part.filename) return;
        if (part.name !== 'image') return part.resume();
        image = {};
        image.filename = part.filename;
        image.size = 0;
        image.bytes = [];
        part.on('data', function (buf) {
            image.bytes.push(buf);
            image.size += buf.length;
        });
    });
    form.parse(req);
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
            res.status(500).json({error: err.toString()});
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
                res.status(500).json({error: err.toString()});
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
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Лайк
app.put('/posts/:id', (req, res) => {
    mongo.putLike(req.params.id, req.body.username)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Получить рандомную картинку
app.get('/cat', (req, res) => {
    catapi.getRandomCat()
        .then(img => res.send(img.data[0].url))
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

// Получить нужное количество рандомных картинок (не более 100)
app.get('/cats/:qt', (req, res) => {
    catapi.getRandomCats(req.params.qt)
        .then(img => res.send(img.data.map(pic => pic.url)))
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);
        });
});

const httpServer = http.createServer(app);
httpServer.listen(config.server.httpPort, () => {
    console.log(config.server.httpLog + config.server.httpPort);
});