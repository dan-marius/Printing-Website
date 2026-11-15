/*
  Engineering portfolio: an overview page and one page per case study, in Romanian and English.
  Called from build.js. To add a case: add an entry to CASES (texts in both languages),
  put its images in assets/portfolio/<id>/, then run `node build.js`.

  Pages:
    /portfolio/                 and /en/portfolio/
    /portfolio/<slug.ro>/       and /en/portfolio/<slug.en>/
*/
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const PERSON = {
  name: "Dan Marius-Vasile",
  linkedin: "https://www.linkedin.com/in/dan-marius-17394a5",
  github: "https://github.com/dan-marius"
};

const UI = {
  ro: {
    nav: { cases: "Studii de caz", about: "Despre", contact: "Contact", shop: "proto3d" },
    switchTo: { label: "EN", title: "View in English", lang: "en" },
    title: "Dan Marius-Vasile – portofoliu inginerie mecanică și proiectare CAD",
    desc: "Portofoliu de inginerie mecanică: dispozitive de sudură pentru caroserii auto, grippere, posturi robotizate, simulări de cinematică și verificări de coliziuni. CATIA V5, SolidWorks, Siemens NX, FreeCAD.",
    role: "Inginer mecanic · Proiectare CAD, dispozitive și simulare",
    lead: "Peste 20 de ani în inginerie mecanică, proiectare de scule și dispozitive și producție de serie. Peste 15 ani de proiectare 3D: dispozitive de sudură pentru caroserii auto, grippere și posturi robotizate, cu simulări de cinematică și verificări de coliziuni, până la desene de execuție.",
    stats: [["20+", "ani în inginerie mecanică"], ["100+", "dispozitive de sudură, grippere și posturi proiectate"], ["15+", "ani de proiectare 3D, zilnic"], ["40+", "familii de produse industrializate"]],
    toolsH: "Instrumente",
    casesH: "Studii de caz", casesP: "Fiecare caz arată datele de intrare, drumul parcurs, problemele întâlnite și corecțiile făcute.",
    read: "Citește studiul de caz",
    shopCard: ["Piese funcționale printate 3D", "Piese proiectate și printate pentru clienți: măști pentru țevi, piese de schimb, suporturi de atelier.", "Vezi lucrările"],
    contactH: "Contact", contactP: "Pentru proiecte de proiectare, dispozitive sau simulare, scrie-mi direct.",
    phone: "Telefon", email: "E-mail",
    back: "Toate studiile de caz", next: "Următorul caz",
    sec: { context: "Context", inputs: "Date de intrare", path: "Drumul parcurs", models: "Modele testate", problems: "Probleme și corecții", video: "Piesa în funcțiune", gallery: "Imagini din proiecte", skills: "Ce demonstrează" },
    problem: "Problema", correction: "Corecția", result: "Rezultat",
    schematic: "Schemă explicativă, redesenată pentru portofoliu",
    meta: { period: "Perioadă", role: "Rol", tools: "Instrumente", programmes: "Programe", materials: "Materiale" },
    tested: "Testat", outcome: "Concluzie",
    footer: "Portofoliu de inginerie"
  },
  en: {
    nav: { cases: "Case studies", about: "About", contact: "Contact", shop: "proto3d" },
    switchTo: { label: "RO", title: "Vezi în română", lang: "ro" },
    title: "Dan Marius-Vasile – mechanical engineering and CAD design portfolio",
    desc: "Mechanical engineering portfolio: body in white welding fixtures, grippers, robotic stations, kinematics simulation and collision checking. CATIA V5, SolidWorks, Siemens NX, FreeCAD.",
    role: "Mechanical engineer · CAD design, tooling and simulation",
    lead: "Over 20 years in mechanical engineering, tooling design and series production. Over 15 years of 3D design: body in white welding fixtures, grippers and robotic stations, with kinematics simulation and collision checking, through to production drawings.",
    stats: [["20+", "years in mechanical engineering"], ["100+", "welding fixtures, grippers and stations designed"], ["15+", "years of 3D design, used daily"], ["40+", "product families industrialised"]],
    toolsH: "Tools",
    casesH: "Case studies", casesP: "Each case shows the inputs, the path taken, the problems found and the corrections made.",
    read: "Read the case study",
    shopCard: ["Functional 3D printed parts", "Parts designed and printed for customers: pipe covers, replacement parts, workshop holders.", "See the work"],
    contactH: "Contact", contactP: "For design, tooling or simulation work, get in touch directly.",
    phone: "Phone", email: "Email",
    back: "All case studies", next: "Next case",
    sec: { context: "Context", inputs: "Inputs", path: "The path taken", models: "Models tested", problems: "Problems and corrections", video: "The part in use", gallery: "Project images", skills: "What it shows" },
    problem: "Problem", correction: "Correction", result: "Result",
    schematic: "Explanatory schematic, redrawn for this portfolio",
    meta: { period: "Period", role: "Role", tools: "Tools", programmes: "Programmes", materials: "Materials" },
    tested: "Tested", outcome: "Outcome",
    footer: "Engineering portfolio"
  }
};

const TOOLS = ["CATIA V5", "SolidWorks", "Siemens NX", "AutoCAD", "FreeCAD", "Python", "SAP"];

