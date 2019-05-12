import React from 'react'
import './ProfileCard.less'
import api from "../../api";
import moment from "moment";

const config = require('../../../config.json');

class ProfileCard extends React.Component {
    constructor() {
        super();
        this.state = {user: {username: ''}};
        this.handleSubscribe = this.handleSubscribe.bind(this);
    }

    componentWillMount() {
        api.getUser(this.props.username)
            .then(user => this.setState({user: user}));
    }

    handleSubscribe() {
        this.props.onSubscribe(this.state.user.username);
    }

    render() {
        const {user} = this.state;
        return (
            <div className="card">
                <h5 className="card-header d-flex justify-content-between align-items-center">
                    <span>Профиль</span>
                    <button type="submit"
                            className="btn"
                            onClick={this.handleSubscribe}>
                        {this.props.isSubscribed ? "Отписаться" : "Подписаться"}
                    </button>
                </h5>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="text-muted">Имя пользователя: </span>{user.username}
                    </li>
                    <li className="list-group-item">
                        <span className="text-muted">Почта: </span>{user.email}
                    </li>
                    <li className="list-group-item">
                        <span className="text-muted">Дата регистрации: </span>
                        {moment(user.created)
                            .locale(config.posts.dateLocale)
                            .format(config.posts.dateFormat).toString()}
                    </li>
                </ul>
            </div>
        )
    }
}

export default ProfileCard