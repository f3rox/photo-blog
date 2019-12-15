import React from 'react';
import Post from './Post.jsx';
import Masonry from 'react-masonry-component';
import './PostGrid.less';
import PostActions from "../../actions/PostActions";
import jwt_decode from "jwt-decode";

function decodeToken() {
    return jwt_decode(localStorage.usertoken);
}

class PostGrid extends React.Component {
    componentDidMount() {
        PostActions.loadPosts();
    }

    render() {
        const masonryOptions = {
            itemSelector: '.Post',
            columnWidth: 400,
            gutter: 10,
            isFitWidth: true
        };
        // console.log(this.props.posts);
        let currentUser;
        if (this.props.posts) {
            if (this.props.posts.length > 0 && localStorage.usertoken)
                currentUser = decodeToken().username;
            return (
                <Masonry
                    className='PostGrid'
                    options={masonryOptions}
                >
                    {
                        this.props.posts.map(post =>
                            <Post
                                key={post.id}
                                title={post.title}
                                pic={post.pic}
                                text={post.text}
                                author={post.author}
                                createdAt={post.createdAt}
                                ruDate={post.ruDate}
                                likes={post.likes}
                                onEdit={this.props.onPostEdit ? this.props.onPostEdit.bind(null, post) : null}
                                onDelete={this.props.onPostDelete ? this.props.onPostDelete.bind(null, post) : null}
                                onLike={this.props.onPostLike ? this.props.onPostLike.bind(null, post) : null}
                                currentUser={currentUser}
                            />
                        )
                    }
                </Masonry>
            );
        } else return null;
    }
}

export default PostGrid;