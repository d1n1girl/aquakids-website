// AquaKids-rn.de: Mini-Interaktivität (kein Build-Schritt nötig)

const WHATSAPP_NUMBER = "4915203611552"; // Format: Ländercode + Nummer, ohne + oder 0 am Anfang

document.addEventListener("DOMContentLoaded", () => {
  renderPreisKarten();
  setupMobileMenu();
  setupBookingForm();
  setupKooperationForm();
  setupFaq();
  setupScrollReveal();
  setupFormPaketAuswahl();
  setupPoolAngebotForm();
  setupUeberMichFotoTausch();
  setupFotoZoom();
  setupSeifenblasen();
  setupKopierschutz();
  setupButtonBlaeschen();
  renderKursorte();
  setupDetailsPerAnker();
});

function renderKursorte() {
  const container = document.getElementById("kursorte-liste");
  if (!container || typeof POOLS === "undefined" || !POOLS.length) return;

  const zeile = (karte, label, text) => {
    if (!text) return;
    const p = document.createElement("p");
    const b = document.createElement("strong");
    b.textContent = label + ": ";
    p.appendChild(b);
    p.appendChild(document.createTextNode(text));
    karte.appendChild(p);
  };

  const zuhause = container.querySelector(".kursort-zuhause-karte");
  container.querySelectorAll(".kursort-stadt-karte").forEach((karte) => karte.remove());

  POOLS.forEach((pool) => {
    const karte = document.createElement("article");
    karte.className = "card kursort-karte";

    const h = document.createElement("h3");
    h.textContent = pool.name;
    karte.appendChild(h);

    if (pool.stadt) {
      const stadt = document.createElement("p");
      stadt.textContent = pool.stadt;
      karte.appendChild(stadt);
    }
    zeile(karte, "Öffnungszeiten", pool.oeffnungszeiten);
    zeile(karte, "Eintritt", pool.eintritt);

    if (pool.mapsUrl && /^https:\/\//.test(pool.mapsUrl)) {
      const link = document.createElement("a");
      link.href = pool.mapsUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "kursort-route";
      link.textContent = "Route in Google Maps";
      karte.appendChild(link);
    }
    container.insertBefore(karte, zuhause);
  });
}

// Links zu einem zugeklappten Bereich (z. B. "Für Bäder" im Footer) klappen ihn automatisch auf.
function setupDetailsPerAnker() {
  const oeffnen = (id) => {
    const ziel = id ? document.getElementById(id) : null;
    if (ziel && ziel.tagName === "DETAILS") ziel.open = true;
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest('a[href*="#"]');
    if (!link) return;
    const teile = link.getAttribute("href").split("#");
    if (teile.length === 2) oeffnen(teile[1]);
  });
  window.addEventListener("hashchange", () => oeffnen(location.hash.slice(1)));
  oeffnen(location.hash.slice(1));
}

function setupKopierschutz() {
  // Kopieren ist erlaubt in Eingabefeldern, auf den rechtlichen Seiten und bei den
  // Kontaktdaten (Telefonnummer), alles andere bleibt geschützt.
  const erlaubt = (el) =>
    el && el.closest && el.closest("input, textarea, .legal-page, .phone-box, .allow-copy");

  document.addEventListener("copy", (event) => {
    const auswahl = window.getSelection();
    const knoten = auswahl && auswahl.anchorNode;
    const startEl = knoten ? (knoten.nodeType === 1 ? knoten : knoten.parentElement) : null;
    if (erlaubt(event.target) || erlaubt(startEl)) return;
    event.preventDefault();
  });
}

function setupSeifenblasen() {
  let rechtsGedrueckt = false;
  let mausX = 0;
  let mausY = 0;
  let intervall = null;
  let letzteSpawnZeit = 0;

  // Das Kontextmenü bleibt auf Links, Eingabefeldern und den rechtlichen Seiten erhalten
  // (z. B. "Link in neuem Tab öffnen"); überall sonst erzeugt Rechtsklick Seifenblasen.
  document.addEventListener("contextmenu", (event) => {
    const el = event.target;
    if (el && el.closest && el.closest("a, input, textarea, select, button, .legal-page")) return;
    event.preventDefault();
  });

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

    if (rechtsGedrueckt) {
      const jetzt = Date.now();
      if (jetzt - letzteSpawnZeit > 45) {
        letzteSpawnZeit = jetzt;
        seifenblaseErzeugen(mausX, mausY);
      }
    }
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

  const platzenLassen = (event) => {
    if (event) event.stopPropagation();
    blase.classList.add("seifenblase-platzt");
    setTimeout(() => blase.remove(), 220);
  };

  blase.addEventListener("click", platzenLassen);
  blase.addEventListener("animationend", (event) => {
    if (event.animationName !== "seifenblase-platzen") blase.remove();
  });
}

