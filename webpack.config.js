var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        // "test" is commonly used to match the file extension
        test: /\.jsx?$/,

        // "include" is commonly used to match the directories
        // include: [
        //     path.resolve(__dirname, "src"),
        //     path.resolve(__dirname, "test"),
        //     path.resolve(__dirname, "examples", "**"),
        // ],

        exclude: [path.resolve(__dirname, 'node_modules')],

        // "exclude" should be used to exclude exceptions
        // try to prefer "include" when possible

        // the "loader"
        loader: 'babel?cacheDirectory=.babel-cache'
      }
    ]
  }
};
