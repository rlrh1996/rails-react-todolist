import React from 'react'
import ReactDOM from 'react-dom'

document.addEventListener('DOMContentLoaded', () => {
    document.body.style = 'background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);';
    ReactDOM.render(
        <Main/>,
        document.body.appendChild(document.createElement('div')),
    )
})

class Main extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { items: [], tags: [], text: '', filter: '', search: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.updateToLatestState = this.updateToLatestState.bind(this);
        this.updateTagList = this.updateTagList.bind(this);
    }

    componentDidMount() {
        this.updateToLatestState();
    }

    render() {
        let filteredItems = this.state.filter ? this.state.items.filter(item => item.tag_list.includes(this.state.filter)) : this.state.items;
        filteredItems = this.state.search ? filteredItems.filter(item => item.description.includes(this.state.search) || item.tag_list.includes(this.state.search)) : filteredItems;
        return (
            <main>
                <div className="container">
                    <div className="row mt-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg">
                                    <h1 className="display-4 text-white">Todolist</h1>
                                </div>  
                                <div className="col-lg">
                                    <p className="text-light text-lg-right">Built with Ruby on Rails, React and Bootstrap</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-3">
                            <div className="row mt-3">
                                <div className="container">
                                    <SearchFilter tags={this.state.tags} filter={this.state.filter} setFilter={this.handleFilter} search={this.state.search} setSearch={this.handleSearch} />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row mt-3">
                                <form className="container" onSubmit={this.handleSubmit}>
                                    <input
                                        className="shadow form-control form-control-lg"
                                        onChange={this.handleChange}
                                        value={this.state.text}
                                        placeholder="What do you need to do?"
                                        autoFocus
                                    />
                                </form>
                            </div>
                            <div className="row mt-3">
                                <div className="container">
                                    <TodoList items={filteredItems} deleteHandler={this.handleDelete} editHandler={this.handleEdit} setFilter={this.handleFilter} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        
        e.preventDefault();
        if (!this.state.text.length) { return; }
        
        let body = JSON.stringify({todo: {completed: false, description: this.state.text} });
        fetch(`api/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
        })
        .then((response) => { return response.json(); })
        .then((todo)=>{
            /*
            this.updateToLatestState();
            this.setState({text: ''});
            */
            this.setState(state => ({
                items: state.items.concat(todo),
                text: ''
            }), () => this.updateTagList());
        });

    }

    handleDelete(key) {
        
        fetch(`api/todos/${key}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => { 
            // this.updateToLatestState();
            this.setState({ items: this.state.items.filter(item => item.id != key) }, () => this.updateTagList()) ;
        });
        
    }

    handleEdit(todo) {
        
        fetch(`api/todos/${todo.id}`, {
            method: 'PUT',
            body: JSON.stringify({todo: todo}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => { return response.json(); })
        .then((data) => { 
            // this.updateToLatestState();
            console.log(data);
            let items = [...this.state.items];
            const index = items.findIndex(item => item.id == data.id);
            let item = { ...items[index] };
            item.completed = data.completed;
            item.description = data.description;
            item.tag_list = data.tag_list;
            items[index] = item;
            this.setState({ items }, () => this.updateTagList());
        });
        
    }

    handleFilter(filter) {
        this.setState({ filter: filter }); 
    }

    handleSearch(term) {
        this.setState({ search: term });
    }

    updateToLatestState() {
        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }
        try {
            fetch(`/api/todos`)
            .then((response) => { 
                const json = response.json();
                console.log(json);
                return json; 
            })
            .then((data) => { 
                const allTags = flatten(data.map(item => item.tag_list));
                const allTagsSet = Array.from(new Set(allTags))
                this.setState({ items: data, tags: allTagsSet }); 
                console.log(this.state);
            });
        } catch (err) {
            console.log('fetch failed', err);
        }
    }

    updateTagList() {
        function flatten(arr) {
            return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
        }
        const allTags = flatten(this.state.items.map(item => item.tag_list));
        const allTagsSet = new Set(allTags);
        this.setState({ tags: Array.from(allTagsSet) }); 
    }

}

class SearchFilter extends React.Component {
    render() {
        return (
            <div className="shadow-sm list-group">
                <li className="list-group-item p-2">
                    <div className="input-group">
                        <input
                            className="form-control"
                            onChange={(e) => this.props.setSearch(e.target.value)}
                            value={this.props.search}
                            placeholder="Search"
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-info" onClick={() => this.props.setSearch('')}>X</button>
                        </div>
                    </div>
                </li>
                <button key="all" className={this.props.filter ? "list-group-item list-group-item-action py-2" : "list-group-item list-group-item-info list-group-item-action py-2"} onClick={(e) => this.props.setFilter('')}>All todos</button>
                {this.props.tags.map(tag => 
                    <button 
                        key={tag} 
                        className={this.props.filter == tag ? "list-group-item list-group-item-info list-group-item-action py-2" : "list-group-item list-group-item-action py-2"}
                        onClick={() => this.props.setFilter(tag)}
                    >
                        {tag}
                    </button>
                )}
            </div>
        );
    }
}

class TodoList extends React.Component {
    render() {
        if (this.props.items.length) {
            return (
                <ul className="shadow list-group">
                    {this.props.items.map(item => <Todo key={item.id} id={item.id} text={item.description} completed={item.completed} tagList={item.tag_list} deleteHandler={this.props.deleteHandler} editHandler={this.props.editHandler} setFilter={this.props.setFilter}/>)}
                </ul>       
            );
        } else {
            return (
                <div className="alert alert-warning shadow" role="alert">
                    No todos. Try adding a new todo or changing the search term and filter.
                </div>
            );
        }
    }
}

class Todo extends React.Component {

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
                        <button className="btn btn-light" onClick={this.handleEditing}>Edit</button>
                        <button className="btn btn-light" onClick={() => this.props.deleteHandler(this.props.id)}>Delete</button>
                    </div>
                </li>
            );
        }

    }

}