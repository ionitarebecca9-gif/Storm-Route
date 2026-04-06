# Storm Route

**Storm Route** este un site de investigație digitală destinat monitorizării transporturilor de lemne (SUMAL 2.0). Aplicația transformă datele brute din baza de date a transporturilor în informații gata de analizat. Se verifică automat fiecare aviz SUMAL 2.0, analizându-se condițiile meteo de drum pentru a detecta anomalii. Fiind date dintr-un API privat, acest repository folosește doar exemple fictive. Pentru utilizarea aplicației vor fi utilizate companiile de mock: "EcoWood Trans SRL", "ForestLine Logistics", "Natura Lemn SA", "Silva Carpați", "Transilvania Timber", "Bucovina Wood", "Harghita Forest", "Bradul Verde S.A.".

Astfel, se oferă o imagine clară asupra riscurilor, ajutând utilizatorii să identifice:
* **Transporturi efectuate pe timp de vreme extremă**, cu risc crescut de accidente.
* **Activități nocturne** atipice.
* **Diferențe de volum între companii** (prin intermediul modulului comparator).


## Tehnologii Folosite
Proiectul este construit folosind tehnologii web standard:
* **HTML5**
* **CSS3**
* **JavaScript (Vanilla)**

## Cum Funcționează?

Procesul de investigație este simplu și intuitiv, structurat în 4 pași:

1. **CAUTĂ**: Introdu numele companiei. Sistemul sugerează automat companiile disponibile în baza de date.
2. **EXPLOREAZĂ**: Vezi traseele pe hartă. Poți selecta un punct specific de pe hartă pentru a-l investiga în detaliu.
3. **ANALIZEAZĂ**: Markerele roșii de pe hartă indică zonele/transporturile cu vreme neprielnică.
4. **CERE RAPORT**: Generează un raport detaliat pentru o companie sau un traseu specific.


## Module Principale

Aplicația este împărțită în patru module esențiale pentru analiză:
* **Hartă LIVE**: Vizualizare geografică interactivă a rutelor de transport.
* **Insights**: Grafice detaliate orare și topul speciilor de lemn transportate.
* **Comparator**: Analiză comparativă între două companii de transport.
* **Raport**: Generare de raport la cerere pentru fiecare companie și transport în parte.


## Arhitectură & APIs

Sistemul integrează două API-uri distincte pentru a corela datele de transport cu cele meteorologice:

### API #1: ZebraHack Data
Acesta reprezintă sursa principală de date. Se folosesc următoarele endpoint-uri:
* `GET /companies` - pentru funcția de căutare a companiilor.
* `GET /routes` - pentru obținerea geometriilor GeoJSON ale transporturilor, volumelor și speciilor de lemn.
* `GET /insights` - pentru analiza detaliată pe ore și specii.

### API #2: Open-Meteo
Folosit pentru a evalua condițiile de drum:
* Pentru fiecare transport se analizează starea meteo pe baza **coordonatelor geografice, a datei și a orei**.
* **Regulă de alertă**: Dacă vântul depășește **20 km/h** sau ploaia este de peste **0.5 mm**, transportul este marcat automat cu **RISC RIDICAT**.


## Etică & Limitări

> **Notă importantă:** Rezultatele și alertele oferite de această aplicație indică doar un **context de risc**, nu o certitudine absolută a unei încălcări a legii sau a unui accident. Aplicația este un instrument de investigație și suport decizional.