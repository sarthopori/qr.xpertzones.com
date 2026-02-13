// Initialize Lucide Icons
lucide.createIcons();

// State Management
let currentView = 'home';
let qrCode = null;

// QR Code Configuration
const qrOptions = {
    width: 280,
    height: 280,
    type: "svg",
    data: "https://www.xpertzones.com",
    image: "", // You can add logo URL here
    dotsOptions: { color: "#111927", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
};

// View Switcher
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    
    if(viewId === 'qr') initQR();
    if(viewId === 'barcode') generateBarcode();
}

// QR Logic
function initQR() {
    if (!qrCode) {
        qrCode = new QRCodeStyling(qrOptions);
        qrCode.append(document.getElementById("qr-canvas-container"));
    }
    updateQR();
}

function updateQR() {
    const text = document.getElementById('qr-input').value || "XpertZones";
    qrOptions.data = text;
    qrOptions.dotsOptions.color = document.getElementById('qr-color').value;
    qrOptions.backgroundOptions.color = document.getElementById('qr-bg-color').value;
    qrOptions.dotsOptions.type = document.getElementById('qr-dots-style').value;
    
    qrCode.update(qrOptions);
}

function downloadQR(ext) {
    const fileName = `qr-${Date.now()}`;
    qrCode.download({ name: fileName, extension: ext });
}

// Barcode Logic
function generateBarcode() {
    const text = document.getElementById('barcode-input').value || "1234567890";
    const type = document.getElementById('barcode-type').value;
    const color = document.getElementById('barcode-color').value;
    const width = document.getElementById('barcode-width').value;

    try {
        JsBarcode("#barcode-canvas", text, {
            format: type,
            lineColor: color,
            width: parseInt(width),
            height: 100,
            displayValue: true
        });
    } catch (e) {
        console.error("Barcode generation failed", e);
    }
}

function downloadBarcode() {
    const svg = document.getElementById('barcode-canvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width * 2;
    canvas.height = svgSize.height * 2;
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `barcode-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
}

// Event Listeners
document.getElementById('qr-input').addEventListener('input', updateQR);
document.getElementById('qr-color').addEventListener('input', updateQR);
document.getElementById('qr-bg-color').addEventListener('input', updateQR);
document.getElementById('qr-dots-style').addEventListener('change', updateQR);

document.getElementById('barcode-input').addEventListener('input', generateBarcode);
document.getElementById('barcode-type').addEventListener('change', generateBarcode);
document.getElementById('barcode-color').addEventListener('input', generateBarcode);
document.getElementById('barcode-width').addEventListener('input', generateBarcode);

// Tab switching logic for QR
document.querySelectorAll('#qr-types .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('#qr-types .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const type = tab.dataset.type;
        const input = document.getElementById('qr-input');
        
        if(type === 'url') input.placeholder = "https://example.com";
        else if(type === 'wifi') input.placeholder = "WIFI:S:MySSID;P:password;;";
        else input.placeholder = "Enter text here...";
        
        updateQR();
    });
});
