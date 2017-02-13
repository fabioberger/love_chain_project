import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'js/components/app';
import Home from 'js/components/pages/home';
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
    <App>
        <Home/>
    </App>
    , document.getElementById('app'));
