let mainMode = 'qr';
let activeType = 'text';
let qrCode;

// Configuration for Premium QR
const config = {
    width: 300,
    height: 300,
    data: "XpertZones QR",
    dotsOptions: { color: "#000000", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
};

window.onload = () => {
    qrCode = new QRCodeStyling(config);
    qrCode.append(document.getElementById("preview-container"));
    generate();
};

function setMainMode(mode) {
    mainMode = mode;
    const qrBtn = document.getElementById('btn-mode-qr');
    const bcBtn = document.getElementById('btn-mode-bc');
    const genBtn = document.getElementById('btn-generate-main');

    if (mode === 'qr') {
        qrBtn.classList.add('text-[#00aeef]'); bcBtn.classList.remove('text-[#00aeef]');
        genBtn.innerText = "Generate QR";
        document.getElementById('design-section').classList.remove('hidden');
    } else {
        bcBtn.classList.add('text-[#00aeef]'); qrBtn.classList.remove('text-[#00aeef]');
        genBtn.innerText = "Generate Barcode";
        document.getElementById('design-section').classList.add('hidden');
    }
}

function setType(type) {
    activeType = type;
    document.querySelectorAll('.grid.grid-cols-4 button').forEach(btn => {
        btn.classList.remove('text-[#00aeef]', 'border-[#00aeef]');
        btn.classList.add('border-transparent');
    });
    const activeBtn = document.getElementById(`tab-${type}`);
    activeBtn.classList.add('text-[#00aeef]', 'border-[#00aeef]');
}

function generate() {
    const data = document.getElementById('input-main').value || "Sample Data";
    const qrContainer = document.querySelector('#preview-container canvas:not(#barcode-canvas)');
    const bcCanvas = document.getElementById('barcode-canvas');

    if (mainMode === 'qr') {
        bcCanvas.classList.add('hidden');
        if (qrContainer) qrContainer.classList.remove('hidden');
        
        qrCode.update({
            data: data,
            dotsOptions: { color: document.getElementById('color-qr').value },
            backgroundOptions: { color: document.getElementById('color-bg').value }
        });
    } else {
        bcCanvas.classList.remove('hidden');
        if (qrContainer) qrContainer.classList.add('hidden');
        
        JsBarcode("#barcode-canvas", data, {
            format: "CODE128",
            displayValue: true,
            lineColor: document.getElementById('color-qr').value,
            background: document.getElementById('color-bg').value
        });
    }
}

function openDesignTab(tab) {
    // Basic logic to toggle design property UI
    console.log("Switching design tab to: ", tab);
}

function download(ext) {
    if (mainMode === 'qr') {
        qrCode.download({ name: "xpertzones-qr", extension: ext });
    } else {
        const link = document.createElement('a');
        link.download = `xpertzones-barcode.${ext}`;
        link.href = document.getElementById("barcode-canvas").toDataURL();
        link.click();
    }
}
