const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./app/js/app.js'],
    output: {
        path: path.join(__dirname, '/app/public'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [
            path.join(__dirname, '/app/js'),
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            js: path.join(__dirname, '/app/js'),
            less: path.join(__dirname, '/app/less'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: ['lodash'],
                    presets: ['react'],
                },
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
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