/* ---------- explanatory schematics (inline SVG, labels per language) ---------- */
const SVG = {
  // Clamp arm going around the welding gun: thin arm deflects too much, ribbed thicker arm does not.
  arm: (L) => `<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="${L.aria}">
  ${[0, 1].map((k) => {
    const x = k * 280;
    const thick = k === 1;
    return `<g transform="translate(${x},0)">
    <text x="130" y="22" class="d-h">${k ? L.after : L.before}</text>
    <line x1="150" y1="200" x2="262" y2="200" class="d-part"/>
    <text x="206" y="222" class="d-s">${L.part}</text>
    <circle cx="128" cy="150" r="40" class="d-gun"/>
    <text x="128" y="154" class="d-s d-c">${L.gun}</text>
    <rect x="22" y="176" width="44" height="46" rx="4" class="d-base"/>
    <text x="44" y="240" class="d-s d-c">${L.clamp}</text>
    ${thick
      ? `<path d="M44 178 V72 H218 V190" class="d-arm d-arm-thick"/>
         ${[90, 110, 130, 150, 170, 190].map((rx) => `<line x1="${rx}" y1="64" x2="${rx}" y2="80" class="d-rib"/>`).join("")}
         <text x="138" y="52" class="d-s d-c d-ok">${L.ribs}</text>`
      : `<path d="M44 178 V72 H218 V190" class="d-arm"/>
         <path d="M44 178 V74 Q140 80 218 92 V208" class="d-defl"/>
         <text x="270" y="236" class="d-s d-e d-bad">δ &gt; ${L.limit}</text>`}
    <path d="M218 ${thick ? 150 : 160} v26" class="d-load" marker-end="url(#ah)"/>
    <text x="232" y="160" class="d-s">F</text>
    ${thick ? `<text x="270" y="236" class="d-s d-e d-ok">δ ≤ ${L.limit}</text>` : ""}
  </g>`;
  }).join("")}
  <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-arrow"/></marker></defs>
</svg>`,

  // Top view: gripper fingers vs fixture units. One unit collides; units redistributed evenly.
  gripper: (L) => `<svg class="diagram" viewBox="0 0 560 230" role="img" aria-label="${L.aria}">
  ${[0, 1].map((k) => {
    const x = k * 280;
    const units = k ? [30, 82, 134, 186, 238] : [30, 70, 122, 190, 238];
    const fingers = k ? [56, 108, 160, 212] : [56, 108, 160, 212];
    return `<g transform="translate(${x},0)">
    <text x="130" y="22" class="d-h">${k ? L.after : L.before}</text>
    <rect x="14" y="120" width="244" height="44" rx="4" class="d-base"/>
    <text x="136" y="148" class="d-s d-c">${L.fixture}</text>
    <rect x="14" y="44" width="244" height="22" rx="4" class="d-grip"/>
    <text x="136" y="40" class="d-s d-c">${L.gripper}</text>
    ${fingers.map((f) => `<rect x="${f - 6}" y="66" width="12" height="${k ? 46 : 60}" class="d-grip"/>`).join("")}
    ${units.map((u, i) => {
      const hit = !k && i === 1;
      return `<rect x="${u - 12}" y="${k ? 100 : 104}" width="24" height="20" rx="2" class="${hit ? "d-unit d-hit" : "d-unit"}"/>`;
    }).join("")}
    ${k
      ? units.map((u) => `<path d="M${u} 200 v-26" class="d-load-up" marker-end="url(#ah2)"/>`).join("") + `<text x="136" y="222" class="d-s d-c d-ok">${L.even}</text>`
      : `<circle cx="64" cy="114" r="15" class="d-ring"/><text x="136" y="222" class="d-s d-c d-bad">${L.collision}</text>`}
  </g>`;
  }).join("")}
  <defs><marker id="ah2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-arrow-ok"/></marker></defs>
</svg>`,

  // Side view: sliding clamp unit advances to clamp, retracts to free the gun path.
  slide: (L) => `<svg class="diagram" viewBox="0 0 560 230" role="img" aria-label="${L.aria}">
  ${[0, 1].map((k) => {
    const x = k * 280;
    const ux = k ? 70 : 150;
    return `<g transform="translate(${x},0)">
    <text x="130" y="22" class="d-h">${k ? L.retracted : L.advanced}</text>
    <line x1="20" y1="190" x2="250" y2="190" class="d-rail"/>
    <text x="40" y="212" class="d-s">${L.slide}</text>
    <line x1="180" y1="118" x2="262" y2="118" class="d-part"/>
    <text x="222" y="108" class="d-s d-c">${L.part}</text>
    <rect x="${ux}" y="122" width="40" height="66" rx="3" class="d-unit"/>
    <path d="M${ux + 20} 122 V108 H${ux + 44}" class="d-arm"/>
    ${k
      ? `<path d="M${ux + 64} 155 h-36" class="d-load" marker-end="url(#ah3)"/>
         <path d="M196 40 L196 112" class="d-gunpath"/><circle cx="196" cy="58" r="16" class="d-gun"/>
         <text x="196" y="62" class="d-s d-c">${L.gun}</text>
         <text x="120" y="80" class="d-s d-ok">${L.free}</text>`
      : `<path d="M${ux - 24} 155 h20" class="d-load" marker-end="url(#ah3)"/>
         <text x="${ux + 20}" y="96" class="d-s d-c">${L.clamped}</text>`}
  </g>`;
  }).join("")}
  <defs><marker id="ah3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-arrow"/></marker></defs>
</svg>`
};

