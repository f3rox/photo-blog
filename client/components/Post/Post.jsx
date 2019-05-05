import React from 'react';
import {Link, Redirect} from "react-router-dom";
import './Post.less';

class Post extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        let likeClass = ['Post__like-icon'];
        console.log(this.props);
        if (this.props.likes.includes(this.props.currentUser)) likeClass.push('like-pressed');
        return (
            <div className="card Post">
                {
                    this.props.onDelete
                        ?
                        <span className='Post__del-icon' onClick={this.props.onDelete}> × </span>
                        :
                        null
                }
                {
                    this.props.onUpdate
                        ?
                        <span className='Post__edit-icon' onClick={this.props.onUpdate}> 🖉 </span>
                        :
                        null
                }
                <img src={this.props.pic} className="card-img-top Post__image" alt=""/>
                <div className="card-body">
                    {
                        localStorage.usertoken ?
                            <span className={likeClass.join(' ')} onClick={this.props.onLike}> ❤ </span>
                            :
                            <Link to="/login"><span className={likeClass.join(' ')}> ❤ </span></Link>
                    }
                    <span
                        className="likes-counter">{this.props.likes.length > 0 ? this.props.likes.length : null}</span>
                    <h5 className="card-title Post__title">{this.props.title}</h5>
                    <p className="card-text">{this.props.text}</p>
                    <div className="d-flex justify-content-between">
                        <Link to={'/profile/' + this.props.author}>
                            <small className="text-muted">{this.props.author}</small>
                        </Link>
                        <small className="text-muted">{this.props.ruDate}</small>
                    </div>
                </div>
            </div>
        )
    }

    // edit 🖉 ❤ ✎
}

export default Post;