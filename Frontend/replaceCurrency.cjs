const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace >$ with >₹ (like >${price} or >$10)
    content = content.replace(/>\$/g, '>₹');
    
    // Replace $$ with ₹$ (for template strings like `$${price}`)
    content = content.replace(/\$\$\{/g, '₹${');
    
    // Replace ' $' or ' $100' with ' ₹'
    content = content.replace(/ \$/g, ' ₹');
    
    // Replace • $ with • ₹
    content = content.replace(/• \$/g, '• ₹');

    // For things like "\$" inside quotes that we might have missed
    // if it's literal string "$100"
    content = content.replace(/"\$/g, '"₹');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated currency in ${filePath}`);
    }
  }
});
