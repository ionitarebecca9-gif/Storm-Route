function setupCompareAutocomplete() {
  const attachAutocomplete=(inputId, listId) => {
    const input=document.getElementById(inputId);
    const list=document.getElementById(listId);
    let timer;
    if (!input || !list) 
        return;
    input.addEventListener("input", (e) => {
      const val=e.target.value.trim();
      clearTimeout(timer);
      if (val.length < 3) {
        list.innerHTML = "";
        return;
      }
      timer=setTimeout(async () => {
        try {
          const res=await fetch(`${CONFIG.API_BASE_URL}/companies?role=carrier&search=${encodeURIComponent(val)}`,
            { headers: { "X-App-Key": CONFIG.API_KEY } }
          );
          const data=await res.json();
          list.innerHTML="";
          (data.companies || []).slice(0, 5).forEach((comp) => {
            const item=document.createElement("div");
            item.className="suggestion-item";
            item.innerText=comp.name;
            item.onclick=() => {
              input.value=comp.name;
              list.innerHTML="";
            };
            list.appendChild(item);
          });
        } catch (err) {
          console.error(err);
        }
      }, 300);
    });
    document.addEventListener("click", (e) => {
      if (e.target !== input && e.target !== list) list.innerHTML = "";
    });
  };
  attachAutocomplete("comp-a-input", "suggestions-a");
  attachAutocomplete("comp-b-input", "suggestions-b");
}

async function runComparison() {
    //compararea efectiva
  const nameA=document.getElementById("comp-a-input").value.trim();
  const nameB=document.getElementById("comp-b-input").value.trim();
  if (nameA.length<3 || nameB.length<3) {
    alert("Selectați ambele companii.");
    return;
  }
  document.getElementById("compare-loading").style.display="block";
  document.getElementById("compare-results").style.display="none";
  if (window.markersLayer) 
    window.markersLayer.clearLayers();
  try {
    const [resA, resB]=await Promise.all([
      fetch(`${CONFIG.API_BASE_URL}/routes?company=${encodeURIComponent(nameA)}&role=carrier`,
        { headers: { "X-App-Key": CONFIG.API_KEY } }),
      fetch(`${CONFIG.API_BASE_URL}/routes?company=${encodeURIComponent(nameB)}&role=carrier`,
        { headers: { "X-App-Key": CONFIG.API_KEY } }),
    ]);
    const dataA=await resA.json();
    const dataB=await resB.json();
    const routesA=dataA.routes || [];
    const routesB=dataB.routes || [];
    if (typeof renderCompareMap === "function") {
      renderCompareMap(routesA, "#38bdf8");
      renderCompareMap(routesB, "#f97316");
    } else
      console.warn("Funcția renderCompareMap nu este definită în map.js");
    const statsA=computeApiStats(routesA);
    const statsB=computeApiStats(routesB);
    document.getElementById("c-count-a").innerText=statsA.count;
    document.getElementById("c-count-b").innerText=statsB.count;
    document.getElementById("c-vol-a").innerText=statsA.volume.toFixed(0) + " m³";
    document.getElementById("c-vol-b").innerText=statsB.volume.toFixed(0) + " m³";
    document.getElementById("c-spec-a").innerText=statsA.topSpecies;
    document.getElementById("c-spec-b").innerText=statsB.topSpecies;
    let summary=`Datele API indică:<br>`;
    summary+=`<strong style="color:#38bdf8">${nameA}</strong>: ${statsA.count} transporturi.<br>`;
    summary+=`<strong style="color:#f97316">${nameB}</strong>: ${statsB.count} transporturi.<br><br>`;
    if (statsA.count > statsB.count)
      summary += `Compania A are o activitate mai intensă în perioada analizată.`;
    else if (statsB.count > statsA.count)
      summary += `Compania B domină activitatea în zona analizată.`;
    else summary += `Volume de activitate similare.`;
    document.getElementById("compare-summary").innerHTML=summary;
    document.getElementById("compare-loading").style.display="none";
    document.getElementById("compare-results").style.display="block";
  } catch (e) {
    console.error(e);
    alert("Eroare la comparare. Verifică consola.");
    document.getElementById("compare-loading").style.display="none";
  }
}

function computeApiStats(routes) {
  let totalVol=0;
  let speciesMap={};
  routes.forEach((r) => {
    totalVol+=r.total_volume || 0;
    if (r.species) {
      r.species.forEach((s) => {
        if (!speciesMap[s.name]) speciesMap[s.name] = 0;
        speciesMap[s.name]+=s.volume || 0;
      });
    }
  });
  let topSpecies="N/A";
  let maxVal=0;
  for (const [name, val] of Object.entries(speciesMap)) {
    if (val>maxVal) {
      maxVal=val;
      topSpecies=name;
    }
  }
  return { count: routes.length, volume: totalVol, topSpecies: topSpecies };
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof initMap === "function") {
    initMap();
  }
  setupCompareAutocomplete();
});

function renderCompareMap(routes, color){
    //harta pentru comparare
    if(!window.markersLayer)
    {
        if(window.map)
            window.markersLayer=L.layerGroup().addTo(window.map);
        else
            return;
    }
    routes.forEach((t) => {
        if(t.geometry && t.geometry.coordinates)
        {
            const len=t.geometry.coordinates.length;
            if(len===0)
                return;
            const last=t.geometry.coordinates[len-1];
            const lat=last[1];
            const lng=last[0];
            const marker=L.circleMarker([lat, lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: 6,
                weight: 1,
            }).addTo(window.markersLayer);
            let vol=t.total_volume || 0;
            marker.bindPopup(`<b>${t.notice_id || "Transport"}</b><br>Volum: ${vol.toFixed(1)} m³`);
            marker.on("click", function (e) {
                window.map.flyTo([lat, lng], 14);
            });
        }
    });
}