const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./js/app.js'],
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'bundle.js',
    },
    resolve: {
        root: [path.join(__dirname, '/js')],
        extensions: ['', '.js', '.jsx', '.json'],
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react'],
                },
            },
            {
                test: /\.less$/,
                loader: 'style!css!less',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
        ],
    },
    devServer: {
        port: 8080,
        historyApiFallback: {
          index: 'index.html'
        }
    },
};
