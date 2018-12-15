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
        this.state = { items: [], text: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.updateToLatestState = this.updateToLatestState.bind(this);
    }

    componentDidMount() {
        this.updateToLatestState();
    }

    render() {
        return (
            <main>
                <div className="container">
                    <div className="row mt-5 d-flex justify-content-between">
                        <h1 className="display-4 text-white">Todolist</h1>
                        <span className="text-white">Built with Ruby on Rails, React and Bootstrap</span>
                    </div>
                    <div className="row mb-5">
                        <div className="col-2">
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
                                    <TodoList items={this.state.items} deleteHandler={this.handleDelete} completeHandler={this.handleComplete} editHandler={this.handleEdit} />
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
        if (!this.state.text.length) { return;}
        
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
            this.updateToLatestState();
            this.setState({text: ''});
            /*
            this.setState(state => ({
                items: state.items.concat(todo),
                text: ''
            }));
            */
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
            this.updateToLatestState();
            // this.setState({ items: this.state.items.filter(item => item.id != key) }) 
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
            this.updateToLatestState();
            /*
            let items = [...this.state.items];
            const index = items.findIndex(item => item.id == data.id);
            let item = { ...items[index] };
            item.description = data.description;
            items[index] = item;
            this.setState({ items });
            */
        });
        
    }

    handleComplete(todo) {

        fetch(`api/todos/${todo.id}`, {
            method: 'PUT',
            body: JSON.stringify({todo: todo}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => { return response.json(); })
        .then((data) => { 
            this.updateToLatestState();
            /*
            let items = [...this.state.items];
            const index = items.findIndex(item => item.id == data.id);
            let item = { ...items[index] };
            item.completed = data.completed;
            items[index] = item;
            this.setState({ items });
            */
        });
        

    }

    updateToLatestState() {
        try {
            fetch(`/api/todos`)
            .then((response) => { return response.json(); })
            .then((data) => { this.setState({ items: data }); });
        } catch (err) {
            console.log('fetch failed', err);
        }
    }

}

class TodoList extends React.Component {
    render() {
        return (
            <ul className="shadow list-group">
                {this.props.items.map(item => <Todo key={item.id} id={item.id} text={item.description} completed={item.completed} deleteHandler={this.props.deleteHandler} completeHandler={this.props.completeHandler} editHandler={this.props.editHandler} />)}
            </ul>       
        );
    }
}

class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.state = { editing: false, text: this.props.text };
        this.handleChange = this.handleChange.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleEditing(e) {
        this.setState({ editing: !this.state.editing });
    }

    render() {

        if (this.state.editing) {
            return (
                <li className="list-group-item" key={this.props.id} >
                    <div class="input-group">
                        <input className="form-control form-control-sm" onChange={this.handleChange} value={this.state.text} />
                        <div class="input-group-append">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                                let editedTodo = {id: this.props.id, description: this.state.text};
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
                        <div class="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={this.props.completed}
                                onChange={() => {
                                    let editedTodo = {id: this.props.id, completed: !this.props.completed};
                                    this.props.completeHandler(editedTodo);
                                }}
                            />
                            <label class="form-check-label">
                                {this.props.completed ? <del>{this.state.text}</del> : <span>{this.state.text}</span>}
                            </label>
                        </div>
                    </div>
                    <div className="btn-group btn-group-sm" role="group">
                        <button className="btn btn-light" onClick={this.handleEditing}>Edit</button>
                        <button className="btn btn-light" onClick={() => this.props.deleteHandler(this.props.id)}>Delete</button>
                    </div>
                </li>
            );
        }

    }

}