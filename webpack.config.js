
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FlowWebpackPlugin = require('flow-webpack-plugin');


const common_settings = {
    entry: {
        dk: './src/index.js'
        // "dk-external": './src/externals.js'
    },
    target: 'web',

    output: {
        path: path.resolve(__dirname, 'dkjs/static/dkjs/js'),
        filename: '[name].[contenthash].min.js',
        chunkFilename: '[name].bundle.js',
        // library: '',
        library: '_dk',
        libraryTarget: "var"
    },
    
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                        // presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'dkjs/templates/dkjs/include-scripts.html'),
            inject: false,
            template: path.resolve(__dirname, 'src/html-webpack-plugin-django-template.html')
        }),
        // new FlowWebpackPlugin({
        //     verbose: true,
        //     printFlowOutput: true,
        //     reportingSeverity: 'warning'
        // })
    ],
    externals: {
        jquery: 'jQuery',
        loadash: 'lodash'
        // jquery: {
        //     commonjs: 'jQuery',
        //     commonjs2: 'jQuery',
        //     amd: 'jQuery',
        //     root: '$'
        // },
        // lodash: {
        //     commonjs: 'lodash',
        //     commonjs2: 'lodash',
        //     amd: 'lodash',
        //     root: '_'
        // }
    }
};

const dev_settings = merge(common_settings, {
    mode: 'development',   // production, none
    //devtool: 'eval',        // generated code
    // devtool: 'eval-source-map',      // original source
    devtool: 'cheap-module-eval-source-map',      // original source

    output: {
        filename: '[name].min.js',
    },
});

const prod_settings = merge(common_settings, {
    mode: 'production',
    devtool: 'source-map',

    output: {
        filename: '[name].[contenthash].min.js',
    }
});


module.exports = process.env.DKBUILD_TYPE === 'PRODUCTION' ? prod_settings : dev_settings;

