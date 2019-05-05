import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/AppConstants';

import api from '../api';

const PostActions = {
    loadPosts() {
        AppDispatcher.dispatch({
            type: Constants.LOAD_POSTS_REQUEST
        });

        api.getAllPosts()
            .then(({data}) =>
                AppDispatcher.dispatch({
                    type: Constants.LOAD_POSTS_SUCCESS,
                    posts: data
                })
            )
            .catch(err =>
                AppDispatcher.dispatch({
                    type: Constants.LOAD_POSTS_FAIL,
                    error: err
                })
            );
    },
    createPost(post) {
        api.createPost(post)
            .then(() => this.loadPosts())
            .catch(err => console.error(err));
    },
    deletePost(postId) {
        api.deletePost(postId)
            .then(() => this.loadPosts())
            .catch(err => console.error(err));
    },
    putLike(postId, username) {
        api.putLike(postId, username)
            .then(() => this.loadPosts())
            .catch(err => console.error(err));
    },
    updatePost(postId, title, text) {
        api.updatePost(postId, title, text)
            .then(() => this.loadPosts())
            .catch(err => console.error(err));
    }
};

export default PostActions;