const acum = new Date();

const ieri_pranz = new Date(acum);
ieri_pranz.setDate(acum.getDate() - 1);
ieri_pranz.setHours(13, 30, 0);

const ieri_noapte = new Date(acum);
ieri_noapte.setDate(acum.getDate() - 1);
ieri_noapte.setHours(23, 45, 0); // Va declanșa alerta de noapte

const alaltaieri_dimineata = new Date(acum);
alaltaieri_dimineata.setDate(acum.getDate() - 2);
alaltaieri_dimineata.setHours(6, 15, 0);

const azi_noapte = new Date(acum);
azi_noapte.setHours(2, 10, 0); // Va declanșa alerta de noapte

// --- BAZA DE DATE SIMULATĂ ---
const MOCK_DB = {
  companies: [
    { id: 101, name: "EcoWood Trans SRL" },
    { id: 102, name: "ForestLine Logistics" },
    { id: 103, name: "Natura Lemn SA" },
    { id: 104, name: "Silva Carpați" },
    { id: 105, name: "Transilvania Timber" },
    { id: 106, name: "Bucovina Wood" },
    { id: 107, name: "Harghita Forest" },
    { id: 108, name: "Bradul Verde S.A." },
  ],
  routes: {
    "EcoWood Trans SRL": [
      {
        notice_id: "APV-100234",
        geometry: {
          coordinates: [
            [25.601, 45.652],
            [25.59, 45.657],
          ],
        },
        total_volume: 35.5,
        species: [
          { name: "Fag", volume: 20 },
          { name: "Molid", volume: 15.5 },
        ],
        updated_at: ieri_noapte.toISOString(),
      }, // Brașov (Noapte)
      {
        notice_id: "APV-100235",
        geometry: {
          coordinates: [
            [25.801, 45.752],
            [25.85, 45.76],
          ],
        },
        total_volume: 12.0,
        species: [{ name: "Stejar", volume: 12 }],
        updated_at: ieri_pranz.toISOString(),
      },
      {
        notice_id: "APV-100236",
        geometry: {
          coordinates: [
            [25.5, 45.5],
            [25.51, 45.52],
          ],
        },
        total_volume: 28.0,
        species: [{ name: "Fag", volume: 28 }],
        updated_at: alaltaieri_dimineata.toISOString(),
      },
    ],
    "ForestLine Logistics": [
      {
        notice_id: "APV-884422",
        geometry: {
          coordinates: [
            [26.253, 47.642],
            [26.26, 47.65],
          ],
        },
        total_volume: 45.0,
        species: [{ name: "Molid", volume: 45 }],
        updated_at: ieri_pranz.toISOString(),
      }, // Suceava
      {
        notice_id: "APV-884423",
        geometry: {
          coordinates: [
            [26.1, 47.5],
            [26.15, 47.55],
          ],
        },
        total_volume: 38.5,
        species: [{ name: "Brad", volume: 38.5 }],
        updated_at: ieri_noapte.toISOString(),
      },
    ],
    "Transilvania Timber": [
      {
        notice_id: "APV-551122",
        geometry: {
          coordinates: [
            [23.55, 46.75],
            [23.6, 46.78],
          ],
        },
        total_volume: 52.0,
        species: [
          { name: "Fag", volume: 30 },
          { name: "Stejar", volume: 22 },
        ],
        updated_at: azi_noapte.toISOString(),
      }, // Cluj (Noapte)
      {
        notice_id: "APV-551123",
        geometry: {
          coordinates: [
            [23.7, 46.6],
            [23.75, 46.62],
          ],
        },
        total_volume: 18.0,
        species: [{ name: "Carpen", volume: 18 }],
        updated_at: ieri_pranz.toISOString(),
      },
    ],
    "Harghita Forest": [
      {
        notice_id: "APV-339901",
        geometry: {
          coordinates: [
            [25.8, 46.35],
            [25.82, 46.38],
          ],
        },
        total_volume: 60.0,
        species: [{ name: "Molid", volume: 60 }],
        updated_at: alaltaieri_dimineata.toISOString(),
      }, // Miercurea Ciuc
      {
        notice_id: "APV-339902",
        geometry: {
          coordinates: [
            [25.7, 46.4],
            [25.75, 46.45],
          ],
        },
        total_volume: 42.5,
        species: [
          { name: "Brad", volume: 20 },
          { name: "Molid", volume: 22.5 },
        ],
        updated_at: ieri_pranz.toISOString(),
      },
    ],
    "Bucovina Wood": [
      {
        notice_id: "APV-776655",
        geometry: {
          coordinates: [
            [25.9, 47.7],
            [25.95, 47.72],
          ],
        },
        total_volume: 33.0,
        species: [{ name: "Fag", volume: 33 }],
        updated_at: ieri_pranz.toISOString(),
      }, // Rădăuți
    ],
    "Natura Lemn SA": [
      {
        notice_id: "APV-223344",
        geometry: {
          coordinates: [
            [24.3, 45.1],
            [24.35, 45.15],
          ],
        },
        total_volume: 25.0,
        species: [{ name: "Stejar", volume: 25 }],
        updated_at: ieri_pranz.toISOString(),
      }, // Vâlcea
    ],
    "Silva Carpați": [
      {
        notice_id: "APV-998877",
        geometry: {
          coordinates: [
            [26.3, 46.9],
            [26.35, 46.95],
          ],
        },
        total_volume: 40.0,
        species: [{ name: "Molid", volume: 40 }],
        updated_at: alaltaieri_dimineata.toISOString(),
      }, // Neamț
    ],
    "Bradul Verde S.A.": [
      {
        notice_id: "APV-112233",
        geometry: {
          coordinates: [
            [24.0, 45.8],
            [24.05, 45.85],
          ],
        },
        total_volume: 22.0,
        species: [{ name: "Brad", volume: 22 }],
        updated_at: azi_noapte.toISOString(),
      }, // Sibiu (Noapte)
    ],
  },
  insights: {
    "EcoWood Trans SRL": {
      hourly: [
        { hour: 6, volume: 28 },
        { hour: 13, volume: 12 },
        { hour: 23, volume: 35.5 },
      ], // Vârf de noapte
      species: [
        { name: "Fag", volume: 48 },
        { name: "Molid", volume: 15.5 },
        { name: "Stejar", volume: 12 },
      ],
    },
    "ForestLine Logistics": {
      hourly: [
        { hour: 13, volume: 45 },
        { hour: 23, volume: 38.5 },
      ],
      species: [
        { name: "Molid", volume: 45 },
        { name: "Brad", volume: 38.5 },
      ],
    },
    "Transilvania Timber": {
      hourly: [
        { hour: 2, volume: 52 },
        { hour: 13, volume: 18 },
      ], // Vârf major atipic la 2 AM
      species: [
        { name: "Fag", volume: 30 },
        { name: "Stejar", volume: 22 },
        { name: "Carpen", volume: 18 },
      ],
    },
    "Harghita Forest": {
      hourly: [
        { hour: 6, volume: 60 },
        { hour: 13, volume: 42.5 },
      ], // Activitate de zi
      species: [
        { name: "Molid", volume: 82.5 },
        { name: "Brad", volume: 20 },
      ],
    },
    "Bucovina Wood": {
      hourly: [{ hour: 13, volume: 33 }],
      species: [{ name: "Fag", volume: 33 }],
    },
    "Natura Lemn SA": {
      hourly: [{ hour: 13, volume: 25 }],
      species: [{ name: "Stejar", volume: 25 }],
    },
    "Silva Carpați": {
      hourly: [{ hour: 6, volume: 40 }],
      species: [{ name: "Molid", volume: 40 }],
    },
    "Bradul Verde S.A.": {
      hourly: [{ hour: 2, volume: 22 }], // Doar activitate de noapte
      species: [{ name: "Brad", volume: 22 }],
    },
  },
};

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  let urlString = "";
  if (typeof args[0] === "string") {
    urlString = args[0];
  } else if (args[0] instanceof URL) {
    urlString = args[0].href;
  } else if (args[0] && args[0].url) {
    urlString = args[0].url;
  }
  if (!urlString.includes("zebrahack.iqnox.tech")) {
    return originalFetch.apply(this, args);
  }

  console.log("[MOCK API] Am prins o cerere către:", urlString);

  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const parsedUrl = new URL(urlString);
        const path = parsedUrl.pathname;
        const searchParams = parsedUrl.searchParams;

        // 1. Răspuns pentru CĂUTARE COMPANII (Autocomplete / Search)
        if (path.includes("/companies")) {
          const query = (searchParams.get("search") || "").toLowerCase();
          const filtered = MOCK_DB.companies.filter((c) =>
            c.name.toLowerCase().includes(query),
          );
          return resolve(new Response(JSON.stringify({ companies: filtered })));
        }

        // 2. Răspuns pentru RUTE (Harta principală & Comparator)
        if (path.includes("/routes")) {
          const companyName =
            searchParams.get("company") || "EcoWood Trans SRL";
          // Dacă compania cerută există, o returnăm, altfel returnăm un array gol
          const routes = MOCK_DB.routes[companyName] || [];
          return resolve(new Response(JSON.stringify({ routes: routes })));
        }

        // 3. Răspuns pentru STATISTICI (Insights / Raport Companie)
        if (path.includes("/insights")) {
          let companyName = searchParams.get("companies[]");
          if (companyName) companyName = decodeURIComponent(companyName);

          const insights = MOCK_DB.insights[companyName] || {
            hourly: [],
            species: [],
          };
          return resolve(new Response(JSON.stringify(insights)));
        }
        resolve(new Response(JSON.stringify({})));
      } catch (err) {
        console.error("Eroare în Mock API:", err);
        resolve(
          new Response(JSON.stringify({ error: "Eroare internă de mock" })),
        );
      }
    }, 200);
  });
};
