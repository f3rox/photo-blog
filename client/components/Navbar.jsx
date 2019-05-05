import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import './Navbar.less'

class Navbar extends React.Component {
    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(`/`)
    }

    render() {
        let mainClass = ['nav-item'];
        let profileClass = ['nav-item'];
        let feedClass = ['nav-item'];
        let loginClass = ['nav-item'];
        let registerClass = ['nav-item'];
        switch (window.location.pathname) {
            case '/':
                mainClass.push('active');
                break;
            case '/profile':
                profileClass.push('active');
                break;
            case '/feed':
                feedClass.push('active');
                break;
            case '/login':
                loginClass.push('active');
                break;
            case '/register':
                registerClass.push('active');
                break;
        }
        const loginRegLink = (
            <ul className="navbar-nav">
                <li className={loginClass.join(' ')}>
                    <Link to="/login" className="nav-link">
                        Войти
                    </Link>
                </li>
                <li className={registerClass.join(' ')}>
                    <Link to="/register" className="nav-link">
                        Регистрация
                    </Link>
                </li>
            </ul>
        );
        const userLink = (
            <ul className="navbar-nav">
                <li className={feedClass.join(' ')}>
                    <Link to="/feed" className="nav-link">
                        Лента
                    </Link>
                </li>
                <li className={profileClass.join(' ')}>
                    <Link to="/profile" className="nav-link">
                        Профиль
                    </Link>
                </li>
                <li className="nav-item">
                    <a href="" onClick={this.logOut.bind(this)} className="nav-link">
                        Выйти
                    </a>
                </li>
            </ul>
        );

        return (
            <nav className="navbar sticky-top navbar-expand navbar-dark">
                <a className="navbar-brand">
                    CatsApp
                </a>
                <button className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbar1"
                        aria-controls="navbar1"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                </button>
                <div className="collapse navbar-collapse justify-content-end"
                     id="navbar1">
                    <ul className="navbar-nav">
                        <li className={mainClass.join(' ')}>
                            <Link to="/" className="nav-link">
                                Главная
                            </Link>
                        </li>
                    </ul>
                    {localStorage.usertoken ? userLink : loginRegLink}
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar)