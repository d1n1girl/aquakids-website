// AquaKids Rhein-Neckar: Mini-Interaktivität (kein Build-Schritt nötig)

const WHATSAPP_NUMBER = "4915203611552"; // Format: Ländercode + Nummer, ohne + oder 0 am Anfang

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupBookingForm();
  setupFaq();
  setupScrollReveal();
  setupZoneMap();
  setupKennenlernTermine();
  setupPoolCards();
});

function setupKennenlernTermine() {
  const el = document.getElementById("kennenlern-termine");
  if (!el || typeof KENNENLERNTERMINE === "undefined") return;

  if (!KENNENLERNTERMINE.length) {
    el.innerHTML =
      '<p class="kennenlern-termine-empty">Termine folgen in Kürze. Schreib mir gerne schon jetzt über WhatsApp oder das Formular, dann sag ich dir Bescheid, sobald der nächste Schnuppertag feststeht.</p>';
    return;
  }

  el.innerHTML = KENNENLERNTERMINE.map(
    (t) =>
      '<div class="kennenlern-termin-item">' +
      '<strong>' + t.datum + '</strong>' +
      '<span>' + t.bad + '</span>' +
      '<span>' + t.zeiten + '</span>' +
      "</div>"
  ).join("");
}

function setupPoolCards() {
  const el = document.getElementById("pool-cards");
  if (!el || typeof POOLS === "undefined") return;

  if (!POOLS.length) {
    el.innerHTML =
      '<div class="img-placeholder" style="max-width:520px;margin:0 auto;">' +
      '<span class="emoji">🏊</span>' +
      "<span>Bäder trage ich hier ein, sobald Öffnungszeiten &amp; Eintrittspreise feststehen.</span>" +
      "</div>";
    return;
  }

  el.innerHTML = POOLS.map(
    (p) =>
      '<div class="pool-card">' +
      "<h3>" + p.name + "</h3>" +
      '<a href="' + p.mapsUrl + '" target="_blank" rel="noopener" class="pool-card-maps">Auf Google Maps öffnen &rarr;</a>' +
      '<p><strong>Öffnungszeiten:</strong> ' + p.oeffnungszeiten + "</p>" +
      '<p><strong>Eintritt:</strong> ' + p.eintritt + "</p>" +
      "</div>"
  ).join("");
}

function smoothZoneShape(points, segmentsPerEdge) {
  // Catmull-Rom-Spline durch die Eckpunkte einer geschlossenen Fläche, damit aus den
  // Eckpunkten eine runde, weiche Kontur statt eckiger Linien wird.
  const n = points.length;
  const result = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    for (let t = 0; t < segmentsPerEdge; t++) {
      const s = t / segmentsPerEdge;
      const s2 = s * s;
      const s3 = s2 * s;
      const lat =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * s +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3);
      const lng =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * s +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3);
      result.push([lat, lng]);
    }
  }
  return result;
}

function setupZoneMap() {
  const el = document.getElementById("zone-leaflet-map");
  if (!el || typeof L === "undefined" || typeof ZONES === "undefined") return;

  const CENTER = ZONE_CENTER;

  const map = L.map(el, { scrollWheelZoom: false, center: CENTER, zoom: 11, zoomControl: false });

  L.control.zoom({ position: "topright" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap-Mitwirkende",
    maxZoom: 18,
  }).addTo(map);

  const allPoints = [];
  ZONES.forEach((zone) => {
    const smooth = smoothZoneShape(zone.coords, 12);
    L.polygon(smooth, {
      color: zone.color,
      weight: 3.5,
      opacity: 0.95,
      fillColor: zone.color,
      fillOpacity: 0.45,
      lineJoin: "round",
      lineCap: "round",
      smoothFactor: 1,
      interactive: false,
    }).addTo(map);
    allPoints.push(...zone.coords);
  });

  ZONE_PLACES.forEach(([lat, lng, name]) => {
    L.marker([lat, lng], {
      icon: L.divIcon({ className: "zone-place-dot", iconSize: [8, 8] }),
      interactive: false,
    })
      .addTo(map)
      .bindTooltip(name, {
        permanent: true,
        direction: "top",
        className: "zone-place-label",
        offset: [0, -2],
      });
  });

  if (allPoints.length) {
    map.fitBounds(allPoints, { padding: [16, 16] });
  } else {
    map.setView(CENTER, 11);
  }

  const legend = document.getElementById("zone-legend");
  if (legend) {
    const prices = typeof ZONE_PRICES !== "undefined" ? ZONE_PRICES : {};
    legend.innerHTML = ZONES.map((zone) => {
      const price = prices[zone.name];
      const priceText = typeof price === "number" ? price + " €" : "individuell auf Anfrage";
      return (
        '<span class="zone-legend-item"><span class="zone-dot" style="background:' +
        zone.color +
        '"></span> ' +
        zone.name +
        ": " +
        priceText +
        "</span>"
      );
    }).join("");
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function setupBookingForm() {
  const form = document.querySelector(".booking-form");
  const status = document.querySelector(".form-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const kindname = (data.get("kindname") || "").toString().trim();
    const unterricht = (data.get("unterricht") || "").toString();
    const alter = (data.get("alter") || "").toString().trim();
    const ort = (data.get("ort") || "").toString();
    const termin = (data.get("termin") || "").toString().trim();
    const paket = (data.get("paket") || "").toString();
    const nachricht = (data.get("nachricht") || "").toString().trim();

    const lines = [
      "Hallo AquaKids Rhein-Neckar! Ich möchte gerne einen Termin anfragen.",
      "",
      `Name: ${name}`,
    ];

    if (kindname) {
      lines.push(`Name des Kindes: ${kindname}`);
    }

    lines.push(
      `Gewünschter Kurs: ${unterricht}`,
      `Alter: ${alter}`,
      `Wunschort: ${ort}`,
      `Wunschtermin: ${termin}`,
      `Gewünschtes Paket: ${paket}`,
      "AGB & Datenschutz akzeptiert: Ja"
    );

    if (nachricht) {
      lines.push(`Nachricht: ${nachricht}`);
    }

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    if (status) {
      status.textContent = "Du wirst zu WhatsApp weitergeleitet. Dort einfach die vorausgefüllte Nachricht abschicken.";
      status.classList.add("visible");
    }

    window.open(url, "_blank", "noopener");
  });
}

function setupFaq() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}
