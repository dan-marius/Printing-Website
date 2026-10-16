/*
  proto3d.eu: the ONE file to edit for prices and contact details.
  All values below are PLACEHOLDERS. Replace them with your real ones.
  After editing, run `node build.js` (optional, see README) and push to GitHub.
*/
window.SITE_CONFIG = {
  domain: "https://proto3d.eu",

  // Contact
  phone: "+40751890165",        // used for the "Call" buttons (with country code)
  whatsapp: "40751890165",      // digits only, country code first, no + sign
  email: "dan_marius_8@yahoo.com", // also where contact form messages are delivered (via formsubmit.co)
  city: { ro: "România", en: "Romania" },

  // Pricing
  currency: "RON",
  designRatePerHour: 100,       // price of one design hour
  minOrder: 50,                 // minimum estimated total (0 to disable)

  products: [
    { id: "keychain", price: 15,  name: { ro: "Breloc personalizat",        en: "Custom keychain" } },
    { id: "holder",   price: 45,  name: { ro: "Suport / organizator mic",   en: "Small holder / organizer" } },
    { id: "figurine", price: 80,  name: { ro: "Figurină / model decorativ", en: "Figurine / decorative model" } },
    { id: "part",     price: 60,  name: { ro: "Piesă funcțională la comandă", en: "Custom functional part" } }
  ],

  extras: [
    { id: "rush",     type: "percent", value: 30, name: { ro: "Urgent (+30%)",          en: "Rush order (+30%)" } },
    { id: "delivery", type: "flat",    value: 20, name: { ro: "Livrare prin curier",    en: "Courier delivery" } }
  ]
};
