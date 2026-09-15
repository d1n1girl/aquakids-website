// Zentrale Preisliste: Preise NUR hier ändern.
// Die Preiskarten unter "Preise", die Paket-Auswahl im Kontaktformular und die
// WhatsApp-Anfrage-Buttons werden beim Laden der Seite automatisch daraus erzeugt.
// Beträge in Euro; Nachkommastellen mit Punkt schreiben (62.5 = 62,50 €).
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
    dauerMinuten: 50,
    preisProKind: 62.5,
    zehnerkarteProKind: 575,
    zehnerkarteErsparnisProKind: 50,
    kinder: 2, // Gesamtbeträge (125 € / 1.150 €) werden daraus automatisch berechnet
  },
};
