// AquaKids Rhein-Neckar: Gemeinsame Werkzeuge für die digitalen Formulare
// (vertrag.html, foto-einwilligung.html): Unterschriftsfeld, PDF-Layout, PDF-Datei, Teilen.
// Alles läuft im Browser – es wird nichts an einen Server geschickt.

const KURSLEITUNG = {
  name: "Nadine Reinhard",
  firma: "AquaKids Rhein-Neckar",
  strasse: "Schillerstraße 21",
  ort: "68535 Edingen",
  telefon: "+49 1520 3611552",
  email: "aquakidsrheinneckar@gmail.com",
  // IBAN hier eintragen (z. B. "DE12 3456 7890 1234 5678 90"), dann steht sie automatisch im
  // Vertrag. Leer lassen = "Die Bankverbindung steht auf der Rechnung."
  iban: "",
  kontoinhaberin: "Nadine Reinhard",
};

// ---------- Hilfsfunktionen ----------

function euro(betrag) {
  const optionen = Number.isInteger(betrag)
    ? {}
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return `${betrag.toLocaleString("de-DE", optionen)} €`;
}

function datumDeutsch(wert) {
  if (!wert) return "";
  if (wert instanceof Date) {
    return wert.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  const [jahr, monat, tag] = wert.split("-");
  return `${tag}.${monat}.${jahr}`;
}

function uhrzeitDeutsch(datum) {
  return datum.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function alterInJahren(isoGeburtsdatum) {
  if (!isoGeburtsdatum) return null;
  const geburt = new Date(`${isoGeburtsdatum}T00:00:00`);
  const heute = new Date();
  let alter = heute.getFullYear() - geburt.getFullYear();
  if (heute < new Date(heute.getFullYear(), geburt.getMonth(), geburt.getDate())) alter--;
  return alter;
}

function neueDokumentnummer(praefix) {
  const zeichen = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const zufall = crypto.getRandomValues(new Uint8Array(4));
  const code = Array.from(zufall, (z) => zeichen[z % zeichen.length]).join("");
  const d = new Date();
  const datum = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `${praefix}-${datum}-${code}`;
}

function dateinameSicher(text) {
  return text
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue").replace(/ß/g, "ss")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function textElement(tag, text, klasse) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (klasse) el.className = klasse;
  return el;
}

// Paragrafen ({ titel, absaetze: [...] }) als HTML in einen Container schreiben.
function paragrafenAufSeite(container, paragrafen) {
  paragrafen.forEach(({ titel, absaetze }) => {
    container.append(textElement("h3", titel));
    absaetze.forEach((absatz, i) => {
      const nummer = absaetze.length > 1 ? `(${i + 1}) ` : "";
      container.append(textElement("p", nummer + absatz));
    });
  });
}

// ---------- Unterschriftsfeld ----------

function signaturFeld(feld) {
  const canvas = feld.querySelector("canvas");
  const platzhalter = feld.querySelector(".signatur-platzhalter");
  const loeschen = feld.parentElement.querySelector(".signatur-loeschen");
  const ctx = canvas.getContext("2d");
  const striche = [];
  let aktuellerStrich = null;

  const neuZeichnen = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    zeichneStriche(ctx, striche, (p) => p, 2.6, "#1d3a8a");
    platzhalter.hidden = striche.length > 0;
  };

  const groesseAnpassen = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    neuZeichnen();
  };

  const punkt = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const geaendert = () => canvas.dispatchEvent(new Event("input", { bubbles: true }));

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (canvas.width === 0) groesseAnpassen();
    canvas.setPointerCapture(event.pointerId);
    aktuellerStrich = [punkt(event)];
    striche.push(aktuellerStrich);
    feld.classList.remove("fehler");
    neuZeichnen();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!aktuellerStrich) return;
    const ereignisse = event.getCoalescedEvents ? event.getCoalescedEvents() : [];
    (ereignisse.length ? ereignisse : [event]).forEach((e) => aktuellerStrich.push(punkt(e)));
    neuZeichnen();
  });

  const beenden = () => {
    if (!aktuellerStrich) return;
    aktuellerStrich = null;
    geaendert();
  };
  canvas.addEventListener("pointerup", beenden);
  canvas.addEventListener("pointercancel", beenden);

  if (loeschen) {
    loeschen.addEventListener("click", () => {
      striche.length = 0;
      neuZeichnen();
      geaendert();
    });
  }

  window.addEventListener("resize", groesseAnpassen);
  // Felder in zunächst versteckten Bereichen bekommen ihre Größe, sobald sie sichtbar werden.
  if (window.ResizeObserver) new ResizeObserver(groesseAnpassen).observe(canvas);
  groesseAnpassen();

  return {
    feld,
    striche,
    istGueltig() {
      const punkte = striche.flat();
      if (punkte.length < 8) return false;
      const xs = punkte.map((p) => p.x);
      const ys = punkte.map((p) => p.y);
      return Math.max(...xs) - Math.min(...xs) > 40 || Math.max(...ys) - Math.min(...ys) > 40;
    },
  };
}

