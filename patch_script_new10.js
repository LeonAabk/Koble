const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const search = `        // 1. Clone the Content
        const clonedContent = pdfExportArea.cloneNode(true);
        clonedContent.classList.remove('hidden');
        clonedContent.style.display = 'block';

        // Hide UI buttons from final PDF
        const btns = clonedContent.querySelectorAll('button');
        btns.forEach(btn => btn.style.display = 'none');

        // Remove box-shadow and border-radius from elements to strip web CSS
        clonedContent.style.boxShadow = 'none';
        clonedContent.style.borderRadius = '0';
        clonedContent.style.margin = '0';
        clonedContent.style.padding = '0';

        // Ensure black text color
        clonedContent.style.color = '#000000';

        const allElements = clonedContent.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.boxShadow = 'none';
            el.style.borderRadius = '0';
            if (el.tagName !== 'DIV') {
                el.style.color = '#000000';
            }
        });

        // 2. Create a Temporary Print Container directly attached to body
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.backgroundColor = '#ffffff';
        tempContainer.style.color = '#000000';
        tempContainer.style.zIndex = '-9999';

        // 3. Strip Web CSS
        tempContainer.style.display = 'block';
        tempContainer.style.visibility = 'visible';
        tempContainer.style.padding = '20mm';
        tempContainer.style.boxShadow = 'none';
        tempContainer.style.borderRadius = '0';

        tempContainer.appendChild(clonedContent);
        document.body.appendChild(tempContainer);

        // 4. Force DOM layout update by delaying snapshot
        tempContainer.offsetHeight; // force layout
        setTimeout(() => {
            const opt = {
                margin:       0, // Handled by the container's padding instead
                filename:     'Koble-Avtale.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 }, // 794px is A4 width at 96 DPI
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // 5. Generate & Clean Up AFTER promise resolves
            html2pdf().set(opt).from(clonedContent).save().then(() => {
                tempContainer.remove();
            }).catch(err => {
                console.error('PDF Generation failed', err);
                tempContainer.remove();
            });
        }, 150);`;

const replace = `        // 1. Temporarily unhide the container off-screen
        const origDisplay = pdfExportArea.style.display;
        const origPosition = pdfExportArea.style.position;
        const origLeft = pdfExportArea.style.left;
        const origTop = pdfExportArea.style.top;
        const origZIndex = pdfExportArea.style.zIndex;

        pdfExportArea.classList.remove('hidden');
        pdfExportArea.style.display = 'block';
        pdfExportArea.style.position = 'absolute';
        pdfExportArea.style.left = '0';
        pdfExportArea.style.top = '0';
        pdfExportArea.style.zIndex = '-9999';

        setTimeout(() => {
            // 2. Clone the Content
            const clonedContent = pdfExportArea.cloneNode(true);

            // Hide UI buttons from final PDF
            const btns = clonedContent.querySelectorAll('button');
            btns.forEach(btn => btn.style.display = 'none');

            // Enforce basic, print-friendly CSS on the contract container during generation
            clonedContent.style.color = '#000000';
            clonedContent.style.backgroundColor = '#ffffff';
            clonedContent.style.width = '794px';
            clonedContent.style.padding = '20px';
            clonedContent.style.position = 'static';

            // Remove box-shadow and border-radius from elements to strip web CSS
            clonedContent.style.boxShadow = 'none';
            clonedContent.style.borderRadius = '0';
            clonedContent.style.margin = '0';

            const allElements = clonedContent.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.boxShadow = 'none';
                el.style.borderRadius = '0';
                if (el.tagName !== 'DIV') {
                    el.style.color = '#000000';
                }
            });

            // 3. Create a Temporary Print Container
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.top = '0';
            tempContainer.style.left = '0';
            tempContainer.style.width = '210mm';
            tempContainer.style.background = '#ffffff';
            tempContainer.style.color = '#000000';
            tempContainer.style.zIndex = '-9999';

            // 4. Strip Web CSS
            tempContainer.style.display = 'block';
            tempContainer.style.padding = '20mm';
            tempContainer.style.boxShadow = 'none';
            tempContainer.style.borderRadius = '0';

            tempContainer.appendChild(clonedContent);
            document.body.appendChild(tempContainer);

            setTimeout(() => {
                const opt = {
                    margin:       0,
                    filename:     'Koble-Avtale.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                // 5. Generate & Clean Up via promise
                html2pdf().set(opt).from(tempContainer).save().then(() => {
                    tempContainer.remove();
                    pdfExportArea.style.display = origDisplay;
                    pdfExportArea.style.position = origPosition;
                    pdfExportArea.style.left = origLeft;
                    pdfExportArea.style.top = origTop;
                    pdfExportArea.style.zIndex = origZIndex;
                    pdfExportArea.classList.add('hidden');
                }).catch(err => {
                    console.error('PDF Generation failed', err);
                    tempContainer.remove();
                    pdfExportArea.style.display = origDisplay;
                    pdfExportArea.style.position = origPosition;
                    pdfExportArea.style.left = origLeft;
                    pdfExportArea.style.top = origTop;
                    pdfExportArea.style.zIndex = origZIndex;
                    pdfExportArea.classList.add('hidden');
                });
            }, 100);
        }, 100);`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('script.js', code);
    console.log('script.js patched');
} else {
    console.log('Search block not found in script.js');
}
