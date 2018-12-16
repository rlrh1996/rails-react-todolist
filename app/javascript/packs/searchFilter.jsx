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