import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App/>, document.getElementById('mount-point'));
serviceWorker.unregister();