function zeichneStriche(ctx, striche, umrechnen, linienbreite, farbe) {
  ctx.save();
  ctx.strokeStyle = farbe;
  ctx.fillStyle = farbe;
  ctx.lineWidth = linienbreite;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  striche.forEach((strich) => {
    const punkte = strich.map(umrechnen);
    if (punkte.length === 1) {
      ctx.beginPath();
      ctx.arc(punkte[0].x, punkte[0].y, linienbreite / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(punkte[0].x, punkte[0].y);
    for (let i = 1; i < punkte.length - 1; i++) {
      const mitteX = (punkte[i].x + punkte[i + 1].x) / 2;
      const mitteY = (punkte[i].y + punkte[i + 1].y) / 2;
      ctx.quadraticCurveTo(punkte[i].x, punkte[i].y, mitteX, mitteY);
    }
    const letzter = punkte[punkte.length - 1];
    ctx.lineTo(letzter.x, letzter.y);
    ctx.stroke();
  });
  ctx.restore();
}

// ---------- Formularprüfung ----------

// Prüft alle sichtbaren Pflichtfelder (required oder in zusatzPflicht) und Unterschriften.
// Gibt das erste fehlerhafte Element zurück oder null.
function formularPruefen(form, { zusatzPflicht = new Set(), signaturen = [] } = {}) {
  form.querySelectorAll(".fehler").forEach((el) => el.classList.remove("fehler"));

  let ersterFehler = null;
  const markieren = (el, gruppe) => {
    gruppe.classList.add("fehler");
    if (!ersterFehler) ersterFehler = el;
  };

  const gepruefteRadios = new Set();
  Array.from(form.elements).forEach((el) => {
    if (!el.name || el.disabled || el.closest("[hidden]")) return;
    const pflicht = el.required || zusatzPflicht.has(el.name);
    const gruppe = el.closest(".form-group, .form-group-checkbox, .auswahl-gruppe");
    if (!gruppe) return;

    if (el.type === "radio") {
      if (!pflicht || gepruefteRadios.has(el.name)) return;
      gepruefteRadios.add(el.name);
      if (!form.querySelector(`input[name="${el.name}"]:checked`)) markieren(el, gruppe);
      return;
    }
    if (el.type === "checkbox") {
      if (pflicht && !el.checked) markieren(el, gruppe);
      return;
    }
    const wert = el.value.trim();
    if ((pflicht && wert === "") || (el.type === "email" && wert !== "" && !el.checkValidity())) {
      markieren(el, gruppe);
    }
  });

  signaturen.forEach((signatur) => {
    if (signatur.feld.closest("[hidden]")) return;
    if (!signatur.istGueltig()) {
      signatur.feld.classList.add("fehler");
      if (!ersterFehler) ersterFehler = signatur.feld;
    }
  });

  return ersterFehler;
}

function formularDaten(form) {
  const daten = {};
  Array.from(form.elements).forEach((el) => {
    if (!el.name) return;
    if (el.type === "checkbox") daten[el.name] = el.checked;
    else if (el.type === "radio") {
      if (el.checked) daten[el.name] = el.value;
      else if (!(el.name in daten)) daten[el.name] = "";
    } else daten[el.name] = el.value.trim();
  });
  return daten;
}

function statusSetzen(status, text, istFehler) {
  status.textContent = text;
  status.classList.toggle("visible", Boolean(text));
  status.classList.toggle("fehler", Boolean(istFehler));
}

function zumFehlerSpringen(el) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el.focus) el.focus({ preventScroll: true });
}

