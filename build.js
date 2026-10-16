#!/usr/bin/env node
/*
  Generates index.html (Romanian, default) and en/index.html (English)
  from one template + the texts below, plus sitemap.xml and robots.txt.
  Usage: node build.js
  Edit TEXTS to change wording. Prices/contact live in config.js.
*/
const fs = require("fs");
const path = require("path");

const C = new Function("window", fs.readFileSync(path.join(__dirname, "config.js"), "utf8") + "; return window.SITE_CONFIG;")({});

const TEXTS = {
  ro: {
    title: "proto3d Baia Mare | Piese printate 3D la comandă",
    desc: "Piese printate 3D făcute pe măsură în Baia Mare: măști pentru țevi, piese de schimb, organizatoare auto, suporturi de atelier. Măsurători la domiciliu, preț estimativ pe loc.",
    nav: { services: "Servicii", how: "Cum lucrăm", gallery: "Lucrări", calc: "Preț", contact: "Contact", cta: "Cere ofertă" },
    hero: {
      eyebrow: "Printare și proiectare 3D · Baia Mare",
      h1a: "Piese printate 3D,", h1b: "făcute pe măsură.",
      p: "Măști pentru țevi, piese de schimb greu de găsit, organizatoare auto, suporturi de atelier. Venim să măsurăm, proiectăm piesa și o printăm într-un material potrivit locului unde va sta.",
      cta: "Calculează prețul", call: "Sună", wa: "Scrie pe WhatsApp",
      waText: "Bună! Aș dori o ofertă pentru o piesă printată 3D.",
      points: ["Deplasare în Baia Mare: 50 RON", "Piese funcționale, făcute să reziste", "Trimiți o poză, primești o ofertă"],
      badge: "Măsurăm la tine acasă"
    },
    services: {
      h2: "Ce putem face pentru tine",
      p: "Lucrăm pe piese utile, care rezolvă o problemă concretă în casă, în mașină sau în atelier.",
      items: [
        ["cover", "Măști și capace", "Mascăm țevi, calorifere și goluri de lângă cadă cu piese pe măsura exactă a nișei, cu aerisire unde e nevoie."],
        ["wrench", "Piese de schimb", "S-a rupt o roată, un buton sau o clemă care nu se mai găsește? O refacem după original sau după măsuri."],
        ["car", "Auto și atelier", "Organizatoare pentru consolă, suporturi pentru scule, cleme pentru furtunuri, adaptoare."],
        ["design", "Proiectare 3D", "Pornim de la o schiță, o poză sau piesa veche și desenăm modelul 3D. Dacă ai deja fișierul STL, îl printăm direct."]
      ]
    },
    how: {
      h2: "Cum lucrăm",
      steps: [
        ["Ne spui ce ai nevoie", "Trimite o poză și câteva măsuri pe WhatsApp sau cheamă-ne să măsurăm la fața locului."],
        ["Primești oferta", "Îți spunem prețul și termenul înainte să începem. Fără surprize."],
        ["Proiectăm și printăm", "Desenăm piesa, o printăm și o verificăm. La piese mari printăm întâi o probă."],
        ["Ridici, livrăm sau montăm", "Ridici piesa din Baia Mare, o primești prin curier sau venim să o montăm."]
      ]
    },
    gallery: {
      h2: "Lucrări recente", p: "Piese făcute la comandă pentru clienți din Baia Mare și din împrejurimi.",
      items: [
        ["Mască ventilată pentru țevi", "Modulară, cu fante de aerisire"],
        ["Profil de mascare la cadă", "Acoperă golul dintre cadă și perete"],
        ["Organizator consolă auto", "Cu suport de pahar, pe forma consolei"],
        ["Clemă pentru furtun de aspirație", "Pentru instalația de aspirație din atelier"],
        ["Roată de manevră", "Piesă de schimb refăcută după original"],
        ["Suporturi pentru scule pneumatice", "Montate pe perete, câte unul pe sculă"]
      ]
    },
    calc: {
      h2: "Calculator de preț", p: "Un preț estimativ, ca să știi de la ce pornim. Prețul final îl confirmăm după ce vedem piesa.",
      hours: "Ore de proiectare 3D", hoursHint: "Dacă piesa trebuie desenată. Tarif:", products: "Piese", extras: "Livrare și opțiuni",
      summary: "Estimarea ta", total: "Total estimat",
      sendWa: "Trimite pe WhatsApp", sendForm: "Trimite prin formular",
      help: "Nu știi în ce categorie intră piesa? Trimite o poză pe WhatsApp și îți spunem noi."
    },
    contact: {
      h2: "Hai să vorbim despre piesa ta", p: "Scrie-ne ce ai nevoie. Poza și măsurile ne ajută să răspundem mai repede.",
      name: "Nume", reach: "Telefon sau e-mail", message: "Ce piesă îți trebuie?", send: "Trimite cererea",
      direct: "Contact direct", area: "Zona", phone: "Telefon", email: "E-mail"
    },
    footer: "Piese printate 3D la comandă.",
    switchTo: { label: "EN", title: "View in English", href: "/en/", lang: "en" },
    mail: { subject: "Cerere de ofertă de pe proto3d.eu" },
    ui: {
      design: "Proiectare 3D", waIntro: "Bună! Aș dori o ofertă:", estTotal: "Total estimat",
      empty: "Alege piesele sau orele de proiectare ca să vezi estimarea.",
      minNote: "Comanda minimă este {min}.", free: "Gratuit",
      form: {
        sending: "Se trimite...", ok: "Mulțumim! Am primit cererea și revenim cât mai curând.",
        fail: "Nu s-a putut trimite. Încearcă WhatsApp sau telefon."
      }
    }
  },
  en: {
    title: "proto3d Baia Mare | Custom 3D printed parts",
    desc: "Custom 3D printed parts made to measure in Baia Mare, Romania: pipe covers, spare parts, car organisers, workshop holders. On-site measuring and an instant price estimate.",
    nav: { services: "Services", how: "How it works", gallery: "Work", calc: "Price", contact: "Contact", cta: "Get a quote" },
    hero: {
      eyebrow: "3D printing and design · Baia Mare",
      h1a: "3D printed parts,", h1b: "made to measure.",
      p: "Pipe covers, hard-to-find spare parts, car organisers, workshop holders. We come to measure, design the part and print it in a material suited to where it will be used.",
      cta: "Calculate your price", call: "Call", wa: "Message on WhatsApp",
      waText: "Hi! I'd like a quote for a 3D printed part.",
      points: ["Visit in Baia Mare: 50 RON", "Functional parts, built to last", "Send a photo, get a quote"],
      badge: "We measure on site"
    },
    services: {
      h2: "What we can do for you",
      p: "We focus on useful parts that solve a real problem at home, in the car or in the workshop.",
      items: [
        ["cover", "Covers and trims", "We hide pipes, radiators and gaps next to the bathtub with parts made to the exact size, vented where needed."],
        ["wrench", "Spare parts", "A broken wheel, knob or clip you can no longer buy? We remake it from the original or from measurements."],
        ["car", "Car and workshop", "Console organisers, tool holders, hose clamps, adapters."],
        ["design", "3D design", "We start from a sketch, a photo or the old part and model it in 3D. Already have an STL file? We print it directly."]
      ]
    },
    how: {
      h2: "How it works",
      steps: [
        ["Tell us what you need", "Send a photo and a few measurements on WhatsApp, or ask us to come and measure."],
        ["Get a quote", "You know the price and the timing before we start. No surprises."],
        ["We design and print", "We model the part, print it and check it. For large parts we print a test piece first."],
        ["Pick up, delivery or fitting", "Collect it in Baia Mare, get it by courier, or we come and fit it."]
      ]
    },
    gallery: {
      h2: "Recent work", p: "Custom parts made for customers in and around Baia Mare.",
      items: [
        ["Ventilated pipe cover", "Modular, with ventilation slots"],
        ["Bathtub trim cover", "Closes the gap between bathtub and wall"],
        ["Car console organizer", "With cup holder, shaped to the console"],
        ["Dust hose clamp", "For a workshop dust extraction system"],
        ["Hand wheel", "Replacement remade from the original"],
        ["Air tool wall holders", "Wall-mounted, one per tool"]
      ]
    },
    calc: {
      h2: "Price calculator", p: "An estimate so you know where we start. We confirm the final price once we see the part.",
      hours: "3D design hours", hoursHint: "If the part needs modelling. Rate:", products: "Parts", extras: "Delivery and options",
      summary: "Your estimate", total: "Estimated total",
      sendWa: "Send on WhatsApp", sendForm: "Send via the form",
      help: "Not sure which size your part is? Send a photo on WhatsApp and we'll tell you."
    },
    contact: {
      h2: "Let's talk about your part", p: "Tell us what you need. A photo and measurements help us reply faster.",
      name: "Name", reach: "Phone or email", message: "What part do you need?", send: "Send request",
      direct: "Direct contact", area: "Area", phone: "Phone", email: "Email"
    },
    footer: "Custom 3D printed parts.",
    switchTo: { label: "RO", title: "Vezi în română", href: "/", lang: "ro" },
    mail: { subject: "Quote request from proto3d.eu" },
    ui: {
      design: "3D design", waIntro: "Hi! I'd like a quote:", estTotal: "Estimated total",
      empty: "Pick parts or design hours to see your estimate.",
      minNote: "Minimum order is {min}.", free: "Free",
      form: {
        sending: "Sending...", ok: "Thank you! We received your request and will reply soon.",
        fail: "Could not send. Please try WhatsApp or phone."
      }
    }
  }
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlOf = (lang) => C.domain + (lang === "ro" ? "/" : "/en/");

// Small line icons (24x24, drawn with currentColor).
const ICONS = {
  cover: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h6"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  car: '<path d="M3 13l2-6h14l2 6v4H3z"/><path d="M3 13h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',
  design: '<path d="M3 17 17 3l4 4L7 21H3z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  wa: '<path d="M20 11.5A8.5 8.5 0 0 1 7.4 19L3 20.5l1.5-4.3A8.5 8.5 0 1 1 20 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a5 5 0 0 1-2.8-2.8l.8-1-1-2z"/>'
};
const icon = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

const hasImg = (n) => fs.existsSync(path.join(__dirname, "assets", `gallery-${n}.jpg`));

// Photos 1 and 2 are portrait, so they take two rows in the gallery grid.
const TALL = [1, 2];

function galleryItem(i, item) {
  const n = i + 1;
  const [title, sub] = item;
  const inner = hasImg(n)
    ? `<img src="/assets/gallery-${n}.jpg" alt="${esc(title)}" loading="lazy">`
    : `<div class="ph" aria-hidden="true"><span>3D</span></div>`;
  return `<figure${TALL.includes(n) ? ' class="tall"' : ""}>${inner}<figcaption><strong>${esc(title)}</strong><span>${esc(sub)}</span></figcaption></figure>`;
}

function page(lang) {
  const t = TEXTS[lang];
  const sw = t.switchTo;
  const home = lang === "ro" ? "/" : "/en/";
  const i18nForBrowser = { calc: { design: t.ui.design, waIntro: t.ui.waIntro, estTotal: t.ui.estTotal, empty: t.ui.empty, minNote: t.ui.minNote, free: t.ui.free }, form: t.ui.form };
  const waText = t.hero.waText;
  const waHref = `https://wa.me/${esc(C.whatsapp)}?text=${encodeURIComponent(waText)}`;
  const waAttrs = `data-wa data-wa-text="${esc(waText)}" href="${waHref}" target="_blank" rel="noopener"`;
  const ld = {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    name: "proto3d", url: urlOf(lang), description: t.desc,
    telephone: C.phone, email: C.email, image: C.domain + "/assets/gallery-1.jpg",
    address: { "@type": "PostalAddress", addressLocality: "Baia Mare", addressRegion: "Maramureș", addressCountry: "RO" },
    areaServed: "Baia Mare"
  };
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${urlOf(lang)}">
<link rel="alternate" hreflang="ro" href="${urlOf("ro")}">
<link rel="alternate" hreflang="en" href="${urlOf("en")}">
<link rel="alternate" hreflang="x-default" href="${urlOf("ro")}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${urlOf(lang)}">
<meta property="og:image" content="${C.domain}/assets/gallery-6.jpg">
<meta name="theme-color" content="#14171b">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="${home}"><img src="/assets/favicon.svg" alt="" width="30" height="30"><span>proto<b>3d</b></span></a>
    <nav aria-label="Main">
      <div class="links">
        <a href="#services">${esc(t.nav.services)}</a>
        <a href="#how">${esc(t.nav.how)}</a>
        <a href="#gallery">${esc(t.nav.gallery)}</a>
        <a href="#calculator">${esc(t.nav.calc)}</a>
        <a href="#contact">${esc(t.nav.contact)}</a>
      </div>
      <a class="lang" href="${sw.href}" hreflang="${sw.lang}" lang="${sw.lang}" title="${esc(sw.title)}">${sw.label}</a>
      <a class="btn primary sm" href="#contact">${esc(t.nav.cta)}</a>
    </nav>
  </div>
</header>

<main>
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${esc(t.hero.eyebrow)}</p>
      <h1>${esc(t.hero.h1a)} <span>${esc(t.hero.h1b)}</span></h1>
      <p class="lead">${esc(t.hero.p)}</p>
      <div class="actions">
        <a class="btn primary" href="#calculator">${esc(t.hero.cta)}</a>
        <a class="btn ghost" ${waAttrs}>${icon("wa")}${esc(t.hero.wa)}</a>
        <a class="btn ghost" data-tel href="tel:${esc(C.phone)}">${icon("phone")}${esc(t.hero.call)}</a>
      </div>
      <ul class="points">
        ${t.hero.points.map((p) => `<li>${icon("check")}${esc(p)}</li>`).join("\n        ")}
      </ul>
    </div>
    <div class="hero-art" aria-hidden="true">
      ${hasImg(6) ? `<img class="art-main" src="/assets/gallery-6.jpg" alt="">` : ""}
      ${hasImg(3) ? `<img class="art-side" src="/assets/gallery-3.jpg" alt="">` : ""}
      <span class="art-badge">${icon("pin")}${esc(t.hero.badge)}</span>
    </div>
  </div>
</section>

<section id="services" class="block">
  <div class="wrap">
    <div class="head">
      <h2>${esc(t.services.h2)}</h2>
      <p class="muted">${esc(t.services.p)}</p>
    </div>
    <div class="cards">
      ${t.services.items.map((s) => `<article class="card"><span class="badge">${icon(s[0])}</span><h3>${esc(s[1])}</h3><p>${esc(s[2])}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>

<section id="how" class="block alt">
  <div class="wrap">
    <div class="head"><h2>${esc(t.how.h2)}</h2></div>
    <ol class="steps">
      ${t.how.steps.map((s) => `<li><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></li>`).join("\n      ")}
    </ol>
  </div>
</section>

<section id="gallery" class="block">
  <div class="wrap">
    <div class="head">
      <h2>${esc(t.gallery.h2)}</h2>
      <p class="muted">${esc(t.gallery.p)}</p>
    </div>
    <div class="grid">
      ${t.gallery.items.map((c, i) => galleryItem(i, c)).join("\n      ")}
    </div>
  </div>
</section>

<section id="calculator" class="block alt">
  <div class="wrap">
    <div class="head">
      <h2>${esc(t.calc.h2)}</h2>
      <p class="muted">${esc(t.calc.p)}</p>
    </div>
    <div class="calc">
      <div class="inputs">
        <h3>${esc(t.calc.products)}</h3>
        <div id="products"></div>
        <div class="row">
          <label for="hours"><span class="name">${esc(t.calc.hours)}</span><span class="price">${esc(t.calc.hoursHint)} <span id="rate"></span></span></label>
          <input id="hours" type="number" min="0" step="0.5" value="0" inputmode="decimal">
        </div>
        <h3>${esc(t.calc.extras)}</h3>
        <div id="extras"></div>
        <p class="help">${esc(t.calc.help)}</p>
      </div>
      <aside class="quote" aria-live="polite">
        <h3>${esc(t.calc.summary)}</h3>
        <ul id="quote-lines"></ul>
        <div class="total"><span>${esc(t.calc.total)}</span><strong id="quote-total"></strong></div>
        <p id="quote-note" class="small"></p>
        <a id="send-wa" class="btn primary" href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">${esc(t.calc.sendWa)}</a>
        <button id="send-form" class="btn ghost" type="button">${esc(t.calc.sendForm)}</button>
      </aside>
    </div>
  </div>
</section>

<section id="contact" class="block">
  <div class="wrap">
    <div class="head">
      <h2>${esc(t.contact.h2)}</h2>
      <p class="muted">${esc(t.contact.p)}</p>
    </div>
    <div class="contact">
      <form id="contact-form" class="panel" action="https://formsubmit.co/${esc(C.email)}" method="POST">
        <input type="hidden" name="_subject" value="${esc(t.mail.subject)}">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_next" value="${esc(urlOf(lang))}#contact">
        <input type="hidden" name="language" value="${lang}">
        <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>${esc(t.contact.name)}<input name="name" required autocomplete="name"></label>
        <label>${esc(t.contact.reach)}<input name="contact" required autocomplete="email"></label>
        <label>${esc(t.contact.message)}<textarea id="message" name="message" rows="6" required></textarea></label>
        <button class="btn primary" type="submit">${esc(t.contact.send)}</button>
        <p id="form-status" role="status" class="small"></p>
      </form>
      <aside class="direct">
        <h3>${esc(t.contact.direct)}</h3>
        <a class="line" ${waAttrs}>${icon("wa")}<span><small>WhatsApp</small>${esc(C.phone)}</span></a>
        <a class="line" data-tel href="tel:${esc(C.phone)}">${icon("phone")}<span><small>${esc(t.contact.phone)}</small>${esc(C.phone)}</span></a>
        <a class="line" data-mail href="mailto:${esc(C.email)}">${icon("mail")}<span><small>${esc(t.contact.email)}</small>${esc(C.email)}</span></a>
        <p class="line">${icon("pin")}<span><small>${esc(t.contact.area)}</small>${esc(C.city[lang])}</span></p>
      </aside>
    </div>
  </div>
</section>
</main>

<footer>
  <div class="wrap foot">
    <a class="brand" href="${home}"><img src="/assets/favicon.svg" alt="" width="26" height="26"><span>proto<b>3d</b></span></a>
    <span>© ${new Date().getFullYear()} proto3d.eu · ${esc(t.footer)} · ${esc(C.city[lang])}</span>
  </div>
</footer>

<a class="fab" ${waAttrs} aria-label="WhatsApp">${icon("wa")}</a>

<script>window.I18N=${JSON.stringify(i18nForBrowser)};</script>
<script src="/config.js"></script>
<script src="/calc.js"></script>
<script src="/app.js"></script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(__dirname, "en"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "index.html"), page("ro"));
fs.writeFileSync(path.join(__dirname, "en", "index.html"), page("en"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${["ro", "en"].map((l) => `  <url>
    <loc>${urlOf(l)}</loc>
    <xhtml:link rel="alternate" hreflang="ro" href="${urlOf("ro")}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${urlOf("en")}"/>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(__dirname, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${C.domain}/sitemap.xml\n`);
console.log("Built: index.html, en/index.html, sitemap.xml, robots.txt");
