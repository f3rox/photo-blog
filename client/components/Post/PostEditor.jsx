import React from 'react';
import './PostEditor.less';

class PostEditor extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.onChange = this.onChange.bind(this);
        // this.handlePostSave = this.handlePostSave.bind(this);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    static getDerivedStateFromProps(props, state) {
        console.log("DERIVED");
        console.log(props);
        return {
            pic: props.pic,
            title: props.title,
            text: props.text
        }
    }

    render() {
        console.log("EDIT PROPS:");
        console.log(this.state);

        return (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Редактирование</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="card PostEditor">
                        <img src={this.state.pic} className="card-img-top PostEditor__image"
                             alt=""/>
                        <div className="card-body">
                            <input
                                type='text'
                                className='PostEditor__title'
                                placeholder='Введите заголовок'
                                name="title"
                                value={this.state.title}
                                onChange={this.onChange}
                                minLength={1}
                                maxLength={22}
                            />
                            <textarea
                                placeholder='Введите текст'
                                className='PostEditor__text'
                                name="text"
                                value={this.state.text}
                                onChange={this.onChange}
                                rows={8}
                                minLength={1}
                                maxLength={450}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn" data-dismiss="modal">Отмена</button>
                    <button
                        className="btn"
                        disabled={!this.state.text || !this.state.title}
                        // onClick={this.handlePostSave}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        )
    }

    // edit 🖉 ❤ ✎
}

export default PostEditor;