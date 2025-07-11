/**
 * Webpack Optimization Configuration
 * Advanced bundle optimization for production deployment
 * Implements code splitting, lazy loading, and performance optimization
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    entry: {
        main: './src/main.js',
        calculator: './src/components/Calculator.js',
        analytics: './src/services/Analytics.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        clean: true
    },
    optimization: {
        // Enable tree shaking
        usedExports: true,
        sideEffects: false,
        
        // Split chunks configuration
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
                // Vendor bundle for third-party libraries
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10,
                    enforce: true
                },
                
                // Security bundle (critical, keep in main)
                security: {
                    test: /[\\/]src[\\/]security[\\/]/,
                    name: 'security',
                    chunks: 'all',
                    priority: 20,
                    enforce: true
                },
                
                // Calculator components bundle
                calculator: {
                    test: /[\\/]src[\\/]components[\\/]Calculator\.js/,
                    name: 'calculator',
                    chunks: 'async',
                    priority: 15
                },
                
                // Analytics bundle (lazy load)
                analytics: {
                    test: /[\\/]src[\\/]services[\\/]Analytics\.js/,
                    name: 'analytics',
                    chunks: 'async',
                    priority: 15
                },
                
                // Form components bundle
                forms: {
                    test: /[\\/]src[\\/]components[\\/].*Step\.js/,
                    name: 'forms',
                    chunks: 'async',
                    priority: 10
                },
                
                // Utilities bundle
                utils: {
                    test: /[\\/]src[\\/]utils[\\/]/,
                    name: 'utils',
                    chunks: 'async',
                    priority: 5
                },
                
                // Common bundle for shared code
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'async',
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        },
        
        // Runtime chunk for webpack runtime
        runtimeChunk: {
            name: 'runtime'
        },
        
        // Minimization configuration
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log', 'console.info']
                    },
                    mangle: {
                        safari10: true
                    },
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ]
    },
    
    // Module resolution
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@security': path.resolve(__dirname, 'src/security'),
            '@utils': path.resolve(__dirname, 'src/utils')
        }
    },
    
    // Module rules
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['> 1%', 'last 2 versions', 'not dead']
                                },
                                useBuiltIns: 'usage',
                                corejs: 3
                            }]
                        ],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    
    // Performance hints
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    
    // Plugins
    plugins: [
        // Compression plugin for gzip
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        
        // Bundle analyzer (optional, for development)
        ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
    ],
    
    // Development server configuration
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        port: 3000,
        hot: true,
        historyApiFallback: true
    }
}; 