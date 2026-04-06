window.map=null;
window.markersLayer=null; 
window.currentMode='radar';
window.currentTransportParams=null;
window.currentCompanyForReport=null;

//initializarea paginii
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('map'))
    {
        initMap();
        if(typeof setupSearch === 'function')
            setupSearch();
        if(typeof setupCompareAutocomplete === 'function')
            setupCompareAutocomplete();
        const params=new URLSearchParams(window.location.search);
        const mode=params.get('mode');
        if(mode === 'compare')
        {
            if(typeof loadCompareMode === 'function')
                loadCompareMode();
        }
        else
            setNavActive('radar');
    }
});

function initMap(){
    //initializarea hartii
    if(window.map)  return;
    window.map=L.map('map', {zoomControl: false}).setView(CONFIG.MAP.CENTER, CONFIG.MAP.ZOOM);
    L.control.zoom({position: 'topright'}).addTo(window.map); //butoanele de zoom
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; Storm Route Data', maxZoom: 18
    }).addTo(window.map);
    window.markersLayer=L.layerGroup().addTo(window.map);
}

window.resetMap = function () {
    //resetare harta dupa "reset"
    console.log("Resetare hartă...");
    window.currentMode='radar';
    setNavActive('radar');
    hideAllViews();
    document.getElementById('view-search-mode').style.display='block';
    if(window.markersLayer)
        window.markersLayer.clearLayers();
    document.getElementById('companies-list').innerHTML='';
    document.getElementById('transport-list').innerHTML='';
    document.getElementById('transport-list-header').style.display='none';
    const searchInput=document.getElementById('search-input');
    if(searchInput)
        searchInput.value='';
    document.getElementById('search-status').innerText='AȘTEPTARE INPUT...';
    if(window.map)
        window.map.flyTo(CONFIG.MAP.CENTER, CONFIG.MAP.ZOOM);
};