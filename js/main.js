// AquaKids Rhein-Neckar: Mini-Interaktivität (kein Build-Schritt nötig)

const WHATSAPP_NUMBER = "4915203611552"; // Format: Ländercode + Nummer, ohne + oder 0 am Anfang

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupBookingForm();
  setupKooperationForm();
  setupFaq();
  setupScrollReveal();
  setupKennenlernTermine();
  setupPreisUmschalter();
});

function setupPreisUmschalter() {
  const tabs = document.querySelectorAll(".preis-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const ziel = tab.dataset.preisZiel;

      tabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      document.querySelectorAll("[data-preis-gruppe]").forEach((gruppe) => {
        gruppe.hidden = gruppe.dataset.preisGruppe !== ziel;
      });
    });
  });
}

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

function setupKooperationForm() {
  const form = document.getElementById("kooperation-form");
  const status = document.getElementById("kooperation-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const bad = (data.get("bad") || "").toString().trim();
    const nachricht = (data.get("nachricht") || "").toString().trim();

    const lines = ["Hallo! Ich habe eine Kooperationsanfrage für ein Schwimmbad."];

    if (bad) {
      lines.push(`Bad / Ansprechperson: ${bad}`);
    }

    lines.push("", nachricht);

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
