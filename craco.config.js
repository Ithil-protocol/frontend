const CracoAlias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
};
