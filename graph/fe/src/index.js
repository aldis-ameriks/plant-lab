import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './utils/registerServiceWorker';
import HomePage from './pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<HomePage />, document.getElementById('root'));
registerServiceWorker();
