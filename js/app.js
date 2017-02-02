const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const IndexRoute = require('react-router').IndexRoute;
const Link = require('react-router').Link;
const hashHistory = require("react-router").hashHistory
const App = require('./components/app');
const Home = require('./components/home');

require('./../node_modules/basscss/css/basscss.css');
require('./../node_modules/basscss-forms/index.css');
require('./../node_modules/basscss-btn/index.css');
require('./../node_modules/basscss-btn-outline/css/btn-outline.css');
require('./../node_modules/basscss-btn-primary/css/btn-primary.css');
require('./../node_modules/basscss-btn-sizes/css/btn-sizes.css');
require('./../node_modules/basscss-colors/css/colors.css');
require('./../node_modules/basscss-background-colors/css/background-colors.css');
require('./../node_modules/basscss-border-colors/css/border-colors.css');
require('./../less/all.less');

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
      </Route>
    </Router>
, document.getElementById('app'));
