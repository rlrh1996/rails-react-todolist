import React from 'react';
import SearchFilter from './searchFilter';
import TodoList from './todoList';
import TodoItemInput from './todoIteminput';

export default class Main extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { items: [], tags: [], filter: '', search: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.getFilteredSearchedItems = this.getFilteredSearchedItems.bind(this);
        this.updateTagList = this.updateTagList.bind(this);
    }

    componentDidMount() {
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

    render() {
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
                                    <p className="text-light text-lg-right mt-2 mb-0 p-0">Built with <i className="far fa-gem"></i> Ruby on Rails, <i className="fab fa-react"></i> React and Bootstrap.</p>
                                    <p className="text-lg-right mt-0 mb-2 p-0 text-light"><a className="text-light" href="/api/todos">API</a> || <a className="text-light" href="https://github.com/rlrh1996/rails-react-todolist">View source on <i className="fab fa-github"></i> Github</a></p>
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
                                <TodoItemInput submitHandler={this.handleSubmit} />
                            </div>
                            <div className="row mt-3">
                                <div className="container">
                                    <TodoList items={this.getFilteredSearchedItems()} deleteHandler={this.handleDelete} editHandler={this.handleEdit} setFilter={this.handleFilter} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    handleSubmit(todo) {
        fetch(`api/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({todo: todo}),
        })
        .then((response) => { return response.json(); })
        .then((todo)=>{
            /*
            this.updateToLatestState();
            this.setState({text: ''});
            */
            this.setState(state => ({
                items: state.items.concat(todo),
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
            const index = items.findIndex(item => item.id === data.id);
            let item = { ...items[index] };
            item.due_at = data.due_at;
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

    getFilteredSearchedItems() {

        function getDateDaysFromToday(days) {
            var result = new Date();
            result.setDate(result.getDate() + days);
            return result;
        }

        function getIsoDateFrom(date) {
            return date.toISOString().substring(0,10);
        }

        let items = [];
        let dates = [];
        switch (this.state.filter) {
            case '':
                items = this.state.items;
                break;
            case 'active':
                items = this.state.items.filter(item => !item.completed);
                break;
            case 'completed':
                items = this.state.items.filter(item => item.completed);
                break;
            case 'today':
                const todaysDate = getIsoDateFrom(new Date());
                items = this.state.items.filter(item => item.due_at == todaysDate);
                break;
            case '7days':
                dates = [];
                for (let i = 0; i < 7; i++) {
                    dates.push(getIsoDateFrom(getDateDaysFromToday(i)));
                }
                items = this.state.items.filter(item => dates.some(date => date == item.due_at));
                break;
            case '14days':
                dates = [];
                for (let i = 0; i < 14; i++) {
                    dates.push(getIsoDateFrom(getDateDaysFromToday(i)));
                }
                items = this.state.items.filter(item => dates.some(date => date == item.due_at));
                break;
            default:
                items = this.state.items.filter(item => item.tag_list.includes(this.state.filter));
                break;
        }
        if (this.state.search) {
            return items.filter(item => 
                item.description.toLowerCase().includes(this.state.search.toLowerCase()) || 
                item.tag_list.some(tag => tag.toLowerCase() === this.state.search.toLowerCase())
            );
        }
        return items;
    }

    updateTagList() {
        const allTags = flatten(this.state.items.map(item => item.tag_list));
        const allTagsSet = new Set(allTags);
        this.setState({ tags: Array.from(allTagsSet) }); 
    }

}

function flatten(arr) {
    return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}