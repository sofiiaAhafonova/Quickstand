let path = require('path');
let webpack = require('webpack');

module.exports = {
    entry: {
        'bundle': './client/',
    },
    output: {
        path: path.join(__dirname + '/public', 'dist'),
        filename: '[name].js',
        publicPath: '/static/',
        libraryTarget: 'umd',
        library: '[name]'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: path.join(__dirname, 'client')
            }
        ]
    }
};