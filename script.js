let mode = 'url';
let qrCode;
let qrShape = 'square';

// Initialize QR code object
qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: "https://xpertzones.com",
    dotsOptions: { color: "#000000", type: "square" },
    backgroundOptions: { color: "#ffffff" }
});

window.onload = () => {
    qrCode.append(document.getElementById("qr-container"));
    generate(); 
};

function setMode(newMode) {
    mode = newMode;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${newMode}`).classList.add('active');
    
    document.querySelectorAll('.mode-input').forEach(div => div.classList.add('hidden'));
    document.getElementById(`field-${newMode === 'barcode' ? 'barcode' : 'url'}`).classList.remove('hidden');
    if(newMode === 'wifi') document.getElementById('field-wifi').classList.remove('hidden');

    // Toggle Design Panels
    if (newMode === 'barcode') {
        document.getElementById('qr-design-options').classList.add('hidden');
        document.getElementById('bc-design-options').classList.remove('hidden');
    } else {
        document.getElementById('qr-design-options').classList.remove('hidden');
        document.getElementById('bc-design-options').classList.add('hidden');
    }
}

function generate() {
    const bcCanvas = document.getElementById('barcode-canvas');
    const qrDiv = document.getElementById('qr-container');

    if (mode === 'barcode') {
        bcCanvas.classList.remove('hidden');
        qrDiv.classList.add('hidden');
        
        let data = document.getElementById('input-barcode-val').value || "12345678";
        let format = document.getElementById('bc-format').value;
        let w = document.getElementById('bc-width').value;
        let h = document.getElementById('bc-height').value;

        try {
            JsBarcode("#barcode-canvas", data, {
                format: format,
                width: parseFloat(w),
                height: parseFloat(h),
                displayValue: true
            });
        } catch(e) {
            alert("Invalid data for selected barcode format!");
        }
    } else {
        bcCanvas.classList.add('hidden');
        qrDiv.classList.remove('hidden');

        let content = document.getElementById('input-url').value || "https://xpertzones.com";
        if (mode === 'wifi') {
            content = `WIFI:S:${document.getElementById('wifi-ssid').value};T:${document.getElementById('wifi-enc').value};P:${document.getElementById('wifi-pass').value};;`;
        }

        qrCode.update({
            data: content,
            dotsOptions: { color: document.getElementById('qr-color').value, type: qrShape },
            backgroundOptions: { color: document.getElementById('bg-color').value }
        });
    }
}

function setShape(s) {
    qrShape = s;
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function openTab(id) {
    document.querySelectorAll('.design-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.design-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function download(ext) {
    if (mode === 'barcode') {
        const link = document.createElement('a');
        link.download = `barcode.${ext}`;
        link.href = document.getElementById("barcode-canvas").toDataURL();
        link.click();
    } else {
        qrCode.download({ name: "xpertzones-qr", extension: ext });
    }
}