function setupButtonBlaeschen() {
  const buttons = document.querySelectorAll(
    ".btn-coral, .btn-whatsapp, .btn-nav-cta"
  );

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      const rect = button.getBoundingClientRect();
      for (let i = 0; i < 4; i++) {
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + rect.height * 0.3 + Math.random() * rect.height * 0.4;
        setTimeout(() => seifenblaseErzeugen(x, y), i * 80);
      }
    });
  });
}

function setupUeberMichFotoTausch() {
  const wrapperOben = document.querySelector(".foto-wrapper-oben");
  const fotoOben = wrapperOben ? wrapperOben.querySelector("img") : null;
  const wrapperUnten = document.querySelectorAll(".foto-wrapper-unten");
  if (!fotoOben || !wrapperUnten.length) return;

  wrapperUnten.forEach((wrapper) => {
    wrapper.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        wrapper.click();
      }
    });
    wrapper.addEventListener("click", () => {
      const fotoUnten = wrapper.querySelector("img");
      const obenSrc = fotoOben.src;
      const obenAlt = fotoOben.alt;
      fotoOben.src = fotoUnten.src;
      fotoOben.alt = fotoUnten.alt;
      fotoUnten.src = obenSrc;
      fotoUnten.alt = obenAlt;
    });
  });
}

function setupFotoZoom() {
  const wrappers = document.querySelectorAll(".foto-wrapper");
  if (!wrappers.length) return;

  const MIN_ZOOM = 1.2;
  const MAX_ZOOM = 2.6;

  wrappers.forEach((wrapper) => {
    wrapper.addEventListener(
      "wheel",
      (event) => {
        // Nur mit gedrückter Strg-/Cmd-Taste zoomen, sonst scrollt die Seite normal weiter.
        if (!(event.ctrlKey || event.metaKey)) return;
        const img = wrapper.querySelector("img");
        if (!img) return;
        event.preventDefault();

        const aktuell = parseFloat(img.dataset.zoom || MIN_ZOOM);
        const delta = event.deltaY < 0 ? 0.15 : -0.15;
        const neu = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, aktuell + delta));

        img.dataset.zoom = neu;
        img.style.transform = `scale(${neu})`;
      },
      { passive: false }
    );
  });
}

// Beträge kommen zentral aus js/preise-data.js (PREISE) - dort pflegen, nicht hier.

