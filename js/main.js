// AquaKids-rn.de: Mini-Interaktivität (kein Build-Schritt nötig)

const WHATSAPP_NUMBER = "4915203611552"; // Format: Ländercode + Nummer, ohne + oder 0 am Anfang

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupBookingForm();
  setupKooperationForm();
  setupFaq();
  setupScrollReveal();
  setupKennenlernTermine();
  setupPreisUmschalter();
  setupFormPaketAuswahl();
  setupPoolAngebotForm();
  setupUeberMichFotoTausch();
  setupSeifenblasen();
});

function setupSeifenblasen() {
  let rechtsGedrueckt = false;
  let mausX = 0;
  let mausY = 0;
  let intervall = null;

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  document.addEventListener("mousedown", (event) => {
    if (event.button !== 2) return;
    rechtsGedrueckt = true;
    mausX = event.clientX;
    mausY = event.clientY;
    seifenblaseErzeugen(mausX, mausY);
    intervall = setInterval(() => {
      if (rechtsGedrueckt) seifenblaseErzeugen(mausX, mausY);
    }, 120);
  });

  document.addEventListener("mousemove", (event) => {
    mausX = event.clientX;
    mausY = event.clientY;
  });

  const stoppen = () => {
    rechtsGedrueckt = false;
    if (intervall) {
      clearInterval(intervall);
      intervall = null;
    }
  };
  document.addEventListener("mouseup", stoppen);
  document.addEventListener("mouseleave", stoppen);
}

function seifenblaseErzeugen(x, y) {
  const blase = document.createElement("div");
  blase.className = "seifenblase";
  const groesse = 10 + Math.random() * 18;
  blase.style.width = groesse + "px";
  blase.style.height = groesse + "px";
  blase.style.left = x - groesse / 2 + "px";
  blase.style.top = y - groesse / 2 + "px";
  document.body.appendChild(blase);
  blase.addEventListener("animationend", () => blase.remove());
}

function setupUeberMichFotoTausch() {
  const fotoOben = document.querySelector(".foto-oben");
  const fotosUnten = document.querySelectorAll(".foto-unten");
  if (!fotoOben || !fotosUnten.length) return;

  fotosUnten.forEach((foto) => {
    foto.addEventListener("click", () => {
      const obenSrc = fotoOben.src;
      const obenAlt = fotoOben.alt;
      fotoOben.src = foto.src;
      fotoOben.alt = foto.alt;
      foto.src = obenSrc;
      foto.alt = obenAlt;
    });
  });
}

const PAKET_OPTIONEN = {
  einzel: [
    { value: "Schnupperstunde (30 € / 30 Min.)", label: "Schnupperstunde (30 € / 30 Min.)" },
    { value: "10er-Karte Einzel (650 €)", label: "10er-Karte Einzel (650 €)" },
    { value: "Unterricht im eigenen Pool (5 € Rabatt pro Einheit)", label: "Unterricht im eigenen Pool (5 € Rabatt pro Einheit)" },
    { value: "Noch unsicher / bitte beraten", label: "Noch unsicher / bitte beraten" },
  ],
  duo: [
    { value: "Schnupperstunde Duo (30 € / 30 Min., für beide)", label: "Schnupperstunde Duo (30 € / 30 Min., für beide)" },
    { value: "Duo-10er-Karte (500 € pro Kind)", label: "Duo-10er-Karte (500 € pro Kind)" },
    { value: "Unterricht im eigenen Pool (5 € Rabatt pro Einheit)", label: "Unterricht im eigenen Pool (5 € Rabatt pro Einheit)" },
    { value: "Noch unsicher / bitte beraten", label: "Noch unsicher / bitte beraten" },
  ],
};

function setupFormPaketAuswahl() {
  const tabs = document.querySelectorAll(".form-modus-tab");
  const select = document.getElementById("paket");
  if (!tabs.length || !select) return;

  const fuelleOptionen = (modus) => {
    select.innerHTML =
      '<option value="">Bitte wählen</option>' +
      PAKET_OPTIONEN[modus]
        .map((o) => '<option value="' + o.value + '">' + o.label + "</option>")
        .join("");
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const modus = tab.dataset.formModus;

      tabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      fuelleOptionen(modus);
    });
  });

  fuelleOptionen("einzel");
}

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
      '<p class="kennenlern-termine-empty">Termine werden individuell vereinbart. Schreib mir gerne über WhatsApp oder das Formular, dann finden wir gemeinsam einen Termin.</p>';
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
      "Hallo AquaKids-rn.de! Ich möchte gerne einen Termin anfragen.",
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

function setupPoolAngebotForm() {
  const form = document.getElementById("pool-angebot-form");
  const status = document.getElementById("pool-angebot-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const standort = (data.get("standort") || "").toString().trim();
    const preis = (data.get("preis") || "").toString().trim();
    const verfuegbarkeit = (data.get("verfuegbarkeit") || "").toString().trim();
    const nachricht = (data.get("nachricht") || "").toString().trim();

    const lines = [
      "Hallo! Ich möchte meinen Pool als Lernort für Schwimmunterricht anbieten.",
      "",
      `Name: ${name}`,
      `Standort: ${standort}`,
    ];

    if (preis) {
      lines.push(`Gewünschter Preis pro Stunde: ${preis}`);
    }

    if (verfuegbarkeit) {
      lines.push(`Verfügbarkeit: ${verfuegbarkeit}`);
    }

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
