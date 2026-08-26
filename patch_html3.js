const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const search = `<div id="pdf-export-area" style="background: white; padding: 2rem; color: #000; font-family: 'Inter', sans-serif;">`;
const replace = `<div id="pdf-export-area" class="hidden" style="background: white; padding: 2rem; color: #000; font-family: 'Inter', sans-serif;">`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('index.html', code);
    console.log('index.html patched');
} else {
    console.log('Search block not found in index.html');
}
