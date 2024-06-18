// frontend/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // React 앱의 진입점
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // TypeScript 파일을 위한 규칙
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // CSS 파일을 위한 규칙
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML 템플릿 파일
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // 정적 파일 경로
    },
    port: 3000,
    historyApiFallback: true, // SPA에서 라우팅을 지원
  },
  mode: 'development', // 개발 모드 설정
};