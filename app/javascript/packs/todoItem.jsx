import React from 'react';
import ReactTags from 'react-tag-autocomplete';

export default class TodoItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = { editing: false, text: this.props.text, date: this.props.date ? this.props.date : "", tags: this.props.tagList.map((tag, index) => { return { id: index, name: tag }; }) };
        this.handleChange = this.handleChange.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handleDiscard = this.handleDiscard.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleEditing(e) {
        this.setState({ editing: !this.state.editing });
    }

    handleDelete(i) {
        const tags = this.state.tags.slice(0);
        tags.splice(i, 1);
        this.setState({ tags: tags });
    }

    handleAddition(tag) {
        this.setState({ tags: [].concat(this.state.tags, tag) })
    }

    handleDone(e) {
        let editedTodo = { id: this.props.id, description: this.state.text, due_at: this.state.date, tag_list: this.state.tags.map(item => item.name) };
        this.props.editHandler(editedTodo);
        this.handleEditing(e);
    }

    handleDiscard(e) {
        this.setState({ editing: false, text: this.props.text, tags: this.props.tagList.map((tag, index) => { return { id: index, name: tag }; }) });
    }

    render() {

        if (this.state.editing) {
            return (
                <li className="list-group-item" key={this.props.id} >
                    <div className="form-group m-0">
                        <label className="col-form-label-sm m-0" for="description">Description</label>
                        <input className="form-control form-control-sm m-0" onChange={this.handleChange} value={this.state.text} placeholder="What do you need to do?" id="description" autoFocus required />
                    </div>
                    <div className="form-group m-0">
                        <label className="col-form-label-sm m-0" for="tags">Tags</label>
                        <div className="form-control form-control-sm scrollable" id="tags">
                            <ReactTags
                                tags={this.state.tags}
                                handleDelete={this.handleDelete}
                                handleAddition={this.handleAddition}
                                allowNew={true}
                                autofocus={false}
                                addOnBlur={true}
                                delimiters={[13, 9, 188]}
                                classNames={
                                    {
                                        root: '',
                                        rootFocused: '',
                                        selected: 'react-tags__selected',
                                        selectedTag: 'react-tags__selected-tag badge badge-info mr-1',
                                        selectedTagName: 'react-tags__selected-tag-name',
                                        search: 'react-tags__search',
                                        searchInput: 'react-tags__search input',
                                    }
                                }
                            />
                        </div>
                    </div>
                    <div className="form-group mt-0">
                        <label className="col-form-label-sm m-0" htmlFor="date">Due Date</label>
                        <input
                            className="form-control form-control-sm m-0"
                            id="date"
                            type="date"
                            value={this.state.date}
                            onChange={e => { this.setState({ date: e.target.value }); }}
                        >
                        </input>
                    </div>
                    <div className="btn-group" role="group">
                        <button className="btn btn-info btn-sm" onClick={this.handleDone}>
                            Done
                        </button>
                        <button className="btn btn-outline-info btn-sm" onClick={this.handleDiscard}
                        >
                            Discard changes
                        </button>
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
                                    let editedTodo = { id: this.props.id, completed: !this.props.completed };
                                    this.props.editHandler(editedTodo);
                                }}
                            />
                            <div className="d-flex justify-content-between">
                                <label className="form-check-label">
                                    {this.props.completed ? <del>{this.state.text}</del> : <span>{this.state.text}</span>}
                                </label>
                                <div>
                                    {this.props.date && <small className="m-1">Due {(new Date(this.props.date)).toLocaleDateString()}</small>}
                                    {this.props.tagList.map((tag, index) => <button key={index} onClick={() => this.props.setFilter(tag)} className="badge badge-info mr-1">{tag}</button>)}
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="btn-group btn-group-sm ml-1" role="group">
                        <button className="btn btn-outline-info" onClick={this.handleEditing}><i className="far fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => this.props.deleteHandler(this.props.id)}><i className="far fa-trash-alt"></i></button>
                    </div>
                </li>
            );
        }

    }

<<<<<<< HEAD
}
=======
}

/* without react tag autocomplete
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
                        <button className="btn btn-outline-info" onClick={this.handleEditing}><i className="far fa-edit"></i></button>
                        <button className="btn btn-outline-danger" onClick={() => this.props.deleteHandler(this.props.id)}><i className="far fa-trash-alt"></i></button>
                    </div>
                </li>
            );
        }

    }

}
*/
>>>>>>> master
