const {resolve} = require('path')

module.exports = {
  entry: resolve('src/signal.js'),
  experiments: { outputModule: true },
  output: {
    filename: 'index.js',
    library: { type: "module" }
  },
  mode: 'production'
}
