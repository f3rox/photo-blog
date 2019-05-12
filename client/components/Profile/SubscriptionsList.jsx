import React from 'react';
import './SubscriptionsList.less';
import {Link} from "react-router-dom";

class SubscriptionsList extends React.Component {
    render() {
        console.log(this.props);
        if (this.props.subscriptions && this.props.subscriptions.length > 0)
            return (
                <div className="card Subs">
                    <h5 className="card-header">
                        Мои подписки
                    </h5>
                    <ul className="list-group">
                        {this.props.subscriptions.map(sub =>
                            <li className="list-group-item d-flex justify-content-between align-items-center Sub_item"
                                key={sub}>
                                <Link to={'/profile/' + sub}>
                                    <span>{sub}</span>
                                </Link>
                                <button type="submit"
                                        className="btn"
                                        onClick={this.props.onSubscribe ? this.props.onSubscribe.bind(null, sub) : null}
                                >
                                    Отписаться
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

            );
        else return (
            <div className="card Subs">
                <h5 className="card-header">
                    Мои подписки
                </h5>
                <div className="card-body Sub_body">
                    Подписки отсутствуют
                </div>
            </div>);
    }
}

export default SubscriptionsList