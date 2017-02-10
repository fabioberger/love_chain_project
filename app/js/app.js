import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import App from 'js/components/app';
import Home from 'js/components/pages/home';
import About from 'js/components/pages/about';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import 'basscss/css/basscss.css';
import 'basscss-forms/index.css';
import 'basscss-btn/index.css';
import 'basscss-btn-outline/css/btn-outline.css';
import 'basscss-btn-primary/css/btn-primary.css';
import 'basscss-btn-sizes/css/btn-sizes.css';
import 'basscss-colors/css/colors.css';
import 'basscss-background-colors/css/background-colors.css';
import 'basscss-border-colors/css/border-colors.css';
import 'less/all.less';

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
      </Route>
    </Router>
, document.getElementById('app'));
