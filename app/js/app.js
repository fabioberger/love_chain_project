require("babel-polyfill");
const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const IndexRoute = require('react-router').IndexRoute;
const Link = require('react-router').Link;
const hashHistory = require("react-router").hashHistory
const App = require('js/components/app');
const Home = require('js/components/pages/home');
const About = require('js/components/pages/about');
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

require('basscss/css/basscss.css');
require('basscss-forms/index.css');
require('basscss-btn/index.css');
require('basscss-btn-outline/css/btn-outline.css');
require('basscss-btn-primary/css/btn-primary.css');
require('basscss-btn-sizes/css/btn-sizes.css');
require('basscss-colors/css/colors.css');
require('basscss-background-colors/css/background-colors.css');
require('basscss-border-colors/css/border-colors.css');
require('less/all.less');

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
      </Route>
    </Router>
, document.getElementById('app'));
