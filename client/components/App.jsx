import React from 'react';
import PostStore from '../store/PostStore';
import PostActions from "../actions/PostActions";
import PostForm from './Post/PostForm.jsx';
import PostGrid from './Post/PostGrid.jsx';
import Navbar from './Navbar.jsx';
import Login from './Auth/Login.jsx';
import ProfileCard from './Profile/ProfileCard.jsx';
import Register from './Auth/Register.jsx';

import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import ProfileInfo from "./Profile/ProfileInfo.jsx";
import api from '../api';
import PostEditor from './Post/PostEditor.jsx';
import SubscriptionsList from "./Profile/SubscriptionsList.jsx";
import './App.less';

function getStateFromFlux() {
    return {
        isLoading: PostStore.isLoading(),
        posts: PostStore.getPosts(),
        isEditorOpen: false
    };
}

function sortByDate(post1, post2) {
    if (post1.createdAt > post2.createdAt) return -1;
    else if (post1.createdAt < post2.createdAt) return 1;
    return 0;
}

function sortByLikes(post1, post2) {
    if (post1.likes.length > post2.likes.length) return -1;
    else if (post1.likes.length < post2.likes.length) return 1;
    return 0;
}

function decodeToken() {
    return jwt_decode(localStorage.usertoken);
}

function getCurrentUsername() {
    return decodeToken().username;
}

class App extends React.Component {
    constructor() {
        super();
        this.state = getStateFromFlux();
        this.onChange = this.onChange.bind(this);
        this.Profile = this.Profile.bind(this);
        this.handlePostEdit = this.handlePostEdit.bind(this);
        this.handlePostEditorClose = this.handlePostEditorClose.bind(this);
        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.updateUserSubscriptions = this.updateUserSubscriptions.bind(this);
        this.handlePostUpdate = this.handlePostUpdate.bind(this);
    }

    componentDidMount() {
        PostStore.addChangeListener(this.onChange);
        this.updateUserSubscriptions();
    }

    componentWillUnmount() {
        PostStore.removeChangeListener(this.onChange);
    }

    updateUserSubscriptions() {
        if (localStorage.usertoken) api.getUserSubscriptions(getCurrentUsername())
            .then(res => {
                if (res.subscriptions) this.setState({currentUserSubscriptions: res.subscriptions});
                else this.setState({currentUserSubscriptions: null});
            });
    }

    handlePostAdd(post) {
        post.author = getCurrentUsername();
        PostActions.createPost(post);
    }

    handlePostEdit(post) {
        const editPost = {
            id: post.id,
            title: post.title,
            text: post.text,
            pic: post.pic
        };
        this.setState({isEditorOpen: true, editPost: editPost});
    }

    handlePostUpdate(post) {
        PostActions.updatePost(post.id, post.title, post.text);
        this.setState({isEditorOpen: false, editPost: null});
    }

    handlePostDelete(post) {
        if (post.author === getCurrentUsername()) PostActions.deletePost(post.id);
    }

    handlePostLike(post) {
        PostActions.putLike(post.id, getCurrentUsername());
    }

    getUserPosts(username) {
        return this.state.posts.filter(post => post.author === username).sort(sortByDate);
    }

    getCurrentUserPosts() {
        return this.getUserPosts(getCurrentUsername());
    }

    getCurrentUserFeedPosts() {
        if (this.state.currentUserSubscriptions) {
            const subscriptions = this.state.currentUserSubscriptions;
            return this.state.posts.filter(post => subscriptions.includes(post.author)).sort(sortByDate);
        }
        else return null;
    }

    handlePostEditorClose() {
        this.setState({isEditorOpen: false, editPost: null});
    }

    handleSubscribe(targetUsername) {
        api.subscribeUser(getCurrentUsername(), targetUsername)
            .then(() => this.updateUserSubscriptions());
    }

    Profile({match}) {
        const username = match.params.username;
        if (!localStorage.usertoken) return <Redirect to="/login"/>;
        else if (username === getCurrentUsername()) return <Redirect to="/profile"/>;
        return <div>
            <ProfileCard username={username}
                         onSubscribe={this.handleSubscribe}
                         isSubscribed={this.state.currentUserSubscriptions && this.state.currentUserSubscriptions.includes(username)}/>
            <PostGrid posts={this.getUserPosts(username)} onPostLike={this.handlePostLike}/>
        </div>
    }

    render() {
        console.log(this.state);
        return (
            <Router>
                <div className="App">
                    <Navbar/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/" render={() => (
                        <PostGrid posts={this.state.posts.sort(sortByLikes)}
                                  onPostLike={this.handlePostLike}/>
                    )
                    }/>
                    <Route exact path="/profile" render={() => {
                        if (!localStorage.usertoken) return <Redirect to="/login"/>;
                        const decode = decodeToken();
                        return (
                            <div>
                                {this.state.isEditorOpen ?
                                    <PostEditor post={this.state.editPost}
                                                onUpdate={this.handlePostUpdate}
                                                onClose={this.handlePostEditorClose}/> : null}
                                <ProfileInfo username={decode.username} email={decode.email} created={decode.created}/>
                                <PostForm onPostAdd={this.handlePostAdd}/>
                                <PostGrid
                                    posts={this.getCurrentUserPosts()}
                                    onPostDelete={this.handlePostDelete}
                                    onPostLike={this.handlePostLike}
                                    onPostEdit={this.handlePostEdit}
                                />
                            </div>
                        )
                    }
                    }/>
                    <Route exact path="/profile/:username" component={this.Profile}/>
                    <Route exact path="/feed" render={() => {
                        return (
                            <div>
                                <SubscriptionsList onSubscribe={this.handleSubscribe}
                                                   subscriptions={this.state.currentUserSubscriptions}/>
                                <PostGrid posts={this.getCurrentUserFeedPosts()} onPostLike={this.handlePostLike}/>
                            </div>
                        )
                    }}/>
                </div>
            </Router>
        )
    }

    onChange() {
        this.setState(getStateFromFlux());
    }
}

export default App;