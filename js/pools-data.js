// Kursorte: Wochenplan. Die Reihenfolge hier ist die Reihenfolge auf der Seite (Kapitel
// "Kursorte") und im Anfrageformular (Feld "Wunschort").
//
// tag:     Wochentag (oder z. B. "Sommerferien")
// ort:     Ort bzw. Stadtteil
// zusatz:  optional, z. B. die Stadt
// Optional je Eintrag (erscheint dann auf der Karte):
// mapsUrl:         Link zum Bad in Google Maps (in Google Maps auf "Teilen" klicken, Link kopieren)
// oeffnungszeiten: z. B. "Mo-Fr 6-21 Uhr, Sa-So 8-20 Uhr"
// eintritt:        z. B. "5,50 €"
const KURSORTE = [
  { tag: "Dienstag", ort: "Neckarau", zusatz: "Mannheim" },
  { tag: "Mittwoch", ort: "Eppelheim" },
  { tag: "Donnerstag", ort: "Heddesheim" },
  { tag: "Freitag", ort: "Weinheim" },
  { tag: "Samstag", ort: "Rohrbach", zusatz: "Heidelberg" },
  { tag: "Sommerferien", ort: "Seckenheim", zusatz: "Intensivkurs, ohne Badeintritt" },
];
