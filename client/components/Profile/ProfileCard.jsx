import React from 'react'
import './ProfileCard.less'
import api from "../../api";
import moment from "moment";

const config = require('../../../config.json');

class ProfileCard extends React.Component {
    constructor() {
        super();
        this.state = {user: {username: ''}, isSubscribed: false};
        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.checkSubscription = this.checkSubscription.bind(this);
    }

    checkSubscription() {
        api.getUserSubscriptions(this.props.currentUser)
            .then(res => {
                if (res.status && res.subscriptions.includes(this.props.username))
                    this.setState({isSubscribed: true});
                else this.setState({isSubscribed: false});
            });
    }

    // DidMount?
    componentWillMount() {
        api.getUser(this.props.username)
            .then(user => {
                this.setState({user: user});
                this.checkSubscription();
            });
    }

    handleSubscribe() {
        api.subscribeUser(this.props.currentUser, this.state.user.username)
            .then(() => this.checkSubscription());
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
                        {this.state.isSubscribed ? "Отписаться" : "Подписаться"}
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