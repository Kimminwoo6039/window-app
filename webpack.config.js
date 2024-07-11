// webpack.config.js 또는 webpack 설정 파일

const path = require('path');

module.exports = {
  // 기존 설정들...
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  },
  eslint:{
    ignoreDuringBuilds: true
  },
  externals: {
    "better-sqlite3": "commonjs better-sqlite3",
  },
};
