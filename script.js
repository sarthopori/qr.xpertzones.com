let qr;
let currentType = "qr";

document.getElementById("codeType").addEventListener("change", function () {
    currentType = this.value;

    if (currentType === "barcode") {
        document.getElementById("barcodeOptions").style.display = "block";
        document.getElementById("qrcode").style.display = "none";
        document.getElementById("barcode").style.display = "block";
    } else {
        document.getElementById("barcodeOptions").style.display = "none";
        document.getElementById("qrcode").style.display = "block";
        document.getElementById("barcode").style.display = "none";
    }
});

function generateCode() {
    let text = document.getElementById("textInput").value;
    let fgColor = document.getElementById("fgColor").value;
    let bgColor = document.getElementById("bgColor").value;

    if (!text) {
        alert("Please enter text");
        return;
    }

    if (currentType === "qr") {
        document.getElementById("qrcode").innerHTML = "";
        qr = new QRCode(document.getElementById("qrcode"), {
            text: text,
            width: 250,
            height: 250,
            colorDark: fgColor,
            colorLight: bgColor
        });
    } else {
        let format = document.getElementById("barcodeFormat").value;
        JsBarcode("#barcode", text, {
            format: format,
            lineColor: fgColor,
            background: bgColor,
            width: 2,
            height: 100,
            displayValue: true
        });
    }
}

function downloadCode() {
    if (currentType === "qr") {
        let img = document.querySelector("#qrcode img");
        if (!img) return;

        let link = document.createElement("a");
        link.href = img.src;
        link.download = "qr-code.png";
        link.click();
    } else {
        let svg = document.getElementById("barcode");
        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);

        let image = new Image();
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            let link = document.createElement("a");
            link.download = "barcode.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        };

        image.src = "data:image/svg+xml;base64," + btoa(source);
    }
}
