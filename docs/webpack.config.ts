import path from 'path';
import webpack from 'webpack';

// tslint:disable-next-line:no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config: webpack.Configuration = {
  mode: 'production',
  entry: {
    main: './assets/scripts/main.ts',
    intro: './assets/scripts/intro/intro.ts',
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'scss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 类似于webpackOptions.output中的相同选项
      // 这两个选项都是可选的
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  devtool: 'source-map',
};

export default config;
