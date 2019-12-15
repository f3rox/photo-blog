import React from 'react';
import './PostForm.less';

class PostForm extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            text: '',
            image: null
        };
        this.onChange = this.onChange.bind(this);
        this.onPostAdd = this.onPostAdd.bind(this);
    }

    onChange(event) {
        if (event.target.files) this.setState({image: event.target.files[0]});
        else this.setState({[event.target.name]: event.target.value});
    }

    onPostAdd(event) {
        event.preventDefault();
        const newPost = new FormData();
        newPost.set('title', this.state.title);
        newPost.set('text', this.state.text);
        newPost.set('image', this.state.image);
        this.props.onPostAdd(newPost);
        this.setState({text: '', title: '', image: null});
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
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="customFile" name="image"
                               onChange={this.onChange}/>
                        <label className="custom-file-label" htmlFor="customFile">
                            {this.state.image ? this.state.image.name : "Выберите изображение"}
                        </label>
                    </div>
                    <button
                        className="btn"
                        disabled={!this.state.title || !this.state.image}
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