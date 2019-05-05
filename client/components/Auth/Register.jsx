import React from 'react'
import api from '../../api/index';
import './Register.less';
import is from 'is_js';

const config = require('../../../config.json');

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            usernameStatus: false,
            emailStatus: false,
            passwordStatus: false
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    checkUsername(username) {
        if (username.length < config.auth.usernameMinLength) this.setState({
            usernameStatus: false,
            usernameErrorMessage: config.auth.tooShortUsername
        });
        else this.setState({usernameStatus: true, usernameErrorMessage: null});
    }

    checkEmail(email) {
        if (is.email(email)) this.setState({emailStatus: true, emailErrorMessage: null});
        else this.setState({emailStatus: false, emailErrorMessage: config.auth.incorrectEmailMessage});
    }

    checkPassword(password) {
        if (password.length < config.auth.passwordMinLength) this.setState({
            passwordStatus: false,
            passwordErrorMessage: config.auth.tooShortPasswordMessage
        });
        else this.setState({passwordStatus: true, passwordErrorMessage: null});
    }

    isValid() {
        return this.state.usernameStatus && this.state.emailStatus && this.state.passwordStatus;
    }

    onChange(e) {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        switch (targetName) {
            case 'username':
                this.checkUsername(targetValue);
                break;
            case 'email':
                this.checkEmail(targetValue);
                break;
            case 'password':
                this.checkPassword(targetValue);
                break;
        }
        this.setState({[targetName]: targetValue});
    }

    onSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        };
        api.register(user).then(res => {
            console.log(res);
            if (res.status) {
                this.props.history.push('/login');
            } else {
                if (res.emailErrorMessage)
                    this.setState({emailErrorMessage: res.emailErrorMessage});
                if (res.usernameErrorMessage)
                    this.setState({usernameErrorMessage: res.usernameErrorMessage});
            }
        })
    }

    render() {
        let emailClass = ["form-control"];
        let usernameClass = ["form-control"];
        let passwordClass = ["form-control"];
        if (this.state.emailErrorMessage) {
            emailClass.push('is-invalid');
        }
        if (this.state.usernameErrorMessage) {
            usernameClass.push('is-invalid');
        }
        if (this.state.passwordErrorMessage) {
            passwordClass.push('is-invalid');
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                            <div className="form-group">
                                <label htmlFor="username">Имя пользователя</label>
                                <input type="text"
                                       className={usernameClass.join(' ')}
                                       name="username"
                                       placeholder="Введите имя пользователя"
                                       value={this.state.username}
                                       onChange={this.onChange}
                                       maxLength={20}
                                />
                                <div className="invalid-feedback">
                                    {this.state.usernameErrorMessage}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email"
                                       className={emailClass.join(' ')}
                                       name="email"
                                       placeholder="Введите email"
                                       value={this.state.email}
                                       onChange={this.onChange}
                                       maxLength={100}
                                />
                                <div className="invalid-feedback">
                                    {this.state.emailErrorMessage}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Пароль</label>
                                <input type="password"
                                       className={passwordClass.join(' ')}
                                       name="password"
                                       placeholder="Введите пароль"
                                       value={this.state.password}
                                       onChange={this.onChange}
                                       maxLength={20}
                                />
                                <div className="invalid-feedback">
                                    {this.state.passwordErrorMessage}
                                </div>
                            </div>
                            <button type="submit"
                                    className=" btn btn-lg btn-block"
                                    disabled={!this.isValid()}>
                                Зарегистрироваться
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register