let mode = 'url';
let qrCode;
let qrShape = 'square';
let logoData = "";

// Initialize QR Styling object
qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "canvas",
    data: "https://xpertzones.com",
    dotsOptions: { color: "#000000", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
});

window.onload = () => {
    qrCode.append(document.getElementById("qr-preview"));
    generate(); // Initial render
};

function setMode(newMode) {
    mode = newMode;
    // UI Update
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${newMode}`).classList.add('active');
    
    document.querySelectorAll('.mode-input').forEach(div => div.classList.add('hidden'));
    document.getElementById(`field-${newMode}`).classList.remove('hidden');
    
    if (newMode === 'barcode') {
        document.getElementById('design-section').style.opacity = "0.3";
        document.getElementById('design-section').style.pointerEvents = "none";
    } else {
        document.getElementById('design-section').style.opacity = "1";
        document.getElementById('design-section').style.pointerEvents = "all";
    }
    generate();
}

function generate() {
    let content = "";
    const barcodeCanvas = document.getElementById('barcode-canvas');
    const qrContainer = document.querySelector('#qr-preview canvas:not(#barcode-canvas)');

    if (mode === 'url') content = document.getElementById('input-url').value || "https://xpertzones.com";
    if (mode === 'text') content = document.getElementById('input-text').value || "Hello!";
    if (mode === 'wifi') {
        let s = document.getElementById('wifi-ssid').value;
        let p = document.getElementById('wifi-pass').value;
        let e = document.getElementById('wifi-enc').value;
        content = `WIFI:S:${s};T:${e};P:${p};;`;
    }
    if (mode === 'vcard') {
        let n = document.getElementById('v-name').value;
        let ph = document.getElementById('v-phone').value;
        let em = document.getElementById('v-email').value;
        content = `BEGIN:VCARD\nFN:${n}\nTEL:${ph}\nEMAIL:${em}\nEND:VCARD`;
    }

    if (mode === 'barcode') {
        barcodeCanvas.classList.remove('hidden');
        if (qrContainer) qrContainer.classList.add('hidden');
        JsBarcode("#barcode-canvas", content || "12345678", { format: "CODE128", displayValue: true });
    } else {
        barcodeCanvas.classList.add('hidden');
        if (qrContainer) qrContainer.classList.remove('hidden');
        qrCode.update({
            data: content,
            dotsOptions: { color: document.getElementById('qr-color').value, type: qrShape },
            backgroundOptions: { color: document.getElementById('bg-color').value },
            image: logoData
        });
    }
}

function openTab(tabId) {
    document.querySelectorAll('.design-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.design-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function setShape(shape) {
    qrShape = shape;
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    generate();
}

function uploadLogo(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        logoData = event.target.result;
        generate();
    };
    reader.readAsDataURL(file);
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
