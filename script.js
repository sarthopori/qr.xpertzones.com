let qr = new QRCodeStyling({
width: 300,
height: 300,
data: "",
dotsOptions: { color: "#000", type: "rounded" },
backgroundOptions: { color: "#fff" }
});

qr.append(document.getElementById("qrBox"));

document.getElementById("mode").addEventListener("change", e => {
document.getElementById("barcodeType").style.display =
e.target.value === "barcode" ? "block" : "none";

document.getElementById("qrType").style.display =
e.target.value === "qr" ? "block" : "none";
});

function generate(){

const mode = document.getElementById("mode").value;
let data = document.getElementById("data").value;

if(!data){
alert("Please enter data");
return;
}

if(mode === "qr"){

const type = document.getElementById("qrType").value;

if(type === "wifi"){
data = "WIFI:T:WPA;S:" + data + ";P:12345678;;";
}

if(type === "vcard"){
data = "BEGIN:VCARD\nVERSION:3.0\nFN:" + data + "\nEND:VCARD";
}

qr.update({ data });

document.getElementById("qrBox").style.display="block";
document.getElementById("barcode").style.display="none";

}else{

document.getElementById("qrBox").style.display="none";
document.getElementById("barcode").style.display="block";

JsBarcode("#barcode", data, {
format: document.getElementById("barcodeType").value,
width:2,
height:100,
displayValue:true
});

}

}

function downloadPNG(){
qr.download({ name:"qr", extension:"png" });
}

function downloadJPG(){
qr.download({ name:"qr", extension:"jpeg" });
}

function downloadSVG(){
qr.download({ name:"qr", extension:"svg" });
}
