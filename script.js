function generate() {
    const data = document.getElementById('input-main').value || "XpertZones";
    const qrCanvas = document.querySelector('#canvas-wrapper canvas:not(#barcode-canvas)');
    const bcCanvas = document.getElementById('barcode-canvas');

    // Add fade animation
    if (currentMode === 'qr' && qrCanvas) {
        qrCanvas.classList.add('updating');
    }
    if (currentMode === 'barcode' && bcCanvas) {
        bcCanvas.classList.add('updating');
    }

    setTimeout(() => { // Wait for fade-out
        if (currentMode === 'qr') {
            bcCanvas.classList.add('hidden');
            if (qrCanvas) qrCanvas.classList.remove('hidden');

            let content = data;
            if(activeType === 'wifi') {
                const pass = document.getElementById('wifi-pass').value;
                const enc = document.getElementById('wifi-enc').value;
                content = `WIFI:S:${data};T:${enc};P:${pass};;`;
            }

            qrCode.update({
                data: content,
                dotsOptions: { color: document.getElementById('color-qr').value, type: qrShape },
                backgroundOptions: { color: document.getElementById('color-bg').value },
                image: logoData
            });

        } else {
            bcCanvas.classList.remove('hidden');
            if (qrCanvas) qrCanvas.classList.add('hidden');

            JsBarcode("#barcode-canvas", data, {
                format: "CODE128",
                lineColor: document.getElementById('color-qr').value,
                background: document.getElementById('color-bg').value,
                width: 2,
                height: 100,
                displayValue: true
            });
        }

        // Remove fade class to fade back in
        if (currentMode === 'qr' && qrCanvas) qrCanvas.classList.remove('updating');
        if (currentMode === 'barcode' && bcCanvas) bcCanvas.classList.remove('updating');

    }, 150); // 150ms fade-out before update
}
