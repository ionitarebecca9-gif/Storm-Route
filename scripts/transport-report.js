document.addEventListener('DOMContentLoaded', async () => {
    const params=new URLSearchParams(window.location.search);    
    const id=params.get('id');          
    const vol=params.get('vol');        
    const dateStr=params.get('date');   
    const species=params.get('species'); 
    const lat=parseFloat(params.get('lat')); 
    const lng=parseFloat(params.get('lng'));
    const company=params.get('company');
    document.getElementById('gen-date').innerText= "Data: "+new Date().toLocaleDateString('ro-RO');
    document.getElementById('t-id').innerText=id || "NECUNOSCUT";
    document.getElementById('t-vol').innerText=vol || "0";
    document.getElementById('t-species').innerText=species || "-";
    const dateObj = new Date(dateStr);
    document.getElementById('t-date').innerText=dateObj.toLocaleString('ro-RO');
    //folosim si mini harta interactiva
    if (!isNaN(lat) && !isNaN(lng)) {
        const map=L.map('mini-map', { 
            zoomControl: false, 
            attributionControl: false 
        }).setView([lat, lng], 10);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.circleMarker([lat, lng], { 
            color: '#0f172a', 
            fillColor: '#38bdf8', 
            fillOpacity: 1, 
            radius: 8 }).addTo(map);
    } else
        document.getElementById('mini-map').innerText="Coordonate lipsă.";
    const yyyy=dateObj.getFullYear();
    const mm=String(dateObj.getMonth()+1).padStart(2, '0');
    const dd=String(dateObj.getDate()).padStart(2, '0');
    const apiDate = `${yyyy}-${mm}-${dd}`;
    const hour=12;
    try {
        const wUrl=`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${apiDate}&end_date=${apiDate}&hourly=temperature_2m,precipitation,windspeed_10m`;
        const res=await fetch(wUrl);
        const wData=await res.json();
        const temp=wData.hourly.temperature_2m[hour];
        const rain=wData.hourly.precipitation[hour];
        const wind=wData.hourly.windspeed_10m[hour];
        document.getElementById('m-temp').innerText=`${temp} °C`;
        document.getElementById('m-rain').innerText=`${rain} mm`;
        document.getElementById('m-wind').innerText=`${wind} km/h`;
        const badge=document.getElementById('risk-badge');
        const box=document.getElementById('conclusion-box');
        if (rain>0.5 || wind>20) {
            // risc sau nu
            badge.style.background="#ef4444";
            badge.innerText="RISC RIDICAT";
            box.className="conclusion danger";
            box.innerHTML=`<strong>ALERTĂ:</strong> Acest transport a fost efectuat în condiții meteorologice dificile.<br>
            S-au înregistrat precipitații de <strong>${rain} mm</strong> și vânt de <strong>${wind} km/h</strong>.`;
        } else {
            badge.style.background="#10b981";
            badge.innerText="CONDIȚII NORMALE";
            box.className="conclusion safe";
            box.innerHTML=`<strong>VALIDAT:</strong> Condițiile meteorologice din data de ${dateObj.toLocaleDateString('ro-RO')} au fost favorabile.<br>
            Nu s-au înregistrat fenomene extreme care să pună în pericol siguranța transportului.`;
        }
    } catch (e) {
        console.error(e);
        document.getElementById('conclusion-box').innerText = "Datele meteo nu au putut fi confirmate.";
    }
});