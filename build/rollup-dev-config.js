const { input, output } = require('./rollup-base-config')[0]

const _config = Object.assign({}, input, { output })

module.exports = _config
