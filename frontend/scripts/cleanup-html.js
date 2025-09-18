const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/find-your-wine/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Remove all <style>...</style>
html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

// Remove all <noscript>...</noscript>
html = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

// Remove all <link rel="stylesheet" ...>
html = html.replace(/<link\s+rel=["']stylesheet["'][^>]*?>/gi, '');

// Add <link rel="stylesheet" href="styles.css"> before </head>
html = html.replace(
  /<\/head>/i,
  '  <link rel="stylesheet" href="styles.css">\n</head>'
);

fs.writeFileSync(indexPath, html);