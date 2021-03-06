var path = require('path')
var webpack = require('webpack')
var WebpackShellPlugin = require('webpack-shell-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var setting = {
    entry: {
        "xt.core.web.min": "./src/Core/web/main.ts",
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist/Core",
        libraryTarget: "umd",
        library: "XT",
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: "awesome-typescript-loader" },
        ],
    },
    externals: {
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            output: { comments: false },
        }),
    ],
}