import React from 'react';

export default class TodoItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = { editing: false, text: this.props.text, tags: this.props.tagList.toString() };
        this.handleChange = this.handleChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleTagsChange(e) {
        this.setState({ tags: e.target.value });
    }

    handleEditing(e) {
        this.setState({ editing: !this.state.editing });
    }

    render() {

        if (this.state.editing) {
            return (
                <li className="list-group-item" key={this.props.id} >
                    <div className="input-group">
                        <input className="form-control form-control-sm" onChange={this.handleChange} value={this.state.text} placeholder="Description" required/>
                        <input className="form-control form-control-sm" onChange={this.handleTagsChange} value={this.state.tags} placeholder="Comma-separated tags" />
                        <div className="input-group-append">
                        <button
                            className="btn btn-info btn-sm"
                            onClick={(e) => {
                                let editedTodo = {id: this.props.id, description: this.state.text, tag_list: this.state.tags.split(",").map(item => item.trim()) };
                                this.props.editHandler(editedTodo);
                                this.handleEditing(e);
                            }}
                        >
                            Done
                        </button>
                        </div>
                    </div>
                </li>
            );
        } else {
            return (
                <li className={this.props.completed ? "list-group-item disabled d-flex justify-content-between align-items-center" : "list-group-item d-flex justify-content-between align-items-center"} key={this.props.id}>
                    <div className="flex-grow-1">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={this.props.completed}
                                onChange={() => {
                                    let editedTodo = {id: this.props.id, completed: !this.props.completed};
                                    this.props.editHandler(editedTodo);
                                }}
                            />
                            <div className="d-flex justify-content-between">
                                <label className="form-check-label">
                                    {this.props.completed ? <del>{this.state.text}</del> : <span>{this.state.text}</span>}
                                </label>
                                <div>
                                    {this.props.tagList.map((tag, index) => <button key={index} onClick={() => this.props.setFilter(tag)} className="badge badge-info mr-1">{tag}</button>)}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="btn-group btn-group-sm ml-1" role="group">
                        <button className="btn btn-outline-info" onClick={this.handleEditing}>Edit</button>
                        <button className="btn btn-outline-info" onClick={() => this.props.deleteHandler(this.props.id)}>Delete</button>
                    </div>
                </li>
            );
        }

    }

}