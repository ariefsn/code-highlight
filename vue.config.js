const host = process.env.VUE_APP_HOST || '127.0.0.1'
const port = process.env.VUE_APP_PORT || 4000

module.exports = {
  runtimeCompiler: true,
  devServer: {
    host: host,
    port: port
  },
  transpileDependencies: [
    'vuetify'
  ]
}
