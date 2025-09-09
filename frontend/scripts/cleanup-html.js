const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/find-your-wine/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Видалити всі <style>...</style>
html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

// Видалити всі <noscript>...</noscript>
html = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

// Видалити всі <link rel="stylesheet" ...>
html = html.replace(/<link\s+rel=["']stylesheet["'][^>]*?>/gi, '');

// Додати <link rel="stylesheet" href="styles.css"> перед </head>
html = html.replace(
  /<\/head>/i,
  '  <link rel="stylesheet" href="styles.css">\n</head>'
);

fs.writeFileSync(indexPath, html);