import React from 'react';
import ReactDOM from 'react-dom';
import LoginApp from './loginApp'
import App from './app';
import './index.css';
import {Login, Register, Home} from './login'
import Calculator from './calculator'
import About from './About';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/" component={LoginApp}>
          <Route path="/home" component={Home}/>
          <Route path="/about" component={About} />          
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
        </Route>
      <Route path='/portfolio' component={App}>
          <IndexRoute component={Calculator} />
      </Route>
  </Router>,
  document.getElementById('root')
);
