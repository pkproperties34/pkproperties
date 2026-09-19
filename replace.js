const fs = require('fs');
const path = require('path');

const replaceInDir = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000/api')) {
        content = content.replace(/['"`]http:\/\/localhost:5000\/api(.*?)['"`]/g, '`${import.meta.env.VITE_API_URL}$1`');
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  });
};

replaceInDir('client/src');
