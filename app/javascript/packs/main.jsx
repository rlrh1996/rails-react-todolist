import React from 'react';
import SearchFilter from './searchFilter';
import TodoList from './todoList';

export default class Main extends React.Component {
    
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
        filteredItems = this.state.search ? filteredItems.filter(item => item.description.toLowerCase().includes(this.state.search.toLowerCase()) || item.tag_list.some(tag => tag.toLowerCase() == this.state.search.toLowerCase())) : filteredItems;
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
                                    <div className="shadow input-group">
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
            return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
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
                const tagsSet = new Set(allTags);
                const tagsArray = Array.from(tagsSet);
                this.setState({ items: data, tags: tagsArray }, () => console.log(this.state)); 
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