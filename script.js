let qrCode = null;

const qrOptions = {
    width: 300,
    height: 300,
    data: "https://www.xpertzones.com",
    image: "",
    dotsOptions: { color: "#111927", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { type: "square", color: "#111927" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
};

// View Switcher
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${id}`).classList.add('active');
    if (id === 'qr') updateQR();
    if (id === 'barcode') generateBarcode();
}

// Design Tab Switcher
function openDesignTab(evt, tabName) {
    document.querySelectorAll('.design-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.d-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// QR Logic
function updateQR() {
    if (!qrCode) {
        qrCode = new QRCodeStyling(qrOptions);
        qrCode.append(document.getElementById("qr-result"));
    }

    const inputVal = document.getElementById('qr-input').value || "XpertZones";
    const size = document.getElementById('qr-size').value;
    
    document.getElementById('size-val').innerText = size;
    
    qrOptions.data = inputVal;
    qrOptions.width = parseInt(size);
    qrOptions.height = parseInt(size);
    qrOptions.dotsOptions.color = document.getElementById('qr-color').value;
    qrOptions.backgroundOptions.color = document.getElementById('qr-bg-color').value;
    qrOptions.cornersSquareOptions.color = document.getElementById('qr-color').value;

    qrCode.update(qrOptions);
}

// Listen for Shape Changes
document.querySelectorAll('#corner-styles .shape-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('#corner-styles .shape-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        qrOptions.cornersSquareOptions.type = opt.dataset.value;
        updateQR();
    });
});

document.querySelectorAll('#dot-styles .shape-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('#dot-styles .shape-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        qrOptions.dotsOptions.type = opt.dataset.value;
        updateQR();
    });
});

// Logo Logic
document.querySelectorAll('.logo-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.logo-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const type = opt.dataset.logo;
        qrOptions.image = type === 'none' ? "" : `https://api.iconify.design/logos:${type}.svg`;
        updateQR();
    });
});

document.getElementById('logo-upload').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = function() {
        qrOptions.image = reader.result;
        updateQR();
    }
    reader.readAsDataURL(e.target.files[0]);
});

// Barcode Logic
function generateBarcode() {
    const data = document.getElementById('barcode-input').value || "12345";
    const color = document.getElementById('barcode-color').value;
    JsBarcode("#barcode-canvas", data, {
        lineColor: color,
        width: 2,
        height: 80,
        displayValue: true
    });
}

function downloadQR(ext) {
    const content = document.getElementById('qr-input').value.substring(0, 10) || "qr-code";
    qrCode.download({ name: `xpertzones-${content}`, extension: ext });
}

function downloadBarcode() {
    const svg = document.getElementById('barcode-canvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const a = document.createElement("a");
        a.download = `barcode-xpert.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
    };
}

// Real-time Listeners
['qr-input', 'qr-color', 'qr-bg-color', 'qr-size'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateQR);
});

['barcode-input', 'barcode-color'].forEach(id => {
    document.getElementById(id).addEventListener('input', generateBarcode);
});
