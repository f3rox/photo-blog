import {EventEmitter} from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import moment from "moment";

const config = require('../../config.json');
const CHANGE_EVENT = 'change';

let _posts = [];
let _loadingError = null;
let _isLoading = true;

function formatPost(post) {
    return {
        id: post._id,
        author: post.author,
        title: post.title,
        text: post.text,
        pic: post.pic,
        createdAt: post.createdAt,
        ruDate: moment(post.createdAt).locale(config.posts.dateLocale).format(config.posts.dateFormat).toString(),
        likes: post.likes
    };
}

const TasksStore = Object.assign({}, EventEmitter.prototype, {
    isLoading() {
        return _isLoading;
    },

    getPosts() {
        return _posts;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case AppConstants.LOAD_POSTS_REQUEST: {
            _isLoading = true;
            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_POSTS_SUCCESS: {
            _isLoading = false;
            _posts = action.posts.map(formatPost);
            _loadingError = null;
            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_POSTS_FAIL: {
            _loadingError = action.error;

            TasksStore.emitChange();
            break;
        }

        default: {
            console.log('No such handler');
        }
    }
});

export default TasksStore;