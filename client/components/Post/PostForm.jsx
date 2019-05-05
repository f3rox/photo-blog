import React from 'react';
import './PostForm.less';

class PostForm extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            text: ''
        };
        this.onChange = this.onChange.bind(this);
        this.onPostAdd = this.onPostAdd.bind(this);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onPostAdd(e) {
        e.preventDefault();
        const newPost = {
            title: this.state.title,
            text: this.state.text,
        };
        this.props.onPostAdd(newPost);
        this.setState({text: '', title: ''});
    }

    render() {
        return (
            <div className='PostForm'>
                <input
                    type='text'
                    className='PostForm__title'
                    placeholder='Введите заголовок'
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                    minLength={1}
                    maxLength={22}
                />
                <textarea
                    placeholder='Введите текст'
                    rows={7}
                    className='PostForm__text'
                    name="text"
                    value={this.state.text}
                    onChange={this.onChange}
                    minLength={1}
                    maxLength={450}
                />
                <div className='PostForm__footer'>
                    <button
                        className="btn"
                        disabled={!this.state.text || !this.state.title}
                        onClick={this.onPostAdd}
                    >
                        Отправить
                    </button>
                </div>
            </div>
        )
    }
}

export default PostForm;