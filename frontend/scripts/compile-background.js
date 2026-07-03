const esbuild = require('esbuild');
const path = require('path');

const outDir = path.join(__dirname, '../dist/find-your-wine');

esbuild.build({
  entryPoints: [path.join(__dirname, '../src/background.ts')],
  bundle: true,
  outfile: path.join(outDir, 'background.js'),
  format: 'iife',
  platform: 'browser',
  tsconfig: path.join(__dirname, '../tsconfig.app.json'),
}).catch(() => process.exit(1));
