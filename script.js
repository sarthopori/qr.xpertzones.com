let currentMode = 'qr';
let activeType = 'text';
let qrShape = 'square';
let qrCode;
let logoData = "";

// Initialize QR Code Styling
qrCode = new QRCodeStyling({
    width: 300, height: 300, type: "canvas",
    dotsOptions: { color: "#000000", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 10 }
});

window.onload = () => {
    qrCode.append(document.getElementById("canvas-wrapper"));
    generate();
};

function setMainMode(mode) {
    currentMode = mode;
    const qrBtn = document.getElementById('btn-mode-qr');
    const bcBtn = document.getElementById('btn-mode-bc');
    if(mode==='qr'){ qrBtn.className="py-5 text-xl font-bold text-[#00aeef] border-b-4 border-[#00aeef]";
                     bcBtn.className="py-5 text-xl font-bold text-gray-400 hover:text-white transition";
                     document.getElementById('design-card').style.display="block"; }
    else { bcBtn.className="py-5 text-xl font-bold text-[#00aeef] border-b-4 border-[#00aeef]";
           qrBtn.className="py-5 text-xl font-bold text-gray-400 hover:text-white transition";
           document.getElementById('design-card').style.display="none"; }
    generate();
}

function setType(type){
    activeType = type;
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
    document.getElementById('wifi-fields').style.display=(type==='wifi')?'grid':'none';
    generate();
}

function openDesignTab(event,id){
    document.querySelectorAll('.design-panel').forEach(p=>p.classList.add('hidden'));
    document.querySelectorAll('.design-tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(id).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function setShape(event,shape){
    qrShape=shape;
    document.querySelectorAll('.shape-btn').forEach(b=>b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    generate();
}

document.getElementById('logo-input').onchange = (e)=>{
    const reader = new FileReader();
    reader.onload=(f)=>{ logoData=f.target.result; generate(); };
    reader.readAsDataURL(e.target.files[0]);
}

document.getElementById('color-qr').addEventListener('input',e=>{document.getElementById('color-qr-hex').value=e.target.value; generate();});
document.getElementById('color-bg').addEventListener('input',e=>{document.getElementById('color-bg-hex').value=e.target.value; generate();});
document.getElementById('color-qr-hex').addEventListener('input',e=>{document.getElementById('color-qr').value=e.target.value; generate();});
document.getElementById('color-bg-hex').addEventListener('input',e=>{document.getElementById('color-bg').value=e.target.value; generate();});

function generate(){
    const data=document.getElementById('input-main').value||"XpertZones";
    const qrCanvas=document.querySelector('#canvas-wrapper canvas:not(#barcode-canvas)');
    const bcCanvas=document.getElementById('barcode-canvas');
    if(currentMode==='qr' && qrCanvas) qrCanvas.classList.add('updating');
    if(currentMode==='barcode' && bcCanvas) bcCanvas.classList.add('updating');

    setTimeout(()=>{
        if(currentMode==='qr'){
            bcCanvas.classList.add('hidden');
            if(qrCanvas) qrCanvas.classList.remove('hidden');
            let content=data;
            if(activeType==='wifi'){
                const pass=document.getElementById('wifi-pass').value;
                const enc=document.getElementById('wifi-enc').value;
                content=`WIFI:S:${data};T:${enc};P:${pass};;`;
            }
            qrCode.update({
                data:content,
                dotsOptions:{color:document.getElementById('color-qr').value,type:qrShape},
                backgroundOptions:{color:document.getElementById('color-bg').value},
                image:logoData
            });
        }else{
            bcCanvas.classList.remove('hidden');
            if(qrCanvas) qrCanvas.classList.add('hidden');
            JsBarcode("#barcode-canvas",data,{
                format:"CODE128",
                lineColor:document.getElementById('color-qr').value,
                background:document.getElementById('color-bg').value,
                width:2,height:100,displayValue:true
            });
        }
        if(currentMode==='qr' && qrCanvas) qrCanvas.classList.remove('updating');
        if(currentMode==='barcode' && bcCanvas) bcCanvas.classList.remove('updating');
    },150);
}

function download(ext){
    if(currentMode==='qr'){
        qrCode.download({name:"xpertzones-qr",extension:ext});
    }else{
        const link=document.createElement('a');
        link.download=`barcode.${ext}`;
        link.href=document.getElementById("barcode-canvas").toDataURL();
        link.click();
    }
}
