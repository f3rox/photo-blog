import React from 'react';
import './ProfileInfo.less';
import moment from "moment";

const config = require('../../../config.json');

class ProfileInfo extends React.Component {
    render() {
        return (
            <div className="card">
                <h5 className="card-header">
                    Мой профиль
                </h5>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="text-muted">Имя пользователя: </span>{this.props.username}
                    </li>
                    <li className="list-group-item">
                        <span className="text-muted">Почта: </span>{this.props.email}
                    </li>
                    <li className="list-group-item">
                        <span className="text-muted">Дата регистрации: </span>
                        {moment(this.props.created)
                            .locale(config.posts.dateLocale)
                            .format(config.posts.dateFormat).toString()}
                    </li>
                </ul>
            </div>
        )
    }
}

export default ProfileInfo