import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    clean: true            // wipes /dist on each build
  },
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
    open: false             // auto‑opens browser
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',  // source file
      inject: 'body'             // adds <script> before </body>
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,                 //  ⟵  all *.css files
        use: ['style-loader', 'css-loader'],
        // css‑loader  → resolves @import / url()
        // style‑loader → injects <style> into <head>
      }
    ]
  }
};