/* ---------- case studies ---------- */
const CASES = [
  {
    id: "welding",
    slug: { ro: "dispozitive-sudura-caroserie", en: "body-in-white-welding-fixtures" },
    cover: "fixture-assemblies.jpg",
    tags: ["CATIA V5", "DMU Kinematics", "BIW", "GD&T"],
    ro: {
      title: "Dispozitive de sudură robotizată pentru caroserii auto",
      summary: "Dispozitive de sudură, grippere și unități glisante pentru subansamble de caroserie, cu simularea deschiderii clamelor, verificarea încărcării brațelor și a accesului pistolului de sudură.",
      meta: { period: "2010 – 2016", role: "Lider de proiect și proiectant", tools: "CATIA V5, SolidWorks, Siemens NX", programmes: "VW Amarok, Porsche Panamera, Opel Astra, Jaguar XF" },
      context: [
        "Timp de șase ani am proiectat scule pentru caroserii auto în alb (body in white): dispozitive de sudură, grippere pentru roboți, unități glisante și ansambluri de manipulare, peste 100 în total.",
        "Un dispozitiv de sudură ține tablele în poziția exactă cât robotul le sudează. Trebuie să fie precis la zecimi de milimetru, rigid sub forța clamelor, și în același timp să lase loc pistolului de sudură să ajungă la fiecare punct."
      ],
      inputs: [
        "Modelul 3D al subansamblului de tablă și punctele de referință (RPS) pe care trebuie poziționat.",
        "Lista punctelor de sudură și pozițiile pistolului pentru fiecare punct.",
        "Layout-ul postului: robotul, gripperul, direcția de încărcare și timpul de ciclu.",
        "Standardele clientului pentru clame, cilindri, știfturi și desene."
      ],
      path: [
        ["Poziționarea piesei", "Știfturi și suprafețe de sprijin pe punctele RPS, după principiul 3-2-1, astfel încât tabla să nu se poată așeza decât corect."],
        ["Alegerea clamelor", "Tipul și poziția fiecărei clame, astfel încât forța de strângere să cadă pe suprafețele de sprijin."],
        ["Simularea deschiderii clamelor", "Cinematica fiecărei clame în CATIA (DMU Kinematics): cursa brațelor trebuie să elibereze piesa la încărcare și descărcare."],
        ["Încărcarea brațelor", "Greutatea și forțele pe brațele clamelor, pentru alegerea cilindrilor și verificarea rigidității."],
        ["Accesul pistolului de sudură", "Verificarea coliziunilor pentru fiecare punct de sudură și poziție a pistolului; brațele și suporturile care încurcă sunt reproiectate."],
        ["Detaliere și desene", "Desene de execuție cu poziții de BOM, cote și toleranțe, pentru fabricație și montaj."]
      ],
      problems: [
        {
          diagram: "arm",
          title: "Brațul clamei se deforma sub sarcină",
          problem: "Pe un punct de sudură, brațul clamei trebuia să ocolească un subansamblu mare ca să lase loc pistolului de sudură. Brațul lung, cu profil subțire, se deforma peste limita admisă sub sarcina de lucru.",
          correction: "Am păstrat traseul care ocolește pistolul, dar am mărit profilul brațului și am adăugat nervuri.",
          result: "Deformația a intrat în limita admisă, fără să se piardă accesul pistolului."
        },
        {
          diagram: "gripper",
          title: "Gripperul robotului lovea o unitate a dispozitivului",
          problem: "La transferul piesei, gripperul robotului intra în coliziune cu una dintre unitățile de prindere ale dispozitivului.",
          correction: "În loc să mut doar unitatea care lovea, am repoziționat toate unitățile, astfel încât să fie libere față de degetele gripperului și să preia încărcarea uniform.",
          result: "Coliziunea a dispărut, iar sarcina pe suporturi este distribuită egal."
        },
        {
          diagram: "slide",
          title: "Multe puncte de sudură, fără loc pentru un suport fix",
          problem: "Dispozitivul avea multe puncte de sudură și multe poziții ale pistolului. În coordonatele cerute pentru sprijin, un suport fix ar fi blocat accesul pistolului.",
          correction: "Am folosit o unitate de clamă glisantă: avansează pentru poziționare și strângere, apoi se retrage și eliberează traseul pistolului.",
          result: "Piesa este sprijinită exact în coordonatele cerute, iar pistolul ajunge la toate punctele."
        }
      ],
      gallery: [
        ["fixture-assemblies.jpg", "Unități de prindere cu clame și pistolul de sudură în poziție, pentru verificarea accesului."],
        ["station-drawing.jpg", "Desen de ansamblu cu poziții de BOM: gripper pe platforma caroseriei."],
        ["robot-cells.jpg", "Posturi de sudură robotizate: layout și simulare."],
        ["cad-to-drawings.jpg", "De la modelul 3D la desenele de execuție."]
      ],
      skills: ["Poziționare 3-2-1 pe puncte RPS", "Simulare de cinematică (DMU Kinematics)", "Verificări de coliziuni pistol și gripper", "Verificarea rigidității brațelor sub sarcină", "Compromisuri de proiectare: acces vs. rigiditate", "Desene de execuție cu GD&T și BOM"]
    },
    en: {
      title: "Robotic welding fixtures for car body assemblies",
      summary: "Welding fixtures, grippers and sliding units for body in white subassemblies, with clamp opening simulation, clamp arm load checks and welding gun access checks.",
      meta: { period: "2010 – 2016", role: "Project leader and designer", tools: "CATIA V5, SolidWorks, Siemens NX", programmes: "VW Amarok, Porsche Panamera, Opel Astra, Jaguar XF" },
      context: [
        "For six years I designed body in white tooling: welding fixtures, robot grippers, sliding units and handling assemblies, more than 100 in total.",
        "A welding fixture holds the sheet metal parts in an exact position while the robot welds them. It has to be accurate to tenths of a millimetre and stiff under the clamping forces, while still leaving room for the welding gun to reach every spot."
      ],
      inputs: [
        "The 3D model of the sheet metal subassembly and the reference points (RPS) it must be located on.",
        "The list of weld spots and the gun position for each spot.",
        "The station layout: robot, gripper, loading direction and cycle time.",
        "The customer's standards for clamps, cylinders, pins and drawings."
      ],
      path: [
        ["Locating the part", "Pins and support pads on the RPS points, following the 3-2-1 principle, so the sheet can only sit in the correct position."],
        ["Choosing the clamps", "The type and position of each clamp, so the clamping force lands on the support pads."],
        ["Simulating clamp opening", "The kinematics of every clamp in CATIA (DMU Kinematics): the arm stroke must clear the part for loading and unloading."],
        ["Clamp arm loads", "Weight and forces on the clamp arms, to size the cylinders and check stiffness."],
        ["Welding gun access", "Collision checks for every weld spot and gun position; arms and supports in the way are redesigned."],
        ["Detailing and drawings", "Production drawings with BOM balloons, dimensions and tolerances, for manufacturing and assembly."]
      ],
      problems: [
        {
          diagram: "arm",
          title: "The clamp arm deflected under load",
          problem: "On one weld spot, the clamp arm had to reach around a large subassembly to leave room for the welding gun. The long arm with a thin profile deflected beyond the allowed limit under the working load.",
          correction: "I kept the path around the gun but made the arm profile thicker and added ribs.",
          result: "Deflection came back within the allowed limit, without losing gun access."
        },
        {
          diagram: "gripper",
          title: "The robot gripper collided with a fixture unit",
          problem: "During part transfer, the robot gripper collided with one of the fixture's clamping units.",
          correction: "Instead of moving only the unit that collided, I repositioned all the units, so they clear the gripper fingers and share the load evenly.",
          result: "The collision was gone and the load on the supports is evenly distributed."
        },
        {
          diagram: "slide",
          title: "Many weld spots and no room for a fixed support",
          problem: "The fixture had many weld spots and many gun positions. At the required support coordinates, a fixed support would have blocked the gun's path.",
          correction: "I used a sliding clamp unit: it advances to locate and clamp, then retracts and clears the gun's path.",
          result: "The part is supported exactly at the required coordinates, and the gun reaches every spot."
        }
      ],
      gallery: [
        ["fixture-assemblies.jpg", "Clamping units with clamps and the welding gun in position, for access checks."],
        ["station-drawing.jpg", "Assembly drawing with BOM balloons: gripper over the car body floor."],
        ["robot-cells.jpg", "Robotic welding stations: layout and simulation."],
        ["cad-to-drawings.jpg", "From the 3D model to production drawings."]
      ],
      skills: ["3-2-1 locating on RPS points", "Kinematics simulation (DMU Kinematics)", "Gun and gripper collision checks", "Clamp arm stiffness under load", "Design trade-offs: access vs. stiffness", "Production drawings with GD&T and BOM"]
    }
  },
  {
    id: "worm",
    slug: { ro: "melc-pompa-ulei-drujba", en: "chainsaw-oil-pump-worm" },
    cover: "freecad-assembly.jpg",
    tags: ["FreeCAD", "Reverse engineering", "PLA → PETG", "Worm gear"],
    ro: {
      title: "Roată cu melc pentru pompa de ulei a unei drujbe: inginerie inversă",
      summary: "Piesă de schimb pentru un client: am reconstruit roata dințată cu melc după piesa originală uzată, am testat un prototip din PLA, am corectat modelul după probă și am printat piesa finală din PETG.",
      meta: { period: "Octombrie 2026", role: "Proiectare și fabricație, pentru un client", tools: "FreeCAD (Part Design), printare FDM", materials: "PLA (prototip), PETG (final)" },
      context: [
        "Pompa de ulei a drujbei, care unge lanțul, este antrenată printr-un angrenaj: roata dințată primește mișcarea, iar melcul de pe butucul ei antrenează pinionul pompei.",
        "La piesa clientului, din plastic alb, spirele melcului și dinții roții erau uzați. Fără ea, pompa nu mai primește mișcare și lanțul nu mai este uns."
      ],
      inputs: [
        "Fotografii ale piesei originale uzate, trimise de client: roata dințată cu melcul pe butuc.",
        "Pinionul pompei cu care angrenează melcul.",
        "Cerința: o piesă de schimb care să se monteze în locul originalei și să reziste la frecare și la căldura din funcționare."
      ],
      path: [
        ["Analiza piesei originale", "Am identificat geometria din piesele originale: numărul de dinți ai roții, diametrele, pasul și profilul melcului, butucul și alezajul."],
        ["Modelarea în FreeCAD", "Am modelat roata dințată cu melcul integrat și, separat, pinionul pompei, ca să pot verifica angrenarea în ansamblu."],
        ["Prototip din PLA", "Am printat un prim model din PLA alb, rapid și ieftin, și l-am trimis clientului pentru probă."],
        ["Corecții după probă", "Clientul a confirmat modificările: partea roții mai groasă și sensul de lucru inversat."],
        ["Piesa finală din PETG", "Am printat modelul corectat din PETG negru, mai rezistent la frecare și la căldură decât PLA, și am verificat perpendicularitatea cu echerul."]
      ],
      models: [
        { image: "pla-prototype.jpg", material: "PLA", name: "V1 – prototip de probă", text: "Primul model, printat din PLA alb ca să verificăm rapid forma, dimensiunile și angrenarea.", tested: "montajul și angrenarea la client.", outcome: "două modificări: roata mai groasă și sensul de lucru inversat." },
        { image: "final-petg-square-check.jpg", material: "PETG", name: "V2 – piesa finală", text: "Modelul corectat, printat din PETG negru pentru frecare și căldură.", tested: "perpendicularitatea melcului față de roată, cu echerul.", outcome: "piesa finală pentru client." }
      ],
      problems: [
        {
          images: [["worn-worm-threads.webp", "Spirele melcului original, uzate"], ["worn-worm-side.webp", "Melcul uzat, din profil"]],
          title: "Melcul original era uzat",
          problem: "Spirele melcului de pe butucul roții erau tocite și rupte, iar dinții roții aveau urme de uzură. Piesa nu mai transmitea mișcarea la pompă.",
          correction: "Am reconstruit geometria în FreeCAD și am modelat și pinionul pompei, ca să verific angrenarea înainte de printare.",
          result: "Un model complet al ansamblului, gata de prototip."
        },
        {
          images: [["pla-prototype-side.jpg", "Prototipul PLA, din profil"]],
          title: "Roata prototipului era prea subțire",
          problem: "La proba prototipului din PLA, partea roții dințate s-a dovedit prea subțire pentru montaj și pentru sarcina din funcționare.",
          correction: "Am îngroșat partea roții în model, păstrând melcul și butucul.",
          result: "Roata finală este mai rigidă și se așază corect."
        },
        {
          images: [["pla-prototype.jpg", "Prototipul PLA", "50% 22%"]],
          title: "Sensul de lucru era invers",
          problem: "Prototipul a arătat că melcul lucra în sensul opus celui necesar pompei.",
          correction: "Am inversat sensul de lucru al melcului în model.",
          result: "Pompa este antrenată în sensul corect."
        },
        {
          images: [["final-petg-square-check.jpg", "Piesa finală din PETG, verificată cu echerul", "40% 62%"]],
          title: "PLA nu este potrivit pentru o piesă în frecare",
          problem: "PLA este bun pentru prototip, dar se înmoaie la temperaturi relativ mici și nu este gândit pentru frecare continuă, ca într-un angrenaj de pe o drujbă.",
          correction: "Am printat piesa finală din PETG, mai rezistent la frecare și la căldură.",
          result: "Piesa finală, cu perpendicularitatea verificată cu echerul."
        }
      ],
      gallery: [
        ["original-parts.jpg", "Piesele originale: roata cu melc uzată și axul cu pinionul pompei."],
        ["original-pinion.jpg", "Pinionul pompei, văzut de sus."],
        ["freecad-assembly.jpg", "Ansamblul în FreeCAD: roata cu melc și pinionul pompei."],
        ["worn-gear-back.webp", "Roata originală, fața din spate."]
      ],
      skills: ["Inginerie inversă după o piesă uzată", "Modelarea unui angrenaj cu melc în FreeCAD", "Verificarea angrenării în ansamblu", "Prototipare rapidă și iterație cu clientul", "Alegerea materialului după frecare și căldură", "Control dimensional: perpendicularitate"]
    },
    en: {
      title: "Worm gear for a chainsaw oil pump: reverse engineering",
      summary: "A replacement part for a customer: I rebuilt the worm gear from the worn original, tested a PLA prototype, corrected the model after the trial fit and printed the final part in PETG.",
      meta: { period: "October 2026", role: "Design and manufacturing, for a customer", tools: "FreeCAD (Part Design), FDM printing", materials: "PLA (prototype), PETG (final)" },
      context: [
        "The chainsaw's oil pump, which lubricates the chain, is driven through a gear train: the gear wheel receives the motion, and the worm on its hub drives the pump pinion.",
        "On the customer's part, made of white plastic, the worm threads and the gear teeth were worn. Without it, the pump gets no drive and the chain is no longer oiled."
      ],
      inputs: [
        "Photos of the worn original part sent by the customer: the gear wheel with the worm on its hub.",
        "The pump pinion that the worm meshes with.",
        "The requirement: a replacement that fits in place of the original and withstands friction and operating heat."
      ],
      path: [
        ["Analysing the original", "I identified the geometry from the original parts: the number of gear teeth, the diameters, the worm's pitch and profile, the hub and the bore."],
        ["Modelling in FreeCAD", "I modelled the gear with the integrated worm and, separately, the pump pinion, so I could check the meshing in an assembly."],
        ["PLA prototype", "I printed a first model in white PLA, quick and cheap, and sent it to the customer for a trial fit."],
        ["Corrections after the trial", "The customer confirmed the changes: a thicker gear side and a reversed working direction."],
        ["Final part in PETG", "I printed the corrected model in black PETG, which handles friction and heat better than PLA, and checked squareness with a try square."]
      ],
      models: [
        { image: "pla-prototype.jpg", material: "PLA", name: "V1 – trial prototype", text: "The first model, printed in white PLA to check the shape, dimensions and meshing quickly.", tested: "fit and meshing at the customer's.", outcome: "two changes: a thicker gear and a reversed working direction." },
        { image: "final-petg-square-check.jpg", material: "PETG", name: "V2 – final part", text: "The corrected model, printed in black PETG for friction and heat.", tested: "squareness of the worm to the gear, with a try square.", outcome: "the final part for the customer." }
      ],
      problems: [
        {
          images: [["worn-worm-threads.webp", "The original worm threads, worn"], ["worn-worm-side.webp", "The worn worm, side view"]],
          title: "The original worm was worn",
          problem: "The worm threads on the gear hub were worn down and broken, and the gear teeth showed wear. The part no longer drove the pump.",
          correction: "I rebuilt the geometry in FreeCAD and also modelled the pump pinion, to check the meshing before printing.",
          result: "A complete model of the assembly, ready for a prototype."
        },
        {
          images: [["pla-prototype-side.jpg", "The PLA prototype, side view"]],
          title: "The prototype gear was too thin",
          problem: "At the trial fit of the PLA prototype, the gear side turned out too thin for the fit and for the working load.",
          correction: "I thickened the gear side in the model, keeping the worm and hub unchanged.",
          result: "The final gear is stiffer and seats correctly."
        },
        {
          images: [["pla-prototype.jpg", "The PLA prototype", "50% 22%"]],
          title: "The working direction was reversed",
          problem: "The prototype showed that the worm worked in the opposite direction to what the pump needs.",
          correction: "I reversed the worm's working direction in the model.",
          result: "The pump is driven in the correct direction."
        },
        {
          images: [["final-petg-square-check.jpg", "The final PETG part, checked with a try square", "40% 62%"]],
          title: "PLA is not suited to a part under friction",
          problem: "PLA is fine for a prototype, but it softens at relatively low temperatures and is not meant for continuous friction, as in a chainsaw gear train.",
          correction: "I printed the final part in PETG, which handles friction and heat better.",
          result: "The final part, with squareness checked using a try square."
        }
      ],
      gallery: [
        ["original-parts.jpg", "The original parts: the worn worm gear and the pump shaft with its pinion."],
        ["original-pinion.jpg", "The pump pinion, seen from above."],
        ["freecad-assembly.jpg", "The FreeCAD assembly: worm gear and pump pinion."],
        ["worn-gear-back.webp", "The original gear, back face."]
      ],
      skills: ["Reverse engineering from a worn part", "Modelling a worm gear in FreeCAD", "Checking the meshing in an assembly", "Rapid prototyping and iteration with the customer", "Choosing the material for friction and heat", "Dimensional check: squareness"]
    }
  }
];

