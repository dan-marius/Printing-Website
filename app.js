/* Browser behaviour: calculator, WhatsApp/call links, contact form. */
(function () {
  "use strict";
  var C = window.SITE_CONFIG;
  var T = window.I18N;
  var lang = document.documentElement.lang === "en" ? "en" : "ro";
  var fmt = new Intl.NumberFormat(lang === "ro" ? "ro-RO" : "en-GB", {
    style: "currency", currency: C.currency, maximumFractionDigits: 2
  });

  // ---- contact links (override baked values so config.js alone is enough) ----
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + C.phone; });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + C.email; });
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var text = a.getAttribute("data-wa-text") || "";
    a.href = "https://wa.me/" + C.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  });

  // ---- calculator ----
  var elHours = document.getElementById("hours");
  var elProducts = document.getElementById("products");
  var elExtras = document.getElementById("extras");
  var elLines = document.getElementById("quote-lines");
  var elTotal = document.getElementById("quote-total");
  var elNote = document.getElementById("quote-note");
  var elWa = document.getElementById("send-wa");
  var elToForm = document.getElementById("send-form");
  var elMsg = document.getElementById("message");
  if (!elHours) return;

  C.products.forEach(function (p) {
    var row = document.createElement("div");
    row.className = "row";
    row.innerHTML =
      '<label for="q-' + p.id + '"><span class="name"></span><span class="price"></span></label>' +
      '<input id="q-' + p.id + '" type="number" min="0" step="1" value="0" inputmode="numeric" data-id="' + p.id + '">';
    row.querySelector(".name").textContent = p.name[lang];
    row.querySelector(".price").textContent = fmt.format(p.price);
    elProducts.appendChild(row);
  });

  function money(v) { return v === 0 ? T.calc.free : fmt.format(v); }

  var seenGroup = {};
  C.extras.forEach(function (e) {
    var label = document.createElement("label");
    label.className = "check";
    var type = e.group ? "radio" : "checkbox";
    var name = e.group ? ' name="x-' + e.group + '"' : "";
    var checked = e.group && !seenGroup[e.group] ? " checked" : "";
    if (e.group) seenGroup[e.group] = true;
    label.innerHTML = '<input type="' + type + '"' + name + checked + ' data-extra="' + e.id + '"><span class="name"></span><span class="price"></span>';
    label.querySelector(".name").textContent = e.name[lang];
    if (e.type === "flat") label.querySelector(".price").textContent = e.value === 0 ? T.calc.free : "+" + fmt.format(e.value);
    elExtras.appendChild(label);
  });

  document.getElementById("rate").textContent = fmt.format(C.designRatePerHour);

  function readInput() {
    var qty = {}, extras = {};
    elProducts.querySelectorAll("input[data-id]").forEach(function (i) { qty[i.dataset.id] = i.value; });
    elExtras.querySelectorAll("input[data-extra]").forEach(function (i) { extras[i.dataset.extra] = i.checked; });
    return { hours: elHours.value, qty: qty, extras: extras };
  }

  function lineText(l) {
    if (l.type === "design") return T.calc.design + ": " + l.hours + " h";
    if (l.type === "product") {
      var p = C.products.filter(function (x) { return x.id === l.id; })[0];
      return l.qty + " x " + p.name[lang];
    }
    var e = C.extras.filter(function (x) { return x.id === l.id; })[0];
    return e.name[lang];
  }

  function quoteText(res) {
    var out = [T.calc.waIntro];
    res.lines.forEach(function (l) { out.push("- " + lineText(l)); });
    out.push(T.calc.estTotal + ": " + fmt.format(res.total));
    return out.join("\n");
  }

  function update() {
    var res = Calc.calculate(C, readInput());
    elLines.innerHTML = "";
    if (!res.lines.length) {
      elLines.innerHTML = '<li class="muted"></li>';
      elLines.firstChild.textContent = T.calc.empty;
      elTotal.textContent = fmt.format(0);
      elNote.textContent = "";
      elWa.setAttribute("aria-disabled", "true");
      elToForm.disabled = true;
      elWa.href = "https://wa.me/" + C.whatsapp;
      return res;
    }
    res.lines.forEach(function (l) {
      var li = document.createElement("li");
      var a = document.createElement("span"); a.textContent = lineText(l);
      var b = document.createElement("span"); b.textContent = money(l.amount);
      li.appendChild(a); li.appendChild(b);
      elLines.appendChild(li);
    });
    elTotal.textContent = fmt.format(res.total);
    elNote.textContent = res.minApplied ? T.calc.minNote.replace("{min}", fmt.format(C.minOrder)) : "";
    elWa.removeAttribute("aria-disabled");
    elToForm.disabled = false;
    elWa.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(quoteText(res));
    return res;
  }

  document.getElementById("calculator").addEventListener("input", update);
  document.getElementById("calculator").addEventListener("change", update);
  elWa.addEventListener("click", function (e) {
    if (elWa.getAttribute("aria-disabled") === "true") e.preventDefault();
  });
  elToForm.addEventListener("click", function () {
    var res = update();
    elMsg.value = quoteText(res);
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    elMsg.focus({ preventScroll: true });
  });
  update();

  // ---- contact form (FormSubmit, delivers to C.email) ----
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = T.form.sending;
    fetch("https://formsubmit.co/ajax/" + C.email, {
      method: "POST", headers: { Accept: "application/json" }, body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (String(j.success) === "true") { status.textContent = T.form.ok; form.reset(); }
        else status.textContent = T.form.fail;
      })
      .catch(function () { status.textContent = T.form.fail; });
  });
})();
