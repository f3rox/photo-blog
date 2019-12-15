import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import './PostEditor.less';

const config = require('../../../config.json');

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            title: props.post.title,
            text: props.post.text,
            pic: props.post.pic
        };
        console.log(props);
        this.onChange = this.onChange.bind(this);
        this.handlePostUpdate = this.handlePostUpdate.bind(this);
    }

    handlePostUpdate() {
        const post = {
            id: this.props.post.id,
            title: this.state.title,
            text: this.state.text
        };
        this.props.onUpdate(post);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div>
                <Modal isOpen={true} toggle={this.props.onClose} className="PostEditor">
                    <ModalHeader toggle={this.props.onClose}>Редактирование</ModalHeader>
                    <ModalBody>
                        <div className="card PostEditor__body">
                            <img src={config.server.url + '/image/' + this.state.pic}
                                 className="card-img-top PostEditor__image"
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
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handlePostUpdate}>Сохранить</Button>
                        <Button onClick={this.props.onClose}>Отмена</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default PostEditor;