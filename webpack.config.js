const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        },
    };

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
        ]
    }

    return config;
};

const cssLoaders = () => {
    const loaders = [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
    ];

    return loaders;
};

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ];

    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        hot:false,
        liveReload: true,
        static: {
            directory: path.resolve(__dirname, 'dist'),
    },
    },
    entry: './js/index.js',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: "assets/[hash][ext][query]"
    },
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: cssLoaders(),
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: plugins(),
};