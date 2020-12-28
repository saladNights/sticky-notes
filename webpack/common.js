const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.resolve(root, 'src');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['awesome-typescript-loader'],
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
          },
          'sass-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /\.module\.scss$/
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': srcDir,
      '@components': path.resolve(__dirname, '../src/components/'),
      '@uiKit': path.resolve(__dirname, '../src/uiKit/'),
      '@helpers': path.resolve(__dirname, '../src/helpers/'),
      '@styles': path.resolve(__dirname, '../src/styles/'),
      '@constants': path.resolve(__dirname, '../src/constants.ts'),
      '@config': path.resolve(__dirname, '../src/config.ts'),
    },
  },
  output: {
    publicPath: '',
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/assets/images/favicons'),
          to: path.resolve(__dirname, '../dist'),
        }
      ]
    }),
    new WebpackPwaManifest({
      filename: 'manifest.json',
      // publicPath: '',
      includeDirectory: false,
      name: 'Stick!',
      short_name: 'Stick!',
      icons: [
        { src: path.resolve(__dirname, '../src/assets/images/favicons/android-chrome-192x192.png'), sizes: '192x192' },
        { src: path.resolve(__dirname, '../src/assets/images/favicons/android-chrome-512x512.png'), sizes: '512x512' }
      ],
    }),
  ],
};
