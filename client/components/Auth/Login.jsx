import React from 'react'
import api from '../../api/index'
import './Login.less'
import is from "is_js";

const config = require('../../../config.json');

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            emailStatus: false,
            passwordStatus: false
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        return this.state.emailStatus && this.state.passwordStatus;
    }

    onChange(e) {
        this.setState({message: null});
        const targetName = e.target.name;
        const targetValue = e.target.value;
        switch (targetName) {
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
            email: this.state.email,
            password: this.state.password
        };
        api.login(user).then(res => {
            if (res.status) {
                this.props.history.push('/profile');
            } else this.setState({message: res.message})
        })
    }

    render() {
        console.log(this.state);
        let emailClass = ["form-control"];
        let passwordClass = ["form-control"];
        if (this.state.message) {
            emailClass.push('is-invalid');
            passwordClass.push('is-invalid');
        }
        else {
            if (this.state.emailErrorMessage) {
                emailClass.push('is-invalid');
            }
            if (this.state.passwordErrorMessage) {
                passwordClass.push('is-invalid');
            }
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Вход</h1>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email"
                                       className={emailClass.join(' ')}
                                       name="email"
                                       placeholder="Введите email"
                                       value={this.state.email}
                                       onChange={this.onChange}
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
                                       minLength={6}
                                />
                                <div className="invalid-feedback">
                                    {this.state.passwordErrorMessage}
                                </div>
                            </div>
                            {this.state.message ?
                                <h6 className="text-danger"> {this.state.message}</h6>
                                :
                                null
                            }
                            <button type="submit"
                                    className="btn btn-lg btn-block"
                                    disabled={!this.isValid()}>
                                Войти
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login