const DIAGRAM_LABELS = {
  ro: {
    arm: { aria: "Brațul clamei înainte și după întărire", before: "Înainte", after: "După", part: "piesă", gun: "pistol", clamp: "clamă", limit: "admis", ribs: "profil mai gros + nervuri" },
    gripper: { aria: "Gripper și unități înainte și după repoziționare", before: "Înainte", after: "După", fixture: "dispozitiv", gripper: "gripper", collision: "coliziune cu o unitate", even: "unități repoziționate, sarcină egală" },
    slide: { aria: "Unitate de clamă glisantă avansată și retrasă", advanced: "Avansată: strânge piesa", retracted: "Retrasă: eliberează pistolul", slide: "ghidaj", part: "piesă", gun: "pistol", clamped: "strâns", free: "traseu liber" }
  },
  en: {
    arm: { aria: "Clamp arm before and after stiffening", before: "Before", after: "After", part: "part", gun: "gun", clamp: "clamp", limit: "limit", ribs: "thicker profile + ribs" },
    gripper: { aria: "Gripper and units before and after repositioning", before: "Before", after: "After", fixture: "fixture", gripper: "gripper", collision: "collision with one unit", even: "units repositioned, equal load" },
    slide: { aria: "Sliding clamp unit advanced and retracted", advanced: "Advanced: clamps the part", retracted: "Retracted: clears the gun", slide: "slide", part: "part", gun: "gun", clamped: "clamped", free: "path clear" }
  }
};

