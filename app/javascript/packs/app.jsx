import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';

document.addEventListener('DOMContentLoaded', () => {
    document.body.style = 'background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);';
    ReactDOM.render(
        <Main/>,
        document.body.appendChild(document.createElement('div')),
    )
});