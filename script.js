// Navigation
const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");

function showPage(id) {
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  navButtons.forEach(btn => btn.classList.remove("active"));
}

document.getElementById("homeBtn").onclick = () => showPage("homeSection");
document.getElementById("qrBtn").onclick = () => showPage("qrSection");
document.getElementById("barcodeBtn").onclick = () => showPage("barcodeSection");

document.getElementById("homeQR").onclick = () => showPage("qrSection");
document.getElementById("homeBarcode").onclick = () => showPage("barcodeSection");

// QR Code
let qr;

function generateQR() {
  const text = document.getElementById("qrInput").value;
  const size = parseInt(document.getElementById("qrSize").value);
  const color = document.getElementById("qrColor").value;
  const preview = document.getElementById("qrPreview");

  preview.innerHTML = "";

  if (!text) return;

  qr = new QRCode(preview, {
    text: text,
    width: size,
    height: size,
    colorDark: color,
    colorLight: "#ffffff",
  });
}

document.getElementById("qrInput").addEventListener("input", generateQR);
document.getElementById("qrSize").addEventListener("input", generateQR);
document.getElementById("qrColor").addEventListener("input", generateQR);

// Barcode
function generateBarcode() {
  const text = document.getElementById("barcodeInput").value;
  if (!text) return;

  JsBarcode("#barcodePreview", text, {
    format: "CODE128",
    width: 2,
    height: 100,
    displayValue: true
  });
}

document.getElementById("barcodeInput").addEventListener("input", generateBarcode);

// Download QR
document.getElementById("downloadQR").addEventListener("click", () => {
  const canvas = document.querySelector("#qrPreview canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  const text = document.getElementById("qrInput").value.slice(0, 20);
  link.download = `qr-${text}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

// Download Barcode
document.getElementById("downloadBarcode").addEventListener("click", () => {
  const svg = document.getElementById("barcodePreview");
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const text = document.getElementById("barcodeInput").value.slice(0, 20);
  link.download = `barcode-${text}.svg`;
  link.href = url;
  link.click();
});
