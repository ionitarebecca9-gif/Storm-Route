document.addEventListener('DOMContentLoaded', async () => {
    const now=new Date();
    document.getElementById('report-date').innerText="Data: "+now.toLocaleDateString("ro-RO");
    document.getElementById('report-id').innerText="Raport #"+Math.floor(Math.random()*10000);
    const params=new URLSearchParams(window.location.search);
    const company=params.get('company');
    if(!company)
    {
        document.getElementById('r-title').innerText="Companie nespecificata";
        return;
    }
    document.getElementById('r-title').innerText=company;
    document.getElementById('settings-display').innerText=`Filtru: ${company}`;
    try{
        const res = await fetch(`${CONFIG.API_BASE_URL}/insights?companies[]=${encodeURIComponent(company)}`, {
            headers: { 'X-App-Key': CONFIG.API_KEY } 
        });
        const data=await res.json();
        let totalVol=0;
        let maxHourlyVol=0;
        let peakHour=0;
        let topSpecie="N/A";
        let maxSpecieVol=0;
        let nightOps=false;
        const chartContainer=document.getElementById('report-chart');
        chartContainer.innerHTML='';
        if(data.hourly && data.hourly.length >0)
        {
            const maxChartVol = Math.max(...data.hourly.map(h => h.volume));
            for(let i=0; i<24; i++)
            {
                const hourData=data.hourly.find(h => h.hour === i);
                const vol=hourData ? hourData.volume : 0;
                if(vol >maxHourlyVol)
                {
                    maxHourlyVol=vol;
                    peakHour=i;
                }
                if((i<6 || i>22) && vol>0)
                    nightOps=true;
                const bar=document.createElement('div');
                bar.className='chart-bar';
                const hPercent=maxChartVol > 0 ? (vol/maxChartVol)*100 : 0;
                bar.style.height=`${hPercent}%`;
                if (i<6 || i>22) bar.classList.add('bar-danger');
                bar.title=`Ora ${i}: ${vol.toFixed(1)} m³`;
                chartContainer.appendChild(bar);
            }
        }
        else
        {
            chartContainer.innerText="Nu există date orare disponibile.";
            chartContainer.style.alignItems="center";
            chartContainer.style.justifyContent="center";
        }
        const tableBody=document.querySelector('#species-table tbody');
        if(data.species)
        {
            totalVol=data.species.reduce((a,b) => a+b.volume, 0);
            data.species.sort((a,b)=> b.volume-a.volume).forEach(s => {
                if(s.volume>maxSpecieVol) 
                { 
                    maxSpecieVol=s.volume; 
                    topSpecie=s.name; 
                }
                const tr=document.createElement('tr');
                const pct=totalVol > 0 ? ((s.volume/totalVol)*100).toFixed(1) : 0;
                tr.innerHTML=`<td>${s.name}</td><td>${s.volume.toFixed(2)}</td><td>${pct}%</td>`;
                tableBody.appendChild(tr);
            });
        }
        document.getElementById('val-vol').innerText=totalVol.toFixed(0);
        document.getElementById('val-hour').innerText=peakHour+":00";
        document.getElementById('val-specie').innerText=topSpecie;
        let text= `Compania <strong>${company}</strong> a înregistrat un volum total de <strong>${totalVol.toFixed(2)} m³</strong>. `;
        text += `Activitatea logistică este concentrată pe specia <strong>${topSpecie}</strong>. `;
        if (nightOps) {
            text+= `<br><br><strong>⚠️ ALERTĂ OPERAȚIONALĂ:</strong> Graficul orar evidențiază transporturi în intervalul nocturn (22:00 - 06:00). Este necesară o investigație privind condițiile de drum și meteo.`;
            const sumBox=document.getElementById('r-summary');
            sumBox.style.background="#fef2f2"; 
            sumBox.style.borderColor="#ef4444";
            sumBox.style.color="#991b1b";      
        } else
            text += `<br><br>Activitatea se desfășoară conform tiparelor diurne standard, fără anomalii orare majore.`;
        document.getElementById('r-summary').innerHTML = text;
    } catch (e) {
        console.error(e);
        document.getElementById('r-summary').innerText = "Eroare la generarea raportului.";
    }
});