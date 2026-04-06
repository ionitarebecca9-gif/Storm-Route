let debounceTimer;
function setupSearch()
{
    //cautarea in timp ce utilizatorul scrie
    const searchInput=document.getElementById('search-input');
    const companiesList=document.getElementById('companies-list');
    if(!searchInput || !companiesList)
        return;
    searchInput.addEventListener('input', (e) =>{
        const query=e.target.value.trim();
        clearTimeout(debounceTimer);
        if(query.length < 3)
        {
            companiesList.innerHTML='';
            return;
        }
        if(window.currentMode === 'radar')
        {
            debounceTimer=setTimeout(() => {
                fetchCompanies(query);
            }, 400);
        }
    });
    //verific apasarile pe lista
    companiesList.addEventListener('click', (e) => {
        const insightsBtn=e.target.closest('.btn-insights');
        if(insightsBtn)
        {
            const parentItem=insightsBtn.closest('.company-result-item');
            if(parentItem)
                loadInsights(parentItem.dataset.name);
            return;
        }
        const clickedItem=e.target.closest('.company-result-item');
        if(!clickedItem)
            return;
        const companyName=clickedItem.dataset.name;
        searchInput.value=companyName;
        const allItems=companiesList.children;
        Array.from(allItems).forEach(item => {
            if(item !== clickedItem)
                item.style.display='none';
            else
            {
                item.style.backgroundColor='rgba(56, 189, 248, 0.15)';
                item.style.borderLeft='3px solid #38bdf8'
            }
        });
        loadCompanyRoutes(companyName, false);
    });
}

//cautarea companiilor in api
async function fetchCompanies(query) {
    if(window.currentMode !== 'radar')
        return;
    try{
        const res=await fetch(`${CONFIG.API_BASE_URL}/companies?role=carrier&search=${encodeURIComponent(query)}`, {
            headers: { 'X-App-Key': CONFIG.API_KEY}
        });
        const data=await res.json();
        const listEl=document.getElementById('companies-list');
        const currentInput=document.getElementById('search-input').value;
        if(currentInput !==query)
            return;
        listEl.innerHTML='';
        (data.companies || []).slice(0, 10).forEach(comp => {
            const div=document.createElement('div');
            div.className='company-result-item';            
            div.dataset.name=comp.name;
            div.innerHTML=`
                <div style="flex:1; pointer-events: none;"> <div class="company-name">${comp.name}</div>
                    <div class="company-meta">ID: ${comp.id}</div>
                </div>
                <button class="status-badge btn-insights" style="cursor:pointer; background:none; border:1px solid #444; color:#38bdf8; margin-left:10px; z-index:10;">
                    <i class="fa-solid fa-chart-simple"></i>
                </button>
            `;
            listEl.appendChild(div);
        });

        document.getElementById('search-status').innerText=`GĂSITE: ${data.companies?.length || 0}`;
    } catch (e) {
        console.error(e);
    }
}

