// Zentrale Preisliste: Preise NUR hier ändern.
// Die Preiskarten unter "Preise", die Paket-Auswahl im Kontaktformular und die
// WhatsApp-Anfrage-Buttons werden beim Laden der Seite automatisch daraus erzeugt.
// Beträge in Euro; Nachkommastellen mit Punkt schreiben (z. B. 62.5 wird zu "62,50 €").
const PREISE = {
  kennenlern: {
    name: "Kennenlernstunde",
    dauerMinuten: 30,
    preis: 40,
  },
  privat: {
    name: "Privatunterricht",
    dauerMinuten: 45,
    preis: 85,
    zehnerkarte: 800,
    zehnerkarteErsparnis: 50,
  },
  duo: {
    name: "Duo-Unterricht",
    dauerMinuten: 45,
    // Optional moeglich: dauerBisMinuten: 50 ergaebe die Anzeige "45 bis 50 Minuten".
    preisProKind: 60,
    zehnerkarteProKind: 550,
    zehnerkarteErsparnisProKind: 50,
    kinder: 2, // Gesamtbeträge (120 € / 1.100 €) werden daraus automatisch berechnet
  },
};

// Aktionen rund um die Preise. Jede lässt sich mit aktiv: false abschalten.
// Sie verschwindet dann von der Seite, ohne dass am HTML etwas zu ändern ist.
const AKTIONEN = {
  // Hinweis auf der Duo-Karte: Ich suche ein passendes Partnerkind.
  // Duo bringt pro Zeitstunde deutlich mehr als Privatunterricht, deshalb
  // lohnt es sich, Eltern ohne Partnerkind aktiv abzuholen.
  duoVermittlung: {
    aktiv: true,
  },

  // Empfehlungsprämie: Beide Familien bekommen eine Einheit geschenkt,
  // sobald die geworbene Familie eine Zehnerkarte bucht. Die Kopplung an die
  // Zehnerkarte sorgt dafür, dass die Prämie erst bei einem echten Abschluss
  // anfällt und nicht schon bei der Kennenlernstunde.
  empfehlung: {
    aktiv: true,
  },

  // Geschenkgutschein über einen frei wählbaren Betrag.
  gutschein: {
    aktiv: true,
    mindestbetrag: 40,
  },
};
