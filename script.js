let qr = new QRCodeStyling({
width:400,
height:400,
data:"",
image:"",
dotsOptions:{ color:"#000", type:"rounded" },
backgroundOptions:{ color:"#fff" }
});

qr.append(document.getElementById("qr"));

function generateQR(){

let data = document.getElementById("data").value;
if(!data) return alert("Enter data");

let size = document.getElementById("size").value;
let dotColor = document.getElementById("dotColor").value;
let bgColor = document.getElementById("bgColor").value;
let style = document.getElementById("style").value;

let logoFile = document.getElementById("logo").files[0];
let logoURL = "";

if(logoFile){
logoURL = URL.createObjectURL(logoFile);
}

qr.update({
data:data,
width:Number(size),
height:Number(size),
image:logoURL,
dotsOptions:{ color:dotColor, type:style },
backgroundOptions:{ color:bgColor }
});

}

function download(type){
qr.download({ name:"qr", extension:type });
}

function toggleTheme(){
document.body.classList.toggle("dark");
document.body.classList.toggle("light");
}

/* BULK CSV QR */

function bulkGenerate(){

let file = document.getElementById("csv").files[0];
if(!file) return alert("Upload CSV");

Papa.parse(file,{
complete:function(res){

let container = document.getElementById("bulkResult");
container.innerHTML="";

res.data.forEach((row,i)=>{

if(!row[0]) return;

let div = document.createElement("div");
div.style.margin="10px";

let q = new QRCodeStyling({
width:150,
height:150,
data:row[0]
});

q.append(div);
container.appendChild(div);

});

}
});
}
