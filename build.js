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
    title: "proto3d | Printare 3D la comandă și design 3D",
    desc: "Printare 3D la comandă, design și modelare 3D. Calculează un preț estimativ și cere o ofertă prin telefon, WhatsApp sau formular.",
    nav: { services: "Servicii", gallery: "Galerie", calc: "Calculator", contact: "Contact" },
    hero: {
      h1: "Din idee, obiect real.",
      p: "Printare 3D la comandă și design 3D: de la un breloc personalizat la o piesă funcțională sau un prototip. Estimezi prețul în câteva secunde, apoi confirmăm împreună.",
      cta: "Calculează prețul", call: "Sună acum", wa: "WhatsApp",
      waText: "Bună! Aș dori o ofertă pentru printare 3D."
    },
    services: {
      h2: "Ce facem",
      items: [
        ["Printare 3D la comandă", "Ai deja un model? Îl printăm în materialul și culoarea potrivite."],
        ["Design și modelare 3D", "Pornim de la o schiță sau o poză și creăm modelul 3D pentru tine, facturat pe ore."],
        ["Prototipuri și piese mici", "Piese de schimb, suporturi, organizatoare, machete: rapid și la cantități mici."]
      ]
    },
    gallery: { h2: "Lucrări", p: "Câteva exemple de obiecte printate.", items: ["Breloc personalizat", "Suport birou", "Figurină", "Piesă funcțională", "Prototip", "Organizator"] },
    calc: {
      h2: "Calculator de preț", p: "Un preț estimativ. Prețul final îl confirmăm după ce ne spui detaliile.",
      hours: "Ore de design 3D", hoursHint: "Tarif:", products: "Produse", extras: "Opțiuni",
      summary: "Estimarea ta", total: "Total estimat",
      sendWa: "Trimite pe WhatsApp", sendForm: "Trimite prin formular"
    },
    contact: {
      h2: "Contact", p: "Spune-ne ce ai nevoie. Poți atașa modelul (STL) prin e-mail sau WhatsApp.",
      name: "Nume", reach: "Telefon sau e-mail", message: "Mesaj", send: "Trimite cererea",
      or: "Sau contactează-ne direct:"
    },
    footer: "Toate drepturile rezervate.",
    switchTo: { label: "EN", title: "View in English", href: "/en/", lang: "en" },
    mail: { subject: "Cerere de ofertă de pe proto3d.eu" },
    ui: {
      design: "Design 3D", waIntro: "Bună! Aș dori o ofertă:", estTotal: "Total estimat",
      empty: "Alege ore de design sau produse pentru a vedea estimarea.",
      minNote: "Comanda minimă este {min}.",
      form: {
        sending: "Se trimite...", ok: "Mulțumim! Am primit cererea și revenim cât mai curând.",
        fail: "Nu s-a putut trimite. Încearcă WhatsApp sau telefon.",
        noKey: "Formularul nu este configurat încă (lipsește cheia Web3Forms)."
      }
    }
  },
  en: {
    title: "proto3d | Custom 3D printing and 3D design",
    desc: "Custom 3D printing, 3D design and modelling. Get an instant price estimate and request a quote by phone, WhatsApp or form.",
    nav: { services: "Services", gallery: "Gallery", calc: "Calculator", contact: "Contact" },
    hero: {
      h1: "From idea to real object.",
      p: "Custom 3D printing and 3D design: from a personalised keychain to a functional part or a prototype. Estimate the price in seconds, then we confirm it together.",
      cta: "Calculate your price", call: "Call now", wa: "WhatsApp",
      waText: "Hi! I'd like a quote for 3D printing."
    },
    services: {
      h2: "What we do",
      items: [
        ["Custom 3D printing", "Already have a model? We print it in the right material and colour."],
        ["3D design and modelling", "We start from a sketch or a photo and create the 3D model for you, billed by the hour."],
        ["Prototypes and small parts", "Spare parts, holders, organisers, mock-ups: fast and in small quantities."]
      ]
    },
    gallery: { h2: "Our work", p: "A few examples of printed objects.", items: ["Custom keychain", "Desk holder", "Figurine", "Functional part", "Prototype", "Organizer"] },
    calc: {
      h2: "Price calculator", p: "This is an estimate. We confirm the final price once we know the details.",
      hours: "3D design hours", hoursHint: "Rate:", products: "Products", extras: "Options",
      summary: "Your estimate", total: "Estimated total",
      sendWa: "Send on WhatsApp", sendForm: "Send via the form"
    },
    contact: {
      h2: "Contact", p: "Tell us what you need. You can send the model (STL) by email or WhatsApp.",
      name: "Name", reach: "Phone or email", message: "Message", send: "Send request",
      or: "Or contact us directly:"
    },
    footer: "All rights reserved.",
    switchTo: { label: "RO", title: "Vezi în română", href: "/", lang: "ro" },
    mail: { subject: "Quote request from proto3d.eu" },
    ui: {
      design: "3D design", waIntro: "Hi! I'd like a quote:", estTotal: "Estimated total",
      empty: "Pick design hours or products to see your estimate.",
      minNote: "Minimum order is {min}.",
      form: {
        sending: "Sending...", ok: "Thank you! We received your request and will reply soon.",
        fail: "Could not send. Please try WhatsApp or phone.",
        noKey: "The form is not configured yet (Web3Forms key missing)."
      }
    }
  }
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlOf = (lang) => C.domain + (lang === "ro" ? "/" : "/en/");

