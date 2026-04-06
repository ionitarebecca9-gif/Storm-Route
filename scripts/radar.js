window.renderTransports=function(items, type)
{
    //se creeaza lista de transporturi pentru companie
    const listContainer=document.getElementById('transport-list');
    listContainer.innerHTML='';
    const status=document.getElementById('search-status');
    if(status) 
        status.innerText=`REZULTATE: ${items.length}`;
    if(!window.map || !window.markersLayer)
    {
        console.warn("Hartă neinițializată...");
        if(window.map)
            window.markersLayer=L.layerGroup().addTo(window.map);
        else
            return;
    }
    window.markersLayer.clearLayers();
    items.forEach(t => {
        let lat, lng;
        if(t.geometry && t.geometry.coordinates)
        {
            const last=t.geometry.coordinates[t.geometry.coordinates.length-1];
            lng=last[0];
            lat=last[1];
        }
        if(!lat || !lng)
            return;
        let dateObj=new Date(t.updated_at || t.first_position || Date.now());
        const isPrecise=(type === 'network');
        const defaultColor='#38bdf8';
        const marker=L.circleMarker([lat, lng], { 
            color: defaultColor, 
            fillColor: defaultColor, 
            fillOpacity: 0.6, 
            radius: 6, 
            weight: 1,
            className: 'leaflet-interactive' 
        }).addTo(window.markersLayer);
        const el=document.createElement('div');
        el.className='transport-item';
        let vol=t.total_volume || (t.species ? t.species.reduce((a,b) => a+(b.volume || 0), 0) :0);
        const sText=t.species && t.species[0] ? t.species[0].name : "Mix";
        const displayId=t.notice_id || t.transport_id;
        el.innerHTML = `
            <div style="flex:1; cursor:pointer;">
                <div style="font-weight:600; color:white;">
                    <i class="fa-solid fa-truck"></i> ${displayId}
                </div>
                <div style="font-size:0.8rem; color:#94a3b8;">
                    ${vol.toFixed(1)} m³ • ${sText}
                </div>
                <div style="font-size:0.75rem; color:#666;">
                    ${dateObj.toLocaleDateString('ro-RO')}
                </div>
            </div>
            
            <button class="btn-doc-direct" title="Deschide Fișa PDF">
                <i class="fa-solid fa-file-pdf"></i>
            </button>
        `;
        marker.on('click', function(e) {
            L.DomEvent.stopPropagation(e);
            window.selectTransport(t, marker, dateObj);
        });
        el.querySelector('div').onclick=function() {
            window.selectTransport(t, marker, dateObj);
        };
        const btnDoc=el.querySelector('.btn-doc-direct');
        btnDoc.onclick=function(e) {
            e.stopPropagation();
            const params = new URLSearchParams({
                id: displayId,
                date: dateObj.toISOString(),
                vol: vol.toFixed(2),
                species: t.species ? t.species.map(s=>s.name).join(', ') : '-',
                lat: lat,
                lng: lng,
                company: window.currentCompanyForReport || "Necunoscut"
            });
            window.open(`raport-transport.html?${params.toString()}`, '_blank');
        };
        btnDoc.style.cssText="background: rgba(255,255,255,0.05); \
        border: 1px solid #444; color: #ccc; width: 35px; height: 35px; \
        border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;";
        listContainer.appendChild(el);
    });
}

window.selectTransport=async function (data, marker, dateObj) {
    //logica de selectare a unui transport si conectare la pi ul meteo
    console.log("Trasport selectat: ", data.notice_id);
    if(window.activeMarker && window.activeMarker !== marker)
    {
        window.activeMarker.setStyle({
            radius: 6,
            weight: 1,
            color: "#38bdf8",
            fillColor: "#38bdf8",
         });
    }
    window.activeMarker=marker;
    marker.setStyle({
        radius: 12,
        weight: 4,
        color: "white",
        fillColor: "white",
        fillOpacity: 1,
    });
    marker.bringToFront();
    if(typeof hideAllViews === 'function')
        hideAllViews();
    const detailsView=document.getElementById("view-details");
    if(detailsView)
        detailsView.style.display="block";
    const displayId=data.notice_id || data.transport_id;
    document.getElementById("d-aviz").innerText=displayId;
    document.getElementById("d-time").innerText=dateObj.toLocaleString("ro-Ro");
    let vol=data.total_volume || 0;
    if(!vol && data.species)
        vol=data.species.reduce((a,b) => a+(b.volume || 0), 0);
    document.getElementById("d-volum").innerText=vol.toFixed(2)+ " m³";
    const sText=data.species ? data.species.map((s) => s.name).join(", ") : "-";
    document.getElementById("d-specie").innerText=sText;
    //meteo
    let lat, lng;
    if(data.geometry && data.geometry.coordinates) {
        const len=data.geometry.coordinates.length;
        const last=data.geometry.coordinates[len-1];
        lng=last[0];
        lat=last[1];
    } 
    window.currentTransportParams= {
        id: displayId,
        date: dateObj.toISOString(),
        vol: vol.toFixed(2),
        species: sText,
        lat: lat,
        lng: lng,
        company: window.currentCompanyForReport || "Necunoscut",
    };
    const badge=document.getElementById("d-badge");
    badge.innerHTML="OBTINERE METEO...";
    badge.className="status-badge bg-loading";
    
    try {
    const yyyy=dateObj.getFullYear();
    const mm=String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd=String(dateObj.getDate()).padStart(2, '0');
    const dateStr=`${yyyy}-${mm}-${dd}`;
    const hour=12;
    const wUrl=`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m,precipitation,windspeed_10m`;
    const res=await fetch(wUrl);
    const wData=await res.json();
    const rain=wData.hourly.precipitation[hour] || 0;
    const wind=wData.hourly.windspeed_10m[hour] || 0;
    const temp=wData.hourly.temperature_2m[hour] || 0;
    document.getElementById("w-temp").innerText=`${temp}°C`;
    document.getElementById("w-wind").innerText=`${wind} km/h`;
    document.getElementById("w-rain").innerText=`${rain} mm`;
    //logica pentru culori
    if (rain>0.5 || wind>20) {
      badge.className="status-badge bg-danger";
      badge.innerHTML="<i class='fa-solid fa-bolt'></i> VREME REA";
      document.getElementById("w-desc").style.color="#ef4444";
      document.getElementById("w-desc").innerText="Condiții dificile.";
      marker.setStyle({ color: "#ef4444", fillColor: "#ef4444" });
    } else {
      badge.className="status-badge bg-safe";
      badge.innerHTML="<i class='fa-solid fa-check'></i> VREME BUNĂ";
      document.getElementById("w-desc").style.color="#10b981";
      document.getElementById("w-desc").innerText="Condiții favorabile.";
      marker.setStyle({ color: "#10b981", fillColor: "#10b981" });
    }
  } catch (e) {
    console.error(e);
    badge.innerText="METEO INDISPONIBIL";
    marker.setStyle({ color: "#94a3b8", fillColor: "#94a3b8" });
  }
  if(window.map)
    window.map.flyTo([lat, lng], 12);
}