const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const search = `        // 2. Create a Temporary Print Container directly attached to body
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '0';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '210mm';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.color = '#000000';
        tempContainer.style.zIndex = '-9999';`;

const replace = `        // 2. Create a Temporary Print Container directly attached to body
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.color = '#000000';
        tempContainer.style.zIndex = '-9999';`;

const search2 = `            // 5. Generate & Clean Up AFTER promise resolves
            html2pdf().set(opt).from(tempContainer).save().then(() => {
                tempContainer.remove();
            }).catch(err => {
                console.error('PDF Generation failed', err);
                tempContainer.remove();
            });`;

const replace2 = `            // 5. Generate & Clean Up AFTER promise resolves
            html2pdf().set(opt).from(tempContainer).save().then(() => {
                tempContainer.remove();
            }).catch(err => {
                console.error('PDF Generation failed', err);
                tempContainer.remove();
            });`;

if (code.includes(search)) {
    code = code.replace(search, replace);
}
if (code.includes(search2)) {
    code = code.replace(search2, replace2);
}

fs.writeFileSync('script.js', code);
console.log('script.js patched');
