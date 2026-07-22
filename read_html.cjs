const fs = require('fs');
const lines = fs.readFileSync('src/pages/product.html', 'utf8').split('\n');
lines.slice(300, 420).forEach((l, i) => console.log(`${i + 301}: ${l}`));
