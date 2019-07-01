module.exports = {
  entry: './src/frontend/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    port: 3000,
    open: true,
    proxy: {
        "/api": "http://localhost:3001"
    }
  },
  module: {
    rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }
    ]
  },
  devtool: 'inline-source-map',
};