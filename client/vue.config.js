module.exports = {
  outputDir: '../src/client-dist',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9092',
      },
    },
  },
  publicPath: '/',
};
