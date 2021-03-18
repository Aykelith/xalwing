import * as webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import path from 'path';
import jsonfile from 'jsonfile';

declare global {
    namespace NodeJS {
        interface Global {
            webpackConfig: any;
            WEBPACK_HOT_RELOAD_URL: any;
        }
    }
}

if (!global.webpackConfig) {
    if (!process.env.WEBPACK_CONFIG) throw new Error('webpack.base: "WEBPACK_CONFIG" is missing');

    global.webpackConfig = jsonfile.readFileSync(process.env.WEBPACK_CONFIG);
}

const isProduction = global.webpackConfig.environment === 'production';

if (!global.webpackConfig.url) throw new Error('webpack.base: "config.url" is missing');

const projectName = global.webpackConfig.projectName || process.env.PACKAGE_NAME;

process.chdir(path.join(__dirname, '..', 'packages', projectName));
const RootPath = process.cwd();

let extraPlugins = [];
let extraOptimizations = {};

if (isProduction) {
    const TerserJSPlugin = require('terser-webpack-plugin');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
    const CompressionPlugin = require('compression-webpack-plugin');

    extraPlugins = [
        new CompressionPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
        }),
    ];

    extraOptimizations = {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    };
}

if (process.env.GSP_BUNDLE_ANALYZE) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    extraPlugins.push(new BundleAnalyzerPlugin());
}

if (process.env.GSP_HOT_RELOAD) {
    extraPlugins.push(
        //new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: 'whm',
            },
        })
        //new webpack.NoEmitOnErrorsPlugin()
    );

    global.WEBPACK_HOT_RELOAD_URL = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'];
} else {
    global.WEBPACK_HOT_RELOAD_URL = [];
}

export default function (settings: any): webpack.Configuration {
    const DefinePluginArgs = {
        __production: isProduction ? 'true' : 'false',
        'process.env': {
            NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
        },
        WEBPACK_URL: JSON.stringify(global.webpackConfig.url),

        ...(settings.defines || {}),
    };

    const plugins = [
        new webpack.DefinePlugin(DefinePluginArgs),
        ...extraPlugins,
        ...(settings.extraPlugins || []),
        new webpack.ProvidePlugin({
            //Stream: ["stream", "stream-browserify"],
            Buffer: ['buffer', 'Buffer'],
        }),
    ];

    return {
        mode: isProduction ? 'production' : 'development',
        entry: settings.entry,
        context: path.join(RootPath, 'src'),
        target: 'web',
        output: {
            path: path.join(RootPath, '..', '..', 'tmp', 'builds', `web_${projectName}`, 'generated'),
            publicPath: '/generated/',
            chunkFilename: '[name].[contenthash].chunk.js',
            filename: '[name].[hash].bundle.js',
        },
        devtool: isProduction ? 'source-map' : 'eval',
        module: {
            rules: [
                {
                    test: /\.worker\.js$/,
                    use: { loader: 'worker-loader' },
                },
                {
                    test: /\.(jsx?|tsx?)$/,
                    exclude: [...(settings.babelExclude || []), /\.tem\.js$/],
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: path.join(__dirname, '..', 'tmp', 'babel_cache', projectName),
                        ignore: [
                            new RegExp(
                                `node_modules${path.sep === '\\' ? '\\\\' : '/'}(?!core_web)(?!app_crm_reactjs_core)`
                            ),
                        ],
                        presets: [
                            ['@babel/preset-typescript'],
                            [
                                '@babel/env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                },
                            ],
                            '@babel/react',
                        ],
                        plugins: [
                            [
                                'module-resolver',
                                {
                                    root: [path.join(RootPath, 'src')],
                                },
                            ],
                            ['@babel/plugin-syntax-object-rest-spread'],
                            ['@babel/plugin-syntax-dynamic-import'],
                            ['@babel/plugin-syntax-async-generators'],
                            ['@babel/plugin-transform-regenerator'],
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            !isProduction && require.resolve('react-refresh/babel'),
                        ].filter(Boolean),
                    },
                },

                {
                    test: /\.scss|.css$/,
                    use: [
                        isProduction
                            ? {
                                  loader: require('mini-css-extract-plugin').loader,
                                  options: {
                                      publicPath: '/',
                                  },
                              }
                            : {
                                  loader: 'style-loader',
                              },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require.resolve('autoprefixer'),
                                        ...(settings.loaderOptions?.postcss?.plugins || []),
                                    ],
                                },
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {},
                        },
                        /*{
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                sassOptions: {
                                    includePaths: [path.join(RootPath, 'src')],
                                },
                                sourceMap: true,
                            },
                        },*/
                    ],
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: '@svgr/webpack',
                            options: {
                                icon: true,
                                // replaceAttrValues:
                            },
                        },
                    ],
                },
            ],
        },
        plugins,
        optimization: {
            ...extraOptimizations,
        },
        resolve: {
            modules: [path.join(RootPath, 'node_modules'), path.join(RootPath, '..')],
            aliasFields: ['browser'],
            alias: {
                buffer: 'buffer',
                //stream: "stream-browserify",
                //_stream_duplex: "readable-stream/duplex",
                //_stream_passthrough: "readable-stream/passthrough",
                //_stream_readable: "readable-stream/readable",
                //_stream_transform: "readable-stream/transform",
                //_stream_writable: "readable-stream/writable",
                util: 'util',
                ...(settings.alias || {}),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            fallback: {
                assert: false,
                util: false,
                events: false,
                buffer: false,
            },
        },
        externals: {
            fs: '{}',
            tls: '{}',
            net: '{}',
            console: '{}',
            v8: '{}',
        },
    };
}
