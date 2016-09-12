const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = (nodeEnv === 'production');

module.exports = {
    devtool: isProduction ? 'hidden-source-map' : 'cheap-eval-source-map',
    context: path.join(__dirname, './lib'),
    entry: {
        js: './global/shower.global.js'
    },
    output: {
        path: __dirname,
        filename: 'shower.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'babel-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['', '.js'],
        modules: [
            path.resolve('./lib'),
            'node_modules'
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false
        }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        })
    ]
}