function euroBetrag(betrag) {
  const hatCent = betrag % 1 !== 0;
  return (
    betrag.toLocaleString("de-DE", {
      minimumFractionDigits: hatCent ? 2 : 0,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

// Dauer als Text. Hat ein Angebot in preise-data.js ein "dauerBisMinuten",
// entsteht eine Spanne ("45-50 Minuten"), sonst die feste Dauer.
function dauerText(angebot, einheit) {
  const von = angebot.dauerMinuten;
  const bis = angebot.dauerBisMinuten;
  const spanne = bis && bis !== von ? von + "–" + bis : String(von);
  return spanne + " " + (einheit || "Minuten");
}

function whatsappLink(text) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

function renderPreisKarten() {
  const container = document.getElementById("preis-karten");
  if (!container || typeof PREISE === "undefined") return;

  const kennenlern = PREISE.kennenlern;
  const privat = PREISE.privat;
  const duo = PREISE.duo;
  const duoStundeGesamt = duo.preisProKind * duo.kinder;
  const duoZehnerGesamt = duo.zehnerkarteProKind * duo.kinder;

  container.innerHTML = `
    <article class="price-card preis-karte reveal">
      <h3>${kennenlern.name}</h3>
      <p class="preis-dauer">${kennenlern.dauerMinuten} Minuten · einmalig pro Kind</p>
      <div class="price">${euroBetrag(kennenlern.preis)}</div>
      <p class="preis-text">Wassergewöhnung und Levelcheck, ohne Verpflichtung.</p>
      <div class="karten-fuss">
        <a class="btn btn-whatsapp" target="_blank" rel="noopener"
           href="${whatsappLink(`Hallo! Ich möchte gerne eine ${kennenlern.name} (${kennenlern.dauerMinuten} Min., ${euroBetrag(kennenlern.preis)}) für mein Kind vereinbaren.`)}">Per WhatsApp anfragen</a>
      </div>
    </article>

    <article class="price-card preis-karte reveal">
      <h3>${privat.name}</h3>
      <p class="preis-dauer">${privat.dauerMinuten} Minuten · 1:1</p>
      <div class="price">${euroBetrag(privat.preis)}</div>
      <p class="preis-text">Bei guter Konzentration bis 50 Minuten.</p>
      <div class="zehnerkarte">
        <span class="spar-badge">Du sparst ${euroBetrag(privat.zehnerkarteErsparnis)}</span>
        <p class="zehnerkarte-preis"><strong>Zehnerkarte:</strong> ${euroBetrag(privat.zehnerkarte)}</p>
      </div>
      <div class="karten-fuss">
        <a class="btn btn-whatsapp" target="_blank" rel="noopener"
           href="${whatsappLink(`Hallo! Ich interessiere mich für ${privat.name} (${privat.dauerMinuten} Min., ${euroBetrag(privat.preis)}).`)}">Per WhatsApp anfragen</a>
      </div>
    </article>

    <article class="price-card preis-karte preis-karte-empfohlen reveal">
      <span class="empfehlung-badge">💙 Beliebteste Wahl</span>
      <h3>${duo.name}</h3>
      <p class="preis-dauer">${dauerText(duo)} · zwei Kinder</p>
      <div class="price">${euroBetrag(duo.preisProKind)} <span>pro Kind</span></div>
      <p class="preis-abrechnung">Abrechnung: ${euroBetrag(duoStundeGesamt)} je Stunde für beide Kinder.</p>
      <p class="preis-text">Zwei Kinder mit ähnlichem Können.</p>
      <div class="zehnerkarte">
        <span class="spar-badge">Du sparst ${euroBetrag(duo.zehnerkarteErsparnisProKind)} pro Kind</span>
        <p class="zehnerkarte-preis"><strong>Zehnerkarte:</strong> ${euroBetrag(duo.zehnerkarteProKind)} pro Kind</p>
        <p class="preis-abrechnung">Abrechnung: ${euroBetrag(duoZehnerGesamt)} für beide Kinder.</p>
      </div>
      <div class="karten-fuss">
        <a class="btn btn-whatsapp" target="_blank" rel="noopener"
           href="${whatsappLink(`Hallo! Ich interessiere mich für ${duo.name} (${dauerText(duo, "Min.")}, ${euroBetrag(duo.preisProKind)} pro Kind).`)}">Per WhatsApp anfragen</a>
      </div>
    </article>
  `;
}

function paketOptionen() {
  if (typeof PREISE === "undefined") return { einzel: [], duo: [] };
  const kennenlern = PREISE.kennenlern;
  const privat = PREISE.privat;
  const duo = PREISE.duo;
  const beratung = "Noch unsicher / bitte beraten";

  const alsOption = (text) => ({ value: text, label: text });

  return {
    einzel: [
      `${kennenlern.name} (${kennenlern.dauerMinuten} Min., ${euroBetrag(kennenlern.preis)})`,
      `${privat.name} (${privat.dauerMinuten} Min., ${euroBetrag(privat.preis)})`,
      `Zehnerkarte Privat (${euroBetrag(privat.zehnerkarte)})`,
      beratung,
    ].map(alsOption),
    duo: [
      `${kennenlern.name} (${kennenlern.dauerMinuten} Min., ${euroBetrag(kennenlern.preis)} pro Kind)`,
      `${duo.name} (${dauerText(duo, "Min.")}, ${euroBetrag(duo.preisProKind)} pro Kind)`,
      `Zehnerkarte Duo (${euroBetrag(duo.zehnerkarteProKind)} pro Kind)`,
      beratung,
    ].map(alsOption),
  };
}

function setupFormPaketAuswahl() {
  const tabs = document.querySelectorAll(".form-modus-tab");
  const select = document.getElementById("paket");
  if (!tabs.length || !select) return;

  const optionen = paketOptionen();

  const fuelleOptionen = (modus) => {
    select.innerHTML =
      '<option value="">Bitte wählen</option>' +
      optionen[modus]
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