//traseele transporturilro
async function loadCompanyRoutes(companyName, clearList=true) {
    window.currentCompanyForReport=companyName;
    if(window.currentMode !== 'radar')
        return;
    if(typeof debounceTimer !=='undefined')
        clearTimeout(debounceTimer);
    if(clearList)
    {
        const listEl=document.getElementById('company-list');
        if(listEl)
            listEl.innerHTML='';
        const sInput=document.getElementById('search-input');
        if(sInput)
            sInput.value=companyName;
    }
    prepareUI(`ÎNCĂRCARE: ${companyName}...`);
    const header=document.getElementById('transport-list-header');
    header.style.display='block';
    const safeName=companyName.replace(/'/g, "\\'");
    header.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="font-size: 1rem; color: var(--accent); margin:0;">
                <i class="fa-solid fa-building"></i> ${companyName}
            </h3>
            <button onclick="loadInsights('${safeName}')" class="status-badge" style="cursor:pointer; background:rgba(56, 189, 248, 0.2); color:#38bdf8; border:1px solid #38bdf8;">
                <i class="fa-solid fa-chart-simple"></i> STATISTICI
            </button>
        </div>
        <div style="font-size:0.75rem; color:#666;">LISTA TRANSPORTURI</div>
    `;
    try{
        const res=await fetch(`${CONFIG.API_BASE_URL}/routes?company=${encodeURIComponent(companyName)}&role=carrier`, {
            headers: { 'X-App-Key': CONFIG.API_KEY }
        });
        if(window.currentMode !== 'radar') return;
        const data=await res.json();
        if(clearList) 
             document.getElementById('companies-list').innerHTML='';
        renderTransports(data.routes || [], 'route');
    } catch (err) {
        console.error(err);
        document.getElementById('search-status').innerText="Eroare la încărcare date.";
    }
}
//statisticile detaliate

async function loadInsights(companyName) {
    if(typeof debounceTimer !== 'undefined')
        clearTimeout(debounceTimer);
    window.currentCompanyForReport=companyName;
    prepareUI();
    document.getElementById('companies-list').innerHTML='';
    hideAllViews();
    document.getElementById('view-insights').style.display='block';
    document.getElementById('i-title').innerText=companyName;
    const chartEl=document.getElementById('hourly-chart');
    const speciesEl=document.getElementById('species-list');
    const summaryEl=document.getElementById('ai-summary');
    chartEl.innerHTML='Încărcare...';
    speciesEl.innerHTML='';
    summaryEl.innerText='Se încarcă datele...';
    try {
        const res=await fetch(`${CONFIG.API_BASE_URL}/insights?companies[]=${encodeURIComponent(companyName)}`, {
            headers: { 'X-App-Key': CONFIG.API_KEY }
        });
        const data=await res.json();
        renderInsightsData(data, chartEl, speciesEl, summaryEl, companyName);
    } catch (e) {
        console.error(e);
    }
}
//grafic
function renderInsightsData(data, chartEl, speciesEl, summaryEl, companyName) {
    let maxHourlyVol=0, busiestHour=-1, dominantSpecies="Necunoscut", nightActivity=false;
    chartEl.innerHTML='';
    if(data.hourly && data.hourly.length > 0) {
        const maxVol=Math.max(...data.hourly.map(h => h.volume));
        for(let i=0; i<24; i++) {
            const hourData=data.hourly.find(h => h.hour === i);
            const vol = hourData ? hourData.volume : 0;
            if(vol>maxHourlyVol) {
                maxHourlyVol=vol;
                busiestHour=i;
            }
            if((i<6 || i>22) && vol>0) 
                nightActivity=true;
            const heightPercent=maxVol>0 ? (vol/maxVol)*100 : 0;
            const bar=document.createElement('div');
            bar.className='chart-bar';
            bar.style.height=`${heightPercent}%`;
            bar.setAttribute('data-val', `${vol} m³`);
            if (i<6 || i>22) bar.style.backgroundColor= '#ef4444';
            chartEl.appendChild(bar);
        }
    } 
    else
        chartEl.innerHTML = 'Fără date orare.';
    if(data.species && data.species.length > 0) {
        const totalVol=data.species.reduce((acc, s) => acc + s.volume, 0);
        let maxSpecieVol=0;
        data.species.sort((a, b) => b.volume - a.volume).forEach(s => {
            if (s.volume>maxSpecieVol) {
                maxSpecieVol=s.volume;
                dominantSpecies=s.name;
            }
            const percent=totalVol > 0 ? (s.volume/totalVol)*100 : 0;
            const row=document.createElement('div');
            row.innerHTML=`<div class="stat-row"><span>${s.name}</span><span>${s.volume.toFixed(1)} m³ (${percent.toFixed(0)}%)</span></div><div class="progress-bg"><div class="progress-fill" style="width: ${percent}%"></div></div>`;
            speciesEl.appendChild(row);
        });
    } else
        speciesEl.innerHTML = 'Fără date specii.';
    let summaryText=`Analiza pentru <strong>${companyName}</strong> arată activitate majoră cu specia <strong>${dominantSpecies}</strong>. `;
    if(busiestHour !== -1) 
        summaryText+=`Vârful de activitate se inregistreaza la ora <strong>${busiestHour}:00</strong>. `;
    if(nightActivity)
         summaryText+=`<br><span style="color:#ef4444; font-weight:bold;">⚠ Atenție:</span> Activitate nocturnă detectată.`;
    else 
        summaryText+=`Orar normal.`;
    summaryEl.innerHTML=summaryText;
}