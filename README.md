# AquaKids-rn.de

Statische Website für privaten Schwimmunterricht (Kleingewerbe) in Mannheim & Heidelberg.
Kein Build-Schritt nötig, reines HTML/CSS/JS. Live unter https://aquakids-rn.de.

## Struktur

- `index.html`: Startseite (Hero, Über mich, Ablauf, Preise, Kurse, Ziele, FAQ, Kontakt, Abzeichen)
- `impressum.html`, `datenschutz.html`, `agb.html`: rechtliche Seiten (inkl. Widerrufsbelehrung in den AGB)
- `404.html`: eigene Fehlerseite
- `css/style.css`, `js/main.js`: Design und Interaktivität (Menü, WhatsApp-Formulare, Preiskarten)
- `js/preise-data.js`: **zentrale Preisliste**. Preise nur hier ändern; Preiskarten,
  Formular-Optionen und WhatsApp-Anfragetexte werden automatisch daraus erzeugt
- `js/pools-data.js`: **Kursorte** (Wochenplan). Orte und Wochentage nur hier ändern; Kapitel "Kursorte" und die
  Auswahl "Wunschort" im Formular werden automatisch daraus erzeugt
- `fonts/`: Schriftarten lokal gehostet (kein Abruf bei Google, wichtig für den Datenschutz)
- `img/`: Fotos (vor dem Einfügen auf passende Größe verkleinern, ca. 600–800 px Breite reichen)
- `_headers`, `_redirects`: Sicherheits-Header und Weiterleitungen für Netlify
- `img/logo.png` (Logo komplett), `img/logo-mark.png` (nur Schwimmer-Symbol, Kopfzeile), `favicon.png`, `apple-touch-icon.png`: Logo und Browser-Icons
- `robots.txt`, `sitemap.xml`: Suchmaschinen-Angaben (Domain: aquakids-rn.de)

## Wie die Formulare funktionieren

Es gibt keinen Server/Backend. Beim Absenden baut `js/main.js` aus den Formularfeldern eine
vorausgefüllte WhatsApp-Nachricht und öffnet `https://wa.me/<Nummer>?text=...`. Die Anfrage geht
erst bei dir ein, wenn die Person die Nachricht in WhatsApp tatsächlich abschickt.

Die WhatsApp-Nummer ist zentral in `js/main.js` (`WHATSAPP_NUMBER`) hinterlegt und wird außerdem
in den HTML-Dateien in den WhatsApp-Links verwendet. Bei einer Nummernänderung überall austauschen.

## Veröffentlichen

Ein Push auf den Branch `main` (GitHub: `d1n1girl/aquakids-website`) wird von Netlify
automatisch auf https://aquakids-rn.de veröffentlicht. Die Domain liegt bei STRATO (DNS zeigt auf Netlify).

Wenn sich `css/style.css` oder `js/main.js` ändern, in den HTML-Dateien die Versionsnummer
(`?v=…`) hochzählen, damit Browser nicht die alte Datei zeigen.

## Lokal testen

Im Projektordner `python -m http.server 8000` starten und `http://localhost:8000` öffnen.
