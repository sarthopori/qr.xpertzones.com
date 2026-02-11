let qr = new QRCodeStyling({
width:400,
height:400,
data:"",
dotsOptions:{color:"#000",type:"rounded"},
backgroundOptions:{color:"#fff"}
});

qr.append(document.getElementById("preview"));

document.getElementById("mode").addEventListener("change", e=>{
let m=e.target.value;
document.getElementById("textBox").classList.toggle("hidden",m!=="text");
document.getElementById("wifiBox").classList.toggle("hidden",m!=="wifi");
document.getElementById("vcardBox").classList.toggle("hidden",m!=="vcard");
document.getElementById("barcodeType").classList.toggle("hidden",m!=="barcode");
});

function generate(){

let mode=document.getElementById("mode").value;
let data="";

if(mode==="text"){
data=document.getElementById("textData").value;
}

if(mode==="wifi"){
data=`WIFI:T:WPA;S:${ssid.value};P:${pass.value};;`;
}

if(mode==="vcard"){
data=`BEGIN:VCARD
VERSION:3.0
FN:${name.value}
TEL:${phone.value}
EMAIL:${email.value}
ORG:${org.value}
END:VCARD`;
}

if(mode==="barcode"){
document.getElementById("preview").style.display="none";
document.getElementById("barcode").style.display="block";
JsBarcode("#barcode",document.getElementById("textData").value,{
format:barcodeType.value
});
return;
}

document.getElementById("preview").style.display="block";
document.getElementById("barcode").style.display="none";

let logoFile=document.getElementById("logo").files[0];
let logoURL=logoFile?URL.createObjectURL(logoFile):"";

qr.update({
data:data,
width:Number(size.value),
height:Number(size.value),
image:logoURL,
dotsOptions:{color:dotColor.value,type:shape.value},
backgroundOptions:{color:bgColor.value}
});
}

function download(type){
qr.download({name:"qr",extension:type});
}

function toggleTheme(){
document.body.classList.toggle("light");
}
