let currentType = 'url';
let qrCode;

// Initial Configuration
const qrConfig = {
    width: 300,
    height: 300,
    type: "svg",
    data: "https://xpertzones.com",
    image: "",
    dotsOptions: { color: "#000000", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 },
    cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
    cornersDotOptions: { type: "dot", color: "#000000" }
};

window.onload = () => {
    qrCode = new QRCodeStyling(qrConfig);
    qrCode.append(document.getElementById("canvas-wrapper"));
    initEvents();
};

function initEvents() {
    // Nav Tab Switching
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            toggleInputs();
            updateContent();
        });
    });

    // Content Inputs
    document.getElementById('data-url').addEventListener('input', updateContent);
    document.getElementById('wifi-ssid').addEventListener('input', updateContent);
    document.getElementById('wifi-pass').addEventListener('input', updateContent);
    document.getElementById('wifi-enc').addEventListener('change', updateContent);

    // Design Panel Switching
    document.querySelectorAll('.design-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.design-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.design-panel').forEach(p => p.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.remove('hidden');
        });
    });

    // Color Pickers
    document.getElementById('color-qr').addEventListener('input', (e) => {
        const val = e.target.value;
        document.getElementById('color-qr-hex').value = val;
        qrCode.update({ dotsOptions: { color: val }, cornersSquareOptions: { color: val }, cornersDotOptions: { color: val } });
    });

    // Shape Switching
    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            qrCode.update({ dotsOptions: { type: btn.dataset.shape } });
        });
    });

    // Logo Upload
    document.getElementById('logo-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => qrCode.update({ image: event.target.result });
        reader.readAsDataURL(file);
    });

    // Download Actions
    document.getElementById('btn-download-png').addEventListener('click', () => download('png'));
    document.getElementById('btn-download-svg').addEventListener('click', () => download('svg'));
    document.getElementById('btn-download-jpg').addEventListener('click', () => download('jpeg'));
}

function toggleInputs() {
    const panels = ['input-url', 'input-wifi'];
    panels.forEach(p => document.getElementById(p).classList.add('hidden'));
    
    if (currentType === 'wifi') document.getElementById('input-wifi').classList.remove('hidden');
    else if (currentType === 'barcode') document.getElementById('design-section').classList.add('hidden');
    else {
        document.getElementById('input-url').classList.remove('hidden');
        document.getElementById('design-section').classList.remove('hidden');
    }
}

function updateContent() {
    let finalData = "";
    const barcodeCanvas = document.getElementById('barcode-canvas');
    const qrSvg = document.querySelector('#canvas-wrapper svg');

    if (currentType === 'url') {
        finalData = document.getElementById('data-url').value || "https://xpertzones.com";
    } else if (currentType === 'wifi') {
        const ssid = document.getElementById('wifi-ssid').value;
        const pass = document.getElementById('wifi-pass').value;
        const enc = document.getElementById('wifi-enc').value;
        finalData = `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    } else if (currentType === 'barcode') {
        qrSvg?.classList.add('hidden');
        barcodeCanvas.classList.remove('hidden');
        JsBarcode("#barcode-canvas", document.getElementById('data-url').value || "12345678", {
            format: "CODE128",
            width: 2,
            height: 100,
            displayValue: true
        });
        return;
    }

    barcodeCanvas.classList.add('hidden');
    qrSvg?.classList.remove('hidden');
    qrCode.update({ data: finalData });
}

function download(ext) {
    if (currentType === 'barcode') {
        const canvas = document.getElementById("barcode-canvas");
        const link = document.createElement('a');
        link.download = `barcode-xpertzones.${ext}`;
        link.href = canvas.toDataURL(`image/${ext}`);
        link.click();
    } else {
        qrCode.download({ name: "qr-xpertzones", extension: ext });
    }
}
