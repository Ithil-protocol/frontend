module.exports = function override(config, env) {
  //do stuff with the webpack config...

  return Object.assign(config, {
    // @walletconnect generates source map problems, ref: https://github.com/rainbow-me/rainbowkit/issues/774
    ignoreWarnings: [/Failed to parse source map/],
  })
}