function galleryItem(i, caption) {
  const file = `gallery-${i + 1}.jpg`;
  const exists = fs.existsSync(path.join(__dirname, "assets", file));
  const inner = exists
    ? `<img src="/assets/${file}" alt="${esc(caption)}" loading="lazy">`
    : `<div class="ph" aria-hidden="true"><span>3D</span></div>`;
  return `<figure>${inner}<figcaption>${esc(caption)}</figcaption></figure>`;
}

function page(lang) {
  const t = TEXTS[lang];
  const sw = t.switchTo;
  const i18nForBrowser = { calc: { design: t.ui.design, waIntro: t.ui.waIntro, estTotal: t.ui.estTotal, empty: t.ui.empty, minNote: t.ui.minNote }, form: t.ui.form };
  const waText = t.hero.waText;
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
<meta name="theme-color" content="#ff6a1a">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="${lang === "ro" ? "/" : "/en/"}">proto<b>3d</b></a>
    <nav aria-label="Main">
      <a href="#services">${esc(t.nav.services)}</a>
      <a href="#gallery">${esc(t.nav.gallery)}</a>
      <a href="#calculator">${esc(t.nav.calc)}</a>
      <a href="#contact">${esc(t.nav.contact)}</a>
      <a class="lang" href="${sw.href}" hreflang="${sw.lang}" lang="${sw.lang}" title="${esc(sw.title)}">${sw.label}</a>
    </nav>
  </div>
</header>

<main>
<section class="hero">
  <div class="wrap">
    <h1>${esc(t.hero.h1)}</h1>
    <p class="lead">${esc(t.hero.p)}</p>
    <div class="actions">
      <a class="btn primary" href="#calculator">${esc(t.hero.cta)}</a>
      <a class="btn" data-tel href="tel:${esc(C.phone)}">${esc(t.hero.call)}</a>
      <a class="btn" data-wa data-wa-text="${esc(waText)}" href="https://wa.me/${esc(C.whatsapp)}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${esc(t.hero.wa)}</a>
    </div>
  </div>
</section>

<section id="services" class="wrap block">
  <h2>${esc(t.services.h2)}</h2>
  <div class="cards">
    ${t.services.items.map((s) => `<article class="card"><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></article>`).join("\n    ")}
  </div>
</section>

<section id="gallery" class="wrap block">
  <h2>${esc(t.gallery.h2)}</h2>
  <p class="muted">${esc(t.gallery.p)}</p>
  <div class="grid">
    ${t.gallery.items.map((c, i) => galleryItem(i, c)).join("\n    ")}
  </div>
</section>

<section id="calculator" class="wrap block">
  <h2>${esc(t.calc.h2)}</h2>
  <p class="muted">${esc(t.calc.p)}</p>
  <div class="calc">
    <div class="inputs">
      <div class="row">
        <label for="hours"><span class="name">${esc(t.calc.hours)}</span><span class="price">${esc(t.calc.hoursHint)} <span id="rate"></span></span></label>
        <input id="hours" type="number" min="0" step="0.5" value="0" inputmode="decimal">
      </div>
      <h3>${esc(t.calc.products)}</h3>
      <div id="products"></div>
      <h3>${esc(t.calc.extras)}</h3>
      <div id="extras"></div>
    </div>
    <aside class="quote" aria-live="polite">
      <h3>${esc(t.calc.summary)}</h3>
      <ul id="quote-lines"></ul>
      <div class="total"><span>${esc(t.calc.total)}</span><strong id="quote-total"></strong></div>
      <p id="quote-note" class="muted small"></p>
      <a id="send-wa" class="btn primary" href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">${esc(t.calc.sendWa)}</a>
      <button id="send-form" class="btn" type="button">${esc(t.calc.sendForm)}</button>
    </aside>
  </div>
</section>

<section id="contact" class="wrap block">
  <h2>${esc(t.contact.h2)}</h2>
  <p class="muted">${esc(t.contact.p)}</p>
  <form id="contact-form" action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="">
    <input type="hidden" name="subject" value="${esc(t.mail.subject)}">
    <input type="hidden" name="from_name" value="proto3d.eu">
    <input type="hidden" name="language" value="${lang}">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <label>${esc(t.contact.name)}<input name="name" required autocomplete="name"></label>
    <label>${esc(t.contact.reach)}<input name="contact" required autocomplete="email"></label>
    <label>${esc(t.contact.message)}<textarea id="message" name="message" rows="6" required></textarea></label>
    <button class="btn primary" type="submit">${esc(t.contact.send)}</button>
    <p id="form-status" role="status" class="small"></p>
  </form>
  <p class="direct">${esc(t.contact.or)}
    <a data-tel href="tel:${esc(C.phone)}">${esc(C.phone)}</a> ·
    <a data-wa data-wa-text="${esc(waText)}" href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a> ·
    <a data-mail href="mailto:${esc(C.email)}">${esc(C.email)}</a>
  </p>
</section>
</main>

<footer>
  <div class="wrap">© ${new Date().getFullYear()} proto3d.eu · ${esc(t.footer)}</div>
</footer>

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
