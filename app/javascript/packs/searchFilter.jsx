import React from 'react';

export default class SearchFilter extends React.Component {
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
                            <button className="btn btn-outline-info" onClick={() => this.props.setSearch('')}><i className="fas fa-times"></i></button>
                        </div>
                    </div>
                </li>
                <button key="all" className={this.props.filter ? "list-group-item list-group-item-action py-2" : "list-group-item list-group-item-info list-group-item-action py-2"} onClick={(e) => this.props.setFilter('')}>
                    <div className="d-flex justify-content-between align-items-center">
                        All todos
                        <i className="fas fa-align-justify"></i>
                    </div>
                </button>
                <button key="active" className={this.props.filter === "active" ? "list-group-item list-group-item-info list-group-item-action py-2" : "list-group-item list-group-item-action py-2"} onClick={(e) => this.props.setFilter('active')}>
                    <div className="d-flex justify-content-between align-items-center">
                        Active todos
                        <i className="far fa-square"></i>
                    </div>
                </button>
                <button key="completed" className={this.props.filter === "completed" ? "list-group-item list-group-item-info list-group-item-action py-2" : "list-group-item list-group-item-action py-2"} onClick={(e) => this.props.setFilter('completed')}>
                    <div className="d-flex justify-content-between align-items-center">
                        Completed todos
                        <i className="far fa-check-square"></i>
                    </div>
                </button>
                {this.props.tags.map(tag => 
                    <button 
                        key={tag} 
                        className={this.props.filter === tag ? "list-group-item list-group-item-info list-group-item-action py-2" : "list-group-item list-group-item-action py-2"}
                        onClick={() => this.props.setFilter(tag)}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            {tag}
                            <i className="fas fa-tag"></i>
                        </div>
                    </button>
                )}
            </div>
        );
    }
}