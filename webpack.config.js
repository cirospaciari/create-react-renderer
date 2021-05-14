const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
// const webpack = 
//PUBLIC_URL,NODE_ENV
module.exports = {

    entry: './src/index.js',
    plugins: [
        //REACT_APP_ and NODE_ENV
        new DefinePlugin((() => {
            return Object.entries(process.env).reduce((obj, [key, value]) => {

                if (key.startsWith('REACT_APP_')) {
                    obj[`process.env.${key}`] = JSON.stringify(value || '');
                }
                return obj;
            }, {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            })
        })()),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public"),
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["**/index.html"],
                    },
                    to: path.resolve(__dirname, "build")
                },
            ],
            options: {
                concurrency: 100,
            },

        }),
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'index.html',
            template: 'public/index.html',
            livereload: mode === 'development' ? ' <script src="http://localhost:35729/livereload.js"></script> ' : ''
        }),

        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash].css',
            chunkFilename: 'static/css/[id].[contenthash].css',
        }),
        new GenerateSW({
            mode
        }),
        new WebpackAssetsManifest({
            entrypoints: true,
            entrypointsUseAssets: true,
            output: 'asset-manifest.json',
            transform: (assets, manifest) => {
                const entrypoints = assets.entrypoints;
                delete assets.entrypoints;
                return {
                    files: Object.entries(assets).reduce((obj, [key, value]) => {
                        if (!value.startsWith('/'))
                            value = '/' +  value;
                        obj[key] = value;
                        return obj;
                    }, {}),
                    entrypoints: [
                        ...(entrypoints?.main?.assets?.js || []),
                        ...(entrypoints?.main?.assets?.css || [])
                    ],
                };
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react',
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties', 'syntax-dynamic-import']
                    }
                }
            },


            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    publicPath: '/static/media/',
                    name(resourcePath, resourceQuery) {
                        // `resourcePath` - `/absolute/path/to/file.js`
                        // `resourceQuery` - `?foo=bar`

                        if (process.env.NODE_ENV === 'development') {
                            return '[name].[contenthash].[ext]';
                        }

                        return '[contenthash].[ext]';
                    },
                    outputPath: (url, resourcePath, context) => {
                        return `static/media/${url}`;
                    }
                },

            },
            {
                test: /\.s?(c|a)ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    // [css-loader](/loaders/css-loader)
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: mode === 'development'
                        }
                    },
                    // [sass-loader](/loaders/sass-loader)
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: mode === 'development'
                        }
                    }
                ],
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    mode,
    output: {
        filename: 'static/js/[name].[fullhash].js',
        chunkFilename: 'static/js/[id].[chunkhash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: '/'
    },
    watch: mode === 'development',
    devtool: mode === 'development' ? 'eval-source-map' : undefined,
    watchOptions: {
        aggregateTimeout: 600,
        ignored: /node_modules/
    }
};
