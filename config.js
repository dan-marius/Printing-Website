/*
  proto3d.eu: the ONE file to edit for prices and contact details.
  After editing, run `node build.js` (optional, see README) and push to GitHub.
*/
window.SITE_CONFIG = {
  domain: "https://proto3d.eu",

  // Contact
  phone: "+40751890165",        // used for the "Call" buttons (with country code)
  whatsapp: "40751890165",      // digits only, country code first, no + sign
  email: "dan_marius_8@yahoo.com", // also where contact form messages are delivered (via formsubmit.co)
  city: { ro: "Baia Mare", en: "Baia Mare, Romania" },

  // Pricing
  currency: "RON",
  designRatePerHour: 100,       // price of one design hour
  minOrder: 50,                 // minimum estimated total (0 to disable)

  products: [
    { id: "small",  price: 30,  name: { ro: "Piesă mică (clemă, buton, capac, distanțier)", en: "Small part (clip, knob, cap, spacer)" } },
    { id: "medium", price: 70,  name: { ro: "Piesă medie (suport, organizator, roată)",      en: "Medium part (holder, organiser, wheel)" } },
    { id: "large",  price: 150, name: { ro: "Piesă mare (mască țevi, carcasă, panou)",       en: "Large part (pipe cover, housing, panel)" } }
  ],

  // Extras with the same `group` are one-choice options (radio buttons); the first one is preselected.
  extras: [
    { id: "pickup",  group: "delivery", type: "flat", value: 0,  name: { ro: "Ridicare personală din Baia Mare", en: "Pick up in Baia Mare" } },
    { id: "visit",   group: "delivery", type: "flat", value: 50, name: { ro: "Deplasare în Baia Mare (măsurători, livrare sau montaj)", en: "Visit in Baia Mare (measuring, delivery or fitting)" } },
    { id: "courier", group: "delivery", type: "flat", value: 25, name: { ro: "Livrare prin curier în toată țara", en: "Courier delivery across Romania" } },
    { id: "rush",    type: "percent", value: 30, name: { ro: "Urgent (+30%)", en: "Rush order (+30%)" } }
  ]
};
