/* eslint-disable */
const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './index.ts'],
    experiments: {
        topLevelAwait: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: 'bundle.js',
        filename: 'bundle.js',
        publicPath: '/dist/',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            configFile: './babel.config.js',
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
            },
        ],
    },
    mode: "production"
};
