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

  // Empfehlungsprämie als Rabatt in Euro, nicht als geschenkte Einheit: Eine
  // freie Stunde kostet bei vollem Kalender einen Termin, ein Rabatt nur Geld.
  // Ausgezahlt wird erst, wenn die geworbene Familie eine Zehnerkarte bucht,
  // damit die Prämie nicht schon bei der Kennenlernstunde anfällt.
  // ACHTUNG: Diese drei Beträge stehen auch in AGB Ziffer 6. Wer sie hier
  // ändert, muss die AGB mit ändern, sonst widersprechen sich beide Texte.
  empfehlung: {
    aktiv: true,
    rabattWerbend: 30, // Euro für die erste Empfehlung
    rabattWerbendWeitere: 15, // Euro für jede weitere Empfehlung
    rabattGeworben: 20, // Euro für die neu geworbene Familie, immer gleich
  },

  // Geschenkgutschein über einen frei wählbaren Betrag.
  gutschein: {
    aktiv: true,
    mindestbetrag: 40,
  },
};

// Intensivkurse in den Ferien. Die Reihenfolge hier ist die Reihenfolge auf der
// Seite und im Reservierungsformular. Eine Ferienzeit streichen heißt: Eintrag
// löschen, dann verschwindet sie überall. Eine neue dazu: Eintrag ergänzen.
//
// name:     Titel, erscheint auf der Karte und als Auswahl im Formular
// rhythmus: wie oft und wie lange, z. B. "2 Termine pro Woche à 30 Minuten"
// preis:    Euro je Einheit; null bedeutet "Preis nach Absprache"
// ort:      optional; fehlt er, steht kein Ort auf der Karte
// zusatz:   optional, eine weitere Zeile auf der Karte
// zusehen:  true, wenn Eltern zuschauen können
const FERIENKURSE = [
  {
    name: "Osterferien",
    rhythmus: "2 Termine pro Woche à 30 Minuten",
    preis: 40,
    zusehen: true,
  },
  {
    name: "Pfingstferien",
    rhythmus: "2 Termine pro Woche à 30 Minuten",
    preis: 40,
    zusehen: true,
  },
  {
    name: "Sommerferien",
    rhythmus: "2 bis 3 Schwimmstunden pro Woche",
    preis: null,
    ort: "Seckenheim",
    zusatz: "Privatpool, ohne Badeintritt",
  },
];
