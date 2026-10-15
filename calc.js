/* Pure price logic: used by the browser and by tests (node). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Calc = factory();
})(this, function () {
  function calculate(cfg, input) {
    input = input || {};
    var hours = Math.max(0, Number(input.hours) || 0);
    var lines = [];
    var subtotal = 0;

    if (hours > 0) {
      var a = hours * cfg.designRatePerHour;
      lines.push({ type: "design", hours: hours, amount: a });
      subtotal += a;
    }
    cfg.products.forEach(function (p) {
      var q = Math.max(0, Math.floor(Number(input.qty && input.qty[p.id]) || 0));
      if (q > 0) {
        var amt = q * p.price;
        lines.push({ type: "product", id: p.id, qty: q, amount: amt });
        subtotal += amt;
      }
    });

    var total = subtotal;
    if (subtotal > 0) {
      cfg.extras.forEach(function (e) {
        if (input.extras && input.extras[e.id]) {
          var amt = e.type === "percent" ? (subtotal * e.value) / 100 : e.value;
          lines.push({ type: "extra", id: e.id, amount: amt });
          total += amt;
        }
      });
    }

    var minApplied = false;
    if (subtotal > 0 && cfg.minOrder && total < cfg.minOrder) {
      total = cfg.minOrder;
      minApplied = true;
    }
    return {
      lines: lines,
      subtotal: Math.round(subtotal * 100) / 100,
      total: Math.round(total * 100) / 100,
      minApplied: minApplied
    };
  }
  return { calculate: calculate };
});
