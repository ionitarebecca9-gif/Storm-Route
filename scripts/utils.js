// ptr UI in principiu
function hideAllViews() {
    //ascunde panourile laterale ca sa evite suprapunerea
    const views=['view-search-mode', 'view-insights', 'view-details', 'view-compare'];
    views.forEach(id => {
        const el=document.getElementById(id);
        if(el)
            el.style.display='none';
    });
}

function prepareUI(msg){
    //ptr cautare noua/incarcare
    const status=document.getElementById('search-status');
    const header=document.getElementById('transport-list-header');
    if(msg)
    {
        if(status) status.innerText=msg;
        if(header) header.style.display='block';
    }
}


function closeDetails(){
    //inchide panoul cu detalii si statistici
    hideAllViews();
    document.getElementById('view-search-mode').style.display='block';
    if(window.activeMarker)
    {
        window.activeMarker.setStyle({radius: 6, weight: 1, color: '#38bdf8', fillColor: '#38bdf8'});
        window.activeMarker=null;
    }
}

function openTransportReport(){
    //deschide raportul ptr un trasnport
    if(window.currentTransportParams)
    {
        const params=new URLSearchParams(window.currentTransportParams).toString();
        window.open(`raport-transport.html?${params}`, '_blank');
    }
}

function openReport(){
    //deschide raportul pentru companie
    if(window.currentCompanyForReport)
        window.open(`raport-companie.html?company=${encodeURIComponent(window.currentCompanyForReport)}`, '_blank');
}

function setNavActive(mode)
{
    //indicator pe navigatie ca sa stim pe ce pagina suntem
    const allIds=['mob-radar', 'mob-compare', 'desk-radar', 'desk-compare'];
    allIds.forEach(id => {
        const el=document.getElementById(id);
        if(el)
            el.classList.remove('nav-active');
    });
    const targetMob=document.getElementById('mob-' + mode);
    const targetDesk=document.getElementById('desk-'+mode);
    if(targetMob)   targetMob.classList.add('nav-active');
    if(targetDesk)   targetDesk.classList.add('nav-active');

}