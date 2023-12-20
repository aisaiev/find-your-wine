import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: { import: 'src/background.ts', runtime: false },
    'content-script': 'src/content-script.ts',
  },
} as Configuration;
