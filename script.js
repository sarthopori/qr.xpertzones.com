let qr;
let currentType = "website";

function selectType(type) {
    currentType = type;
    const area = document.getElementById("content-area");
    area.innerHTML = "";

    if (type === "website") {
        area.innerHTML = `<input id="website" placeholder="https://example.com">`;
    }

    if (type === "wifi") {
        area.innerHTML = `
            <input id="ssid" placeholder="WiFi Name">
            <input id="password" placeholder="Password">
            <select id="encryption">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
            </select>
        `;
    }

    if (type === "vcard") {
        area.innerHTML = `
            <input id="name" placeholder="Full Name">
            <input id="phone" placeholder="Phone">
            <input id="email" placeholder="Email">
        `;
    }

    if (type === "multi") {
        area.innerHTML = `
            <input id="link1" placeholder="Link 1">
            <input id="link2" placeholder="Link 2">
        `;
    }

    if (type === "bulk") {
        area.innerHTML = `
            <input type="file" id="csvFile">
        `;
    }
}

function generateQR() {
    const size = document.getElementById("qrSize").value;
    const fg = document.getElementById("fg").value;
    const bg = document.getElementById("bg").value;

    let text = "";

    if (currentType === "website") {
        text = document.getElementById("website").value;
    }

    if (currentType === "wifi") {
        const ssid = document.getElementById("ssid").value;
        const pass = document.getElementById("password").value;
        const enc = document.getElementById("encryption").value;
        text = `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }

    if (currentType === "vcard") {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        text = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD`;
    }

    if (currentType === "multi") {
        const l1 = document.getElementById("link1").value;
        const l2 = document.getElementById("link2").value;
        text = `Links:\n${l1}\n${l2}`;
    }

    document.getElementById("qrPreview").innerHTML = "";
    qr = new QRCode(document.getElementById("qrPreview"), {
        text: text,
        width: parseInt(size),
        height: parseInt(size),
        colorDark: fg,
        colorLight: bg
    });
}

function downloadQR() {
    const format = document.getElementById("downloadFormat").value;
    const img = document.querySelector("#qrPreview img");

    if (!img) return;

    if (format === "png" || format === "jpg") {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = "qr-code." + format;
        link.click();
    }

    if (format === "pdf") {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.addImage(img.src, "PNG", 10, 10, 100, 100);
        pdf.save("qr-code.pdf");
    }
}

function startScanner() {
    const scanner = new Html5Qrcode("scanner");
    scanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        qrCodeMessage => {
            alert("Scanned: " + qrCodeMessage);
            scanner.stop();
        }
    );
}
