import axios from 'axios';

const config = require('../../config.json');
const API = config.server.url;
export default {
    getAllPosts() {
        return axios.get(API + '/posts');
    },
    createPost(data) {
        return axios.post(API + '/posts', data);
    },
    deletePost(postId) {
        return axios.delete(API + '/posts/' + postId);
    },
    putLike(postId, username) {
        return axios.put(API + '/posts/' + postId, {username: username});
    },
    updatePost(postId, title, text) {
        return axios.patch(API + '/posts/' + postId, {title: title, text: text});
    },
    subscribeUser(whoUsername, targetUsername) {
        return axios.post(API + '/users/subscribe/' + whoUsername, {username: targetUsername})
            .then(res => {
                return res.data;
            })
            .catch(err => console.error(err));
    },
    getUser(username) {
        return axios.get(API + '/users/' + username)
            .then(res => {
                return res.data
            })
            .catch(err => console.error(err));
    },
    getUserSubscriptions(username) {
        return axios.get(API + '/users/subscriptions/' + username)
            .then(res => {
                return res.data
            })
            .catch(err => console.error(err));
    },
    register(newUser) {
        return axios
            .post(API + '/users/register', {
                username: newUser.username,
                email: newUser.email,
                password: newUser.password
            })
            .then(res => {
                return res.data
            })
            .catch(err => console.error(err))
    },
    login(user) {
        return axios
            .post(API + '/users/login', {
                email: user.email,
                password: user.password
            })
            .then(res => {
                if (res.data.status)
                    localStorage.setItem('usertoken', res.data.token);
                console.log(res.data);
                return res.data
            })
            .catch(err => console.error(err))
    }
}