// ---------- Ergebnis: PDFs teilen, speichern, senden ----------

const erzeugteUrls = [];

// dokumente: [{ titel, beschreibung, blob, dateiname, whatsapp, emailBetreff, teilenText, warnung }]
function dokumenteAnzeigen(ziel, dokumente) {
  erzeugteUrls.splice(0).forEach((url) => URL.revokeObjectURL(url));
  ziel.innerHTML = "";

  dokumente.forEach((dok) => {
    const datei = new File([dok.blob], dok.dateiname, { type: "application/pdf" });
    const url = URL.createObjectURL(dok.blob);
    erzeugteUrls.push(url);

    const karte = document.createElement("div");
    karte.className = "dokument-karte";
    karte.append(textElement("h3", dok.titel));
    if (dok.beschreibung) karte.append(textElement("p", dok.beschreibung));
    if (dok.warnung) karte.append(textElement("p", dok.warnung, "dokument-warnung"));

    const aktionen = document.createElement("div");
    aktionen.className = "vertrag-aktionen";

    if (navigator.canShare && navigator.canShare({ files: [datei] })) {
      const teilen = textElement("button", dok.whatsapp ? "📤 Senden (WhatsApp / E-Mail)" : "📤 Per E-Mail senden", "btn btn-coral");
      teilen.type = "button";
      teilen.addEventListener("click", async () => {
        try {
          await navigator.share({ files: [datei], title: dok.titel, text: dok.teilenText });
        } catch (fehler) {
          if (fehler.name !== "AbortError") {
            teilen.textContent = "Teilen nicht möglich – bitte speichern";
          }
        }
      });
      aktionen.append(teilen);
    }

    const speichern = textElement("a", "⬇️ PDF speichern", "btn btn-primary");
    speichern.href = url;
    speichern.download = dok.dateiname;
    aktionen.append(speichern);

    if (dok.whatsapp) {
      const wa = textElement("a", "WhatsApp-Chat öffnen", "btn btn-outline");
      wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(dok.teilenText)}`;
      wa.target = "_blank";
      wa.rel = "noopener";
      aktionen.append(wa);
    }
    if (dok.emailBetreff) {
      const mail = textElement("a", "E-Mail schreiben", "btn btn-outline");
      mail.href = `mailto:${KURSLEITUNG.email}?subject=${encodeURIComponent(dok.emailBetreff)}&body=${encodeURIComponent(`Hallo Nadine,\n\n${dok.teilenText}\n\n`)}`;
      aktionen.append(mail);
    }

    karte.append(aktionen);
    ziel.append(karte);
  });
}

// ---------- PDF-Layout (A4-Seiten als Canvas) ----------

const SEITE_BREITE = 1240; // logische Einheiten = A4 bei 150 dpi
const SEITE_HOEHE = 1754;
const SKALIERUNG = 1.25; // tatsächliche Auflösung ≈ 190 dpi: gut lesbar, WhatsApp-freundliche Dateigröße
const RAND_X = 105;
const INHALT_BREITE = SEITE_BREITE - 2 * RAND_X;
const FUSS_Y = SEITE_HOEHE - 95;
const SCHRIFT_TEXT = "Nunito, 'Segoe UI', Arial, sans-serif";
const SCHRIFT_TITEL = "'Baloo 2', 'Segoe UI', Arial, sans-serif";
const FARBE_TEXT = "#22323c";
const FARBE_HELL = "#5c7480";
const FARBE_BLAU = "#0b6fa8";
const FARBE_TUERKIS = "#34c9b7";
const FARBE_LINIE = "#9fb4bd";
const FARBE_TINTE = "#1d3a8a";

class PdfLayout {
  constructor(kopfzeile, fusszeile) {
    this.kopfzeile = kopfzeile;
    this.fusszeile = fusszeile;
    this.seiten = [];
    this.neueSeite();
  }

  neueSeite() {
    const canvas = document.createElement("canvas");
    canvas.width = SEITE_BREITE * SKALIERUNG;
    canvas.height = SEITE_HOEHE * SKALIERUNG;
    const ctx = canvas.getContext("2d");
    ctx.scale(SKALIERUNG, SKALIERUNG);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SEITE_BREITE, SEITE_HOEHE);
    ctx.textBaseline = "top";
    this.seiten.push(canvas);
    this.ctx = ctx;

    if (this.seiten.length === 1) {
      this.schrift(800, 46, SCHRIFT_TITEL, FARBE_BLAU);
      ctx.fillText(KURSLEITUNG.firma, RAND_X, 62);
      this.schrift(400, 19, SCHRIFT_TEXT, FARBE_HELL);
      ctx.fillText("Privater Schwimmunterricht in Mannheim, Heidelberg & Umgebung", RAND_X, 122);
      ctx.textAlign = "right";
      [KURSLEITUNG.name, `${KURSLEITUNG.strasse} · ${KURSLEITUNG.ort}`, KURSLEITUNG.telefon, KURSLEITUNG.email]
        .forEach((zeile, i) => ctx.fillText(zeile, SEITE_BREITE - RAND_X, 64 + i * 26));
      ctx.textAlign = "left";
      this.balken(180, FARBE_TUERKIS, 3);
      this.y = 212;
    } else {
      this.schrift(700, 19, SCHRIFT_TEXT, FARBE_HELL);
      ctx.fillText(`${KURSLEITUNG.firma} · ${this.kopfzeile}`, RAND_X, 58);
      this.balken(92, FARBE_TUERKIS, 2);
      this.y = 124;
    }
  }

  schrift(gewicht, groesse, familie, farbe) {
    this.ctx.font = `${gewicht} ${groesse}px ${familie}`;
    this.ctx.fillStyle = farbe;
  }

  balken(y, farbe, dicke, x = RAND_X, breite = INHALT_BREITE) {
    this.ctx.fillStyle = farbe;
    this.ctx.fillRect(x, y, breite, dicke);
  }

  platz(hoehe) {
    if (this.y + hoehe > FUSS_Y - 20) this.neueSeite();
  }

  umbrechen(text, breite) {
    const zeilen = [];
    String(text).split("\n").forEach((absatz) => {
      let zeile = "";
      absatz.split(/\s+/).filter(Boolean).forEach((wort) => {
        const test = zeile ? `${zeile} ${wort}` : wort;
        if (this.ctx.measureText(test).width <= breite) {
          zeile = test;
          return;
        }
        if (zeile) zeilen.push(zeile);
        // Überlange Wörter (z. B. E-Mail-Adressen) zeichenweise umbrechen
        zeile = "";
        for (const zeichen of wort) {
          if (this.ctx.measureText(zeile + zeichen).width > breite && zeile) {
            zeilen.push(zeile);
            zeile = "";
          }
          zeile += zeichen;
        }
      });
      zeilen.push(zeile);
    });
    return zeilen;
  }

  // Schreibt Zeilen und bricht bei Bedarf auf die nächste Seite um.
  zeilenSchreiben(zeilen, x, zeilenhoehe, stil, vorErsterZeile) {
    zeilen.forEach((zeile, i) => {
      const seiteVorher = this.seiten.length;
      this.platz(zeilenhoehe);
      if (this.seiten.length !== seiteVorher || i === 0) this.schrift(...stil);
      if (i === 0 && vorErsterZeile) {
        vorErsterZeile(this.y);
        this.schrift(...stil);
      }
      this.ctx.fillText(zeile, x, this.y);
      this.y += zeilenhoehe;
    });
  }

  titel(text, unterzeile) {
    this.schrift(800, 38, SCHRIFT_TITEL, FARBE_TEXT);
    this.ctx.fillText(text, RAND_X, this.y);
    this.y += 54;
    if (unterzeile) {
      this.schrift(400, 19, SCHRIFT_TEXT, FARBE_HELL);
      this.ctx.fillText(unterzeile, RAND_X, this.y);
      this.y += 30;
    }
    this.y += 14;
  }

  abschnitt(text) {
    this.platz(52 + 3 * 31);
    this.y += 16;
    this.schrift(700, 27, SCHRIFT_TITEL, FARBE_BLAU);
    this.ctx.fillText(text, RAND_X, this.y);
    this.y += 42;
  }

  unterabschnitt(text) {
    this.platz(36 + 3 * 29);
    this.y += 8;
    const stil = [800, 20, SCHRIFT_TEXT, FARBE_TEXT];
    this.schrift(...stil);
    this.zeilenSchreiben(this.umbrechen(text, INHALT_BREITE), RAND_X, 30, stil);
  }

  absatz(text, { groesse = 19, farbe = FARBE_TEXT, einzug = 0, nummer = "" } = {}) {
    const stil = [400, groesse, SCHRIFT_TEXT, farbe];
    const zeilenhoehe = Math.round(groesse * 1.52);
    const nummerBreite = nummer ? 40 : 0;
    this.schrift(...stil);
    // Zeilen mit "– " sind Aufzählungspunkte und bekommen einen hängenden Einzug.
    String(text).split("\n").forEach((teil, t) => {
      const istPunkt = teil.startsWith("– ");
      const x = RAND_X + einzug + nummerBreite + (istPunkt ? 26 : 0);
      const zeilen = this.umbrechen(istPunkt ? teil.slice(2) : teil, SEITE_BREITE - RAND_X - x);
      this.zeilenSchreiben(zeilen, x, zeilenhoehe, stil, (y) => {
        if (nummer && t === 0) this.ctx.fillText(nummer, RAND_X + einzug, y);
        if (istPunkt) this.ctx.fillText("–", x - 22, y);
      });
    });
    this.y += 6;
  }

  paragraf({ titel, absaetze }) {
    this.unterabschnitt(titel);
    absaetze.forEach((text, i) => {
      this.absatz(text, { nummer: absaetze.length > 1 ? `(${i + 1})` : "" });
    });
  }

  // wert === null → leere Ausfüllzeile(n) für die Papier-Vorlage
  feld(label, wert, { zeilen = 1, labelBreite = 315 } = {}) {
    const stil = [400, 20, SCHRIFT_TEXT, FARBE_TEXT];
    const beschriftung = (y) => {
      this.schrift(700, 20, SCHRIFT_TEXT, FARBE_HELL);
      this.ctx.fillText(label, RAND_X, y);
    };
    if (wert === null) {
      this.platz(zeilen * 40);
      beschriftung(this.y + 6);
      for (let i = 0; i < zeilen; i++) {
        this.balken(this.y + 32, FARBE_LINIE, 1.5, RAND_X + labelBreite, INHALT_BREITE - labelBreite);
        this.y += 40;
      }
      this.y += 4;
      return;
    }
    this.schrift(...stil);
    const umbruch = this.umbrechen(wert || "–", INHALT_BREITE - labelBreite);
    this.platz(Math.min(umbruch.length, 3) * 30);
    this.zeilenSchreiben(umbruch, RAND_X + labelBreite, 30, stil, beschriftung);
    this.y += 6;
  }

  kaestchen(x, y, angekreuzt) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = FARBE_BLAU;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 4, 22, 22);
    if (angekreuzt) {
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x + 7, y + 15);
      ctx.lineTo(x + 12, y + 21);
      ctx.lineTo(x + 21, y + 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  ankreuzen(angekreuzt, text, { einzug = 0, fett = false } = {}) {
    const x = RAND_X + einzug;
    const stil = [fett ? 700 : 400, 19, SCHRIFT_TEXT, FARBE_TEXT];
    this.schrift(...stil);
    const zeilen = this.umbrechen(text, SEITE_BREITE - RAND_X - x - 40);
    this.platz(Math.min(zeilen.length, 2) * 29);
    this.zeilenSchreiben(zeilen, x + 40, 29, stil, (y) => this.kaestchen(x, y, angekreuzt));
    this.y += 7;
  }

  // felder: [{ titel, name, ortDatum, striche }] – zwei Spalten; striche/ortDatum null = leer
  unterschriften(felder) {
    const spaltenAbstand = 60;
    const breite = (INHALT_BREITE - spaltenAbstand) / 2;
    const hoehe = 150;
    for (let i = 0; i < felder.length; i += 2) {
      this.platz(hoehe + 130);
      const startY = this.y;
      felder.slice(i, i + 2).forEach((feld, spalte) => {
        const x = RAND_X + spalte * (breite + spaltenAbstand);
        this.schrift(700, 18, SCHRIFT_TEXT, FARBE_HELL);
        this.ctx.fillText("Ort, Datum", x, startY);
        if (feld.ortDatum) {
          this.schrift(400, 20, SCHRIFT_TEXT, FARBE_TEXT);
          this.ctx.fillText(feld.ortDatum, x + 110, startY - 1);
        } else {
          this.balken(startY + 22, FARBE_LINIE, 1.5, x + 110, breite - 110);
        }
        const boxY = startY + 34;
        if (feld.striche && feld.striche.length) {
          this.signaturZeichnen(feld.striche, x, boxY, breite, hoehe);
        }
        this.balken(boxY + hoehe + 4, FARBE_TEXT, 2, x, breite);
        this.schrift(700, 18, SCHRIFT_TEXT, FARBE_HELL);
        this.ctx.fillText(feld.titel, x, boxY + hoehe + 14);
        this.schrift(400, 18, SCHRIFT_TEXT, FARBE_HELL);
        if (feld.name) this.ctx.fillText(feld.name, x, boxY + hoehe + 38);
      });
      this.y = startY + 34 + hoehe + 76;
    }
  }

  signaturZeichnen(striche, boxX, boxY, boxB, boxH) {
    const punkte = striche.flat();
    const minX = Math.min(...punkte.map((p) => p.x));
    const maxX = Math.max(...punkte.map((p) => p.x));
    const minY = Math.min(...punkte.map((p) => p.y));
    const maxY = Math.max(...punkte.map((p) => p.y));
    const faktor = Math.min((boxB - 20) / Math.max(maxX - minX, 1), (boxH - 16) / Math.max(maxY - minY, 1), 2.5);
    const versatzX = boxX + (boxB - (maxX - minX) * faktor) / 2;
    const versatzY = boxY + (boxH - (maxY - minY) * faktor) / 2;
    zeichneStriche(
      this.ctx,
      striche,
      (p) => ({ x: versatzX + (p.x - minX) * faktor, y: versatzY + (p.y - minY) * faktor }),
      Math.max(2.5, Math.min(2.6 * faktor, 5.5)),
      FARBE_TINTE
    );
  }

  fusszeilenSetzen() {
    const gesamt = this.seiten.length;
    this.seiten.forEach((canvas, i) => {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#d9f0f5";
      ctx.fillRect(RAND_X, FUSS_Y, INHALT_BREITE, 2);
      ctx.font = `400 17px ${SCHRIFT_TEXT}`;
      ctx.fillStyle = FARBE_HELL;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillText(this.fusszeile, RAND_X, FUSS_Y + 16);
      ctx.textAlign = "right";
      ctx.fillText(`Seite ${i + 1} von ${gesamt}`, SEITE_BREITE - RAND_X, FUSS_Y + 16);
      ctx.textAlign = "left";
    });
  }

  async alsPdf(titel) {
    this.fusszeilenSetzen();
    const bilder = await Promise.all(this.seiten.map(canvasAlsJpeg));
    return pdfAusBildern(bilder, titel, new Date());
  }
}

async function schriftenLaden() {
  if (!document.fonts || !document.fonts.load) return;
  try {
    await Promise.all([
      document.fonts.load(`400 20px Nunito`),
      document.fonts.load(`700 20px Nunito`),
      document.fonts.load(`800 20px Nunito`),
      document.fonts.load(`700 27px "Baloo 2"`),
      document.fonts.load(`800 38px "Baloo 2"`),
    ]);
  } catch (fehler) {
    // Ohne Webfonts wird mit Systemschrift gezeichnet – das PDF funktioniert trotzdem.
  }
}

function canvasAlsJpeg(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error("JPEG konnte nicht erzeugt werden"));
      resolve({ bytes: new Uint8Array(await blob.arrayBuffer()), breite: canvas.width, hoehe: canvas.height });
    }, "image/jpeg", 0.8);
  });
}

// ---------- Minimaler PDF-Schreiber: eine JPEG-Seite pro A4-Blatt ----------

function pdfText(text) {
  // PDF-Textstring als UTF-16BE-Hexwert (für Umlaute in Titel/Metadaten)
  let hex = "FEFF";
  for (const zeichen of text) {
    const code = zeichen.codePointAt(0);
    if (code > 0xffff) continue;
    hex += code.toString(16).toUpperCase().padStart(4, "0");
  }
  return `<${hex}>`;
}

function pdfDatum(d) {
  const z = (n) => String(n).padStart(2, "0");
  const offset = -d.getTimezoneOffset();
  const vorzeichen = offset >= 0 ? "+" : "-";
  const absolut = Math.abs(offset);
  return `D:${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}${vorzeichen}${z(Math.floor(absolut / 60))}'${z(absolut % 60)}'`;
}

function pdfAusBildern(bilder, titel, zeitpunkt) {
  const encoder = new TextEncoder();
  const teile = [];
  const offsets = [];
  let laenge = 0;

  const schreiben = (inhalt) => {
    const bytes = typeof inhalt === "string" ? encoder.encode(inhalt) : inhalt;
    teile.push(bytes);
    laenge += bytes.length;
  };
  const objekt = (nummer, inhalt) => {
    offsets[nummer] = laenge;
    schreiben(`${nummer} 0 obj\n${inhalt}\nendobj\n`);
  };

  // Objekte: 1 Katalog, 2 Seitenbaum, 3 Info, danach je Seite: Seite, Inhalt, Bild
  const seitenNummer = (i) => 4 + i * 3;
  const A4_BREITE_PT = 595.28;
  const A4_HOEHE_PT = 841.89;

  schreiben("%PDF-1.4\n%âãÏÓ\n");
  objekt(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objekt(2, `<< /Type /Pages /Kids [${bilder.map((_, i) => `${seitenNummer(i)} 0 R`).join(" ")}] /Count ${bilder.length} >>`);
  objekt(3, `<< /Title ${pdfText(titel)} /Author ${pdfText(`${KURSLEITUNG.name}, ${KURSLEITUNG.firma}`)} /Creator (aquakids-rn.de) /CreationDate (${pdfDatum(zeitpunkt)}) >>`);

  bilder.forEach((bild, i) => {
    const seite = seitenNummer(i);
    const inhalt = `q ${A4_BREITE_PT} 0 0 ${A4_HOEHE_PT} 0 0 cm /Im0 Do Q`;
    objekt(seite, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_BREITE_PT} ${A4_HOEHE_PT}] /Resources << /XObject << /Im0 ${seite + 2} 0 R >> >> /Contents ${seite + 1} 0 R >>`);
    objekt(seite + 1, `<< /Length ${inhalt.length} >>\nstream\n${inhalt}\nendstream`);
    offsets[seite + 2] = laenge;
    schreiben(`${seite + 2} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${bild.breite} /Height ${bild.hoehe} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bild.bytes.length} >>\nstream\n`);
    schreiben(bild.bytes);
    schreiben("\nendstream\nendobj\n");
  });

  const anzahl = 4 + bilder.length * 3;
  const xrefStart = laenge;
  let xref = `xref\n0 ${anzahl}\n0000000000 65535 f \n`;
  for (let i = 1; i < anzahl; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  schreiben(xref);
  schreiben(`trailer\n<< /Size ${anzahl} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

  return new Blob(teile, { type: "application/pdf" });
}
