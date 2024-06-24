// webpack.config.js

const path = require('path');

module.exports = {
  // other webpack configuration options
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "fs": false, // or provide a polyfill if necessary
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib")
    }
  },
  // other webpack configuration options
};
