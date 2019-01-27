import React from 'react';
import TodoItem from './todoItem';

export default class TodoList extends React.Component {
    render() {
        if (this.props.items.length) {
            return (
                <ul className="shadow list-group">
                    {this.props.items.map(item => <TodoItem key={item.id} id={item.id} text={item.description} completed={item.completed} date={item.due_at} tagList={item.tag_list} deleteHandler={this.props.deleteHandler} editHandler={this.props.editHandler} setFilter={this.props.setFilter}/>)}
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