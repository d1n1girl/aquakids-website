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
    dauerBisMinuten: 50, // ergibt die Anzeige "45–50 Minuten"; weglassen für feste Dauer
    preisProKind: 60,
    zehnerkarteProKind: 550,
    zehnerkarteErsparnisProKind: 50,
    kinder: 2, // Gesamtbeträge (120 € / 1.100 €) werden daraus automatisch berechnet
  },
};
