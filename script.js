let qrcode;
let logoData = null;

const qrContainer = document.getElementById("qrcode-container");

function generateQR() {
    qrContainer.innerHTML = ""; // Clear existing

    const text = document.getElementById("qr-text").value;
    const ecc = document.getElementById("ecc-level").value;
    const size = parseInt(document.getElementById("module-size").value) * 20; // Scale factor
    const margin = parseInt(document.getElementById("margin").value);
    const dotColor = document.getElementById("dot-color").value;
    const bgColor = document.getElementById("bg-color").value;
    const logoSize = document.getElementById("logo-size").value / 100;
    const logoPadding = document.getElementById("logo-padding").value / 100;

    const options = {
        text: text || "https://xpertzones.com",
        width: size,
        height: size,
        colorDark: dotColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel[ecc],
        quietZone: margin * 10,
        logo: logoData,
        logoWidth: size * logoSize,
        logoHeight: size * logoSize,
        logoBackgroundTransparent: true,
        PO_TL: dotColor, // Position pattern colors
        PO_TR: dotColor,
        PO_BL: dotColor
    };

    qrcode = new QRCode(qrContainer, options);
    document.getElementById("status-msg").style.opacity = 1;
}

// Handle Logo Upload
document.getElementById('logo-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            logoData = event.target.result;
            generateQR();
        };
        reader.readAsDataURL(file);
    }
});

// Controls
document.getElementById("generate-btn").onclick = generateQR;
document.getElementById("clear-logo-btn").onclick = () => {
    logoData = null;
    document.getElementById('logo-input').value = "";
    generateQR();
};

document.getElementById("reset-btn").onclick = () => location.reload();

document.getElementById("download-btn").onclick = () => {
    const canvas = qrContainer.querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'xpertzones-qr.png';
        link.href = canvas.toDataURL();
        link.click();
    }
};

// Update labels for sliders
document.getElementById("logo-size").oninput = (e) => {
    document.getElementById("logo-size-val").innerText = e.target.value + "%";
};
document.getElementById("logo-padding").oninput = (e) => {
    document.getElementById("logo-padding-val").innerText = e.target.value + "%";
};

// Initial Generate
window.onload = generateQR;