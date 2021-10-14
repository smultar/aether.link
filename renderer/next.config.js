const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
      config.node = {
        __dirname: true,
      }
    }

    config.output.globalObject = 'this'
    return config;
  },

  sassOptions: {
    includePaths: [path.join('./public/styles', 'styles')],
  },

  pluginOptions: {
    electronBuilder: {
        nodeIntegration: true
    }
  },

};
