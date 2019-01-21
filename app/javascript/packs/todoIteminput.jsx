import React from 'react';
import ReactTags from 'react-tag-autocomplete';

export default class TodoItemInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '', tags: [], expanded: false };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    handleSubmit(e) {
        console.log(this.state);
        e.preventDefault();
        if (!this.state.text.length) { return; }
        let todo = { completed: false, description: this.state.text, tag_list: this.state.tags.map(item => item.name) };
        this.props.submitHandler(todo);
        this.setState(({ text: '', tags: [], expanded: false }))
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleDelete(i) {
        const tags = this.state.tags.slice(0);
        tags.splice(i, 1);
        this.setState({ tags: tags });
    }

    handleAddition(tag) {
        this.setState({ tags: [].concat(this.state.tags, tag) })
    }

    render() {
        if (this.state.expanded) {
            return (
                <form className="container" onSubmit={this.handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-sm btn-light" onClick={() => this.setState({ expanded: false })}><i className="fas fa-angle-up"></i> Less options</button>
                                <button className="btn btn-sm btn-info" type="submit">
                                    <i className="fas fa-plus"></i> Add new todo
                                </button>
                            </div>
                            <div className="form-group m-0">
                                <label className="col-form-label-sm m-0" htmlFor="description">Description</label>
                                <input className="form-control form-control-sm m-0" onChange={this.handleChange} value={this.state.text} placeholder="What do you need to do?" id="description" autoFocus/>
                            </div>
                            <div className="form-group m-0">
                                <label className="col-form-label-sm m-0" htmlFor="tags">Tags</label>
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
                            
                        </div>
                    </div>
                </form>
            );
        } else {
            return (
                <form className="container" onSubmit={this.handleSubmit}>
                    {}
                    <div className="shadow input-group">
                        <div className="input-group-prepend">
                            <button className="btn btn-lg btn-light" onClick={() => this.setState({ expanded: true })}><i className="fas fa-angle-down"></i></button>
                        </div>
                        <input
                            className="form-control form-control-lg"
                            onChange={this.handleChange}
                            value={this.state.text}
                            placeholder="What do you need to do?"
                            autoFocus
                        />
                        <div className="input-group-append">
                            <button className="btn btn-lg btn-info" type="submit"><i className="fas fa-plus"></i></button>
                        </div>
                    </div>
                </form>
            );
        }
    }
}