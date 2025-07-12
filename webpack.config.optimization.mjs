// Webpack config for ESM compatibility (for Node.js v14+)
import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'production',
    entry: {
        main: './src/main.js',
        calculator: './src/core/Calculator.js',
        analytics: './src/services/Analytics.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        clean: true
    },
    optimization: {
        usedExports: true,
        sideEffects: false,
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
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
    resolve: {
        extensions: ['.js']
    }
};