module.exports = function buildPortfolio({ C, esc, icon }) {
  const base = (lang) => (lang === "ro" ? "/portfolio/" : "/en/portfolio/");
  const caseUrl = (c, lang) => base(lang) + c.slug[lang] + "/";
  const abs = (p) => C.domain + p;
  const img = (c, file) => `/assets/portfolio/${c.id}/${file}`;

  function head(lang, title, desc, url, altUrls, image, ld) {
    return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${abs(url)}">
<link rel="alternate" hreflang="ro" href="${abs(altUrls.ro)}">
<link rel="alternate" hreflang="en" href="${abs(altUrls.en)}">
<link rel="alternate" hreflang="x-default" href="${abs(altUrls.ro)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${abs(url)}">
<meta property="og:image" content="${abs(image)}">
<meta property="og:locale" content="${lang === "ro" ? "ro_RO" : "en_GB"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#14171b">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>`;
  }

  function header(lang, altUrls, onOverview) {
    const t = UI[lang];
    const other = t.switchTo.lang;
    const home = base(lang);
    const pre = onOverview ? "" : home;
    return `<header class="top">
  <div class="wrap bar">
    <a class="brand pf-brand" href="${home}"><span class="mono">DM</span><span>${esc(PERSON.name)}</span></a>
    <nav aria-label="Main">
      <div class="links">
        <a href="${pre}#cases">${esc(t.nav.cases)}</a>
        <a href="${pre}#contact">${esc(t.nav.contact)}</a>
        <a href="${lang === "ro" ? "/" : "/en/"}">${esc(t.nav.shop)} ↗</a>
      </div>
      <a class="lang" href="${altUrls[other]}" hreflang="${other}" lang="${other}" title="${esc(t.switchTo.title)}">${t.switchTo.label}</a>
    </nav>
  </div>
</header>`;
  }

  function contact(lang) {
    const t = UI[lang];
    return `<section id="contact" class="block alt">
  <div class="wrap">
    <div class="head"><h2>${esc(t.contactH)}</h2><p class="muted">${esc(t.contactP)}</p></div>
    <div class="pf-contact">
      <a class="line" href="mailto:${esc(C.email)}" data-mail>${icon("mail")}<span><small>${esc(t.email)}</small>${esc(C.email)}</span></a>
      <a class="line" href="tel:${esc(C.phone)}" data-tel>${icon("phone")}<span><small>${esc(t.phone)}</small>${esc(C.phone)}</span></a>
      <a class="line" href="${PERSON.linkedin}" target="_blank" rel="noopener">${icon("link")}<span><small>LinkedIn</small>dan-marius-17394a5</span></a>
      <a class="line" href="${PERSON.github}" target="_blank" rel="noopener">${icon("code")}<span><small>GitHub</small>dan-marius</span></a>
    </div>
  </div>
</section>`;
  }

  function footer(lang) {
    return `<footer>
  <div class="wrap foot">
    <span class="brand pf-brand"><span class="mono">DM</span><span>${esc(PERSON.name)}</span></span>
    <span>© ${new Date().getFullYear()} · ${esc(UI[lang].footer)} · <a href="${lang === "ro" ? "/" : "/en/"}">proto3d.eu</a></span>
  </div>
</footer>
</body>
</html>
`;
  }

  function overview(lang) {
    const t = UI[lang];
    const altUrls = { ro: base("ro"), en: base("en") };
    const ld = {
      "@context": "https://schema.org", "@type": "Person", name: PERSON.name, jobTitle: t.role,
      url: abs(base(lang)), telephone: C.phone, email: C.email,
      address: { "@type": "PostalAddress", addressLocality: "Baia Mare", addressCountry: "RO" },
      sameAs: [PERSON.linkedin, PERSON.github],
      knowsAbout: ["CATIA V5", "SolidWorks", "Siemens NX", "Welding fixtures", "Body in white tooling", "Kinematics simulation", "FreeCAD", "Python"]
    };
    const cover = CASES[0] ? img(CASES[0], CASES[0].cover) : "/assets/gallery-6.jpg";
    return `${head(lang, t.title, t.desc, base(lang), altUrls, cover, ld)}
<body class="pf">
${header(lang, altUrls, true)}
<main>
<section class="hero pf-hero">
  <div class="wrap">
    <p class="eyebrow">${esc(t.role)}</p>
    <h1>${esc(PERSON.name)}</h1>
    <p class="lead">${esc(t.lead)}</p>
    <dl class="pf-stats">
      ${t.stats.map(([n, l]) => `<div><dt>${esc(n)}</dt><dd>${esc(l)}</dd></div>`).join("\n      ")}
    </dl>
    <div class="pf-tools"><span class="muted">${esc(t.toolsH)}:</span> ${TOOLS.map((x) => `<span class="chip">${esc(x)}</span>`).join(" ")}</div>
  </div>
</section>

<section id="cases" class="block">
  <div class="wrap">
    <div class="head"><h2>${esc(t.casesH)}</h2><p class="muted">${esc(t.casesP)}</p></div>
    <div class="pf-cards">
      ${CASES.map((c) => {
        const d = c[lang];
        return `<a class="pf-card" href="${caseUrl(c, lang)}">
        <img src="${img(c, c.cover)}" alt="" loading="lazy">
        <div class="pf-card-body">
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.summary)}</p>
          <div class="pf-tags">${c.tags.map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>
          <span class="pf-more">${esc(t.read)} →</span>
        </div>
      </a>`;
      }).join("\n      ")}
      <a class="pf-card" href="${lang === "ro" ? "/" : "/en/"}#gallery">
        <img src="/assets/gallery-6.jpg" alt="" loading="lazy">
        <div class="pf-card-body">
          <h3>${esc(t.shopCard[0])}</h3>
          <p>${esc(t.shopCard[1])}</p>
          <div class="pf-tags"><span class="chip">FreeCAD</span><span class="chip">PLA · PETG · ASA</span></div>
          <span class="pf-more">${esc(t.shopCard[2])} →</span>
        </div>
      </a>
    </div>
  </div>
</section>
${contact(lang)}
</main>
${footer(lang)}`;
  }

  function casePage(c, i, lang) {
    const t = UI[lang];
    const d = c[lang];
    const altUrls = { ro: caseUrl(c, "ro"), en: caseUrl(c, "en") };
    const L = DIAGRAM_LABELS[lang];
    const next = CASES[(i + 1) % CASES.length];
    const ld = {
      "@context": "https://schema.org", "@type": "CreativeWork", name: d.title, description: d.summary,
      url: abs(caseUrl(c, lang)), inLanguage: lang, image: abs(img(c, c.cover)),
      author: { "@type": "Person", name: PERSON.name, url: abs(base(lang)) }
    };
    return `${head(lang, `${d.title} – ${PERSON.name}`, d.summary, caseUrl(c, lang), altUrls, img(c, c.cover), ld)}
<body class="pf">
${header(lang, altUrls, false)}
<main>
<section class="hero pf-hero pf-case-hero">
  <div class="wrap">
    <a class="pf-back" href="${base(lang)}#cases">← ${esc(t.back)}</a>
    <h1>${esc(d.title)}</h1>
    <p class="lead">${esc(d.summary)}</p>
    <dl class="pf-meta">
      ${Object.keys(d.meta).map((k) => `<div><dt>${esc(t.meta[k])}</dt><dd>${esc(d.meta[k])}</dd></div>`).join("\n      ")}
    </dl>
  </div>
</section>

<article class="pf-article">
  <section class="block">
    <div class="wrap pf-two">
      <div>
        <h2>${esc(t.sec.context)}</h2>
        ${d.context.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
      <div class="panel">
        <h3>${esc(t.sec.inputs)}</h3>
        <ul class="pf-list">${d.inputs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
    </div>
  </section>

  <section class="block alt">
    <div class="wrap">
      <div class="head"><h2>${esc(t.sec.path)}</h2></div>
      <ol class="pf-path">
        ${d.path.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  ${d.models ? `<section class="block">
    <div class="wrap">
      <div class="head"><h2>${esc(t.sec.models)}</h2></div>
      <div class="pf-models">
        ${d.models.map((m) => `<article class="pf-model">
          <a href="${img(c, m.image)}" target="_blank" rel="noopener"><img src="${img(c, m.image)}" alt="${esc(m.name)}" loading="lazy"></a>
          <div class="pf-model-body">
            <span class="chip">${esc(m.material)}</span>
            <h3>${esc(m.name)}</h3>
            <p>${esc(m.text)}</p>
            ${m.tested ? `<p><strong>${esc(t.tested)}:</strong> ${esc(m.tested)}</p>` : ""}
            <p><strong>${esc(t.outcome)}:</strong> ${esc(m.outcome)}</p>
          </div>
        </article>`).join("\n        ")}
      </div>
    </div>
  </section>` : ""}

  <section class="block${d.models ? " alt" : ""}">
    <div class="wrap">
      <div class="head"><h2>${esc(t.sec.problems)}</h2></div>
      ${d.problems.map((p, n) => `<div class="pf-problem">
        <div class="pf-problem-text">
          <span class="pf-num">${String(n + 1).padStart(2, "0")}</span>
          <h3>${esc(p.title)}</h3>
          <p><strong class="bad">${esc(t.problem)}.</strong> ${esc(p.problem)}</p>
          <p><strong class="good">${esc(t.correction)}.</strong> ${esc(p.correction)}</p>
          <p><strong>${esc(t.result)}.</strong> ${esc(p.result)}</p>
        </div>
        ${p.diagram
          ? `<figure class="pf-diagram">${SVG[p.diagram](L[p.diagram])}<figcaption>${esc(t.schematic)}</figcaption></figure>`
          : `<figure class="pf-photos pf-photos-${p.images.length}">${p.images.map(([f, cap, focus]) => `<a href="${img(c, f)}" target="_blank" rel="noopener"><img src="${img(c, f)}" alt="${esc(cap)}" loading="lazy"${focus ? ` style="object-position:${focus}"` : ""}></a>`).join("")}<figcaption>${p.images.map(([, cap]) => esc(cap)).join(" · ")}</figcaption></figure>`}
      </div>`).join("\n      ")}
    </div>
  </section>

  ${d.video ? `<section class="block">
    <div class="wrap">
      <div class="head"><h2>${esc(t.sec.video)}</h2>${d.video.caption ? `<p class="muted">${esc(d.video.caption)}</p>` : ""}</div>
      ${d.video.youtube
        ? `<div class="pf-video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(d.video.youtube)}" title="${esc(d.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
        : `<div class="pf-video"><video controls preload="metadata" playsinline${d.video.poster ? ` poster="${img(c, d.video.poster)}"` : ""}><source src="${img(c, d.video.file)}" type="video/mp4"></video></div>`}
    </div>
  </section>` : ""}

  ${d.gallery && d.gallery.length ? `<section class="block alt">
    <div class="wrap">
      <div class="head"><h2>${esc(t.sec.gallery)}</h2></div>
      <div class="pf-gallery">
        ${d.gallery.map(([f, cap]) => `<figure><a href="${img(c, f)}" target="_blank" rel="noopener"><img src="${img(c, f)}" alt="${esc(cap)}" loading="lazy"></a><figcaption>${esc(cap)}</figcaption></figure>`).join("\n        ")}
      </div>
    </div>
  </section>` : ""}

  <section class="block">
    <div class="wrap">
      <div class="head"><h2>${esc(t.sec.skills)}</h2></div>
      <ul class="pf-skills">${d.skills.map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul>
      ${CASES.length > 1 ? `<p class="pf-next"><a class="btn primary" href="${caseUrl(next, lang)}">${esc(t.next)}: ${esc(next[lang].title)} →</a></p>` : ""}
    </div>
  </section>
</article>
${contact(lang)}
</main>
${footer(lang)}`;
  }

  const written = [];
  const write = (urlPath, html) => {
    const dir = path.join(ROOT, ...urlPath.split("/").filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    written.push(urlPath);
  };
  for (const lang of ["ro", "en"]) {
    write(base(lang), overview(lang));
    CASES.forEach((c, i) => write(caseUrl(c, lang), casePage(c, i, lang)));
  }

  // Page pairs (ro/en) for the sitemap.
  return [{ ro: base("ro"), en: base("en") }].concat(CASES.map((c) => ({ ro: caseUrl(c, "ro"), en: caseUrl(c, "en") })));
};
