# AquaKids-rn.de

Statische Website für privaten Schwimmunterricht (Kleingewerbe) in Mannheim & Heidelberg.
Kein Build-Schritt nötig – reines HTML/CSS/JS.

## Struktur

- `index.html` – Startseite (Hero, Über mich, Angebot, Preise, Ablauf, Kontakt/Terminanfrage)
- `impressum.html`, `datenschutz.html` – rechtliche Pflichtseiten (**mit Platzhaltern, unbedingt ausfüllen!**)
- `css/style.css`, `js/main.js` – Design und Interaktivität (mobiles Menü, WhatsApp-Formular)
- `js/preise-data.js` – **zentrale Preisliste**: Preise nur hier ändern; Preiskarten,
  Formular-Optionen und WhatsApp-Anfragetexte werden automatisch daraus erzeugt
- `img/` – hier kommen deine eigenen Fotos rein (siehe `img/LIESMICH.txt`)

## Wie das Terminformular funktioniert

Es gibt keinen Server/Backend. Beim Absenden baut `js/main.js` aus den Formularfeldern eine
vorausgefüllte WhatsApp-Nachricht und öffnet `https://wa.me/<Nummer>?text=...`. Die Anfrage geht
erst bei dir ein, wenn die Person die Nachricht in WhatsApp tatsächlich abschickt.

Die WhatsApp-Nummer ist zentral in `js/main.js` (`WHATSAPP_NUMBER`) hinterlegt und wird außerdem
in `index.html`, `impressum.html` und `datenschutz.html` in den WhatsApp-Links verwendet – bei
einer Nummernänderung an allen Stellen austauschen.

## Bevor die Seite live geht

1. **Eigene Fotos einfügen** – siehe `img/LIESMICH.txt`. Die gestrichelten Platzhalter-Kästen in
   `index.html` durch `<img src="img/....jpg" alt="...">` ersetzen.
2. **Impressum & Datenschutz ausfüllen.** Alle `[Platzhalter]` durch echte Daten ersetzen
   (Name, Adresse, Kontakt, Gewerbe-/USt-Angaben). Im Zweifel eRecht24 oder eine Anwältin/einen
   Anwalt für IT-Recht konsultieren.
3. **Über-mich-Text** in `index.html` ergänzen (aktuell Platzhalter in eckigen Klammern).
4. **Preise/Details prüfen** – Festpreise stehen zentral in `js/preise-data.js`
   (Kennenlernstunde, Privatunterricht, Duo inkl. Zehnerkarten). Erwachsenen- und
   Babypreise sind weiterhin "auf Anfrage".
5. **WhatsApp Business App einrichten** (empfohlen, aber optional) – Firmenprofil,
   automatische Begrüßungsnachricht, Labels für Anfragen.
6. **Domain + Hosting.** Für den Start reicht kostenloses Hosting, z. B.:
   - [Netlify](https://www.netlify.com/) oder [Vercel](https://vercel.com/) – Ordner hochladen, fertig.
   - [GitHub Pages](https://pages.github.com/) – kostenlos, braucht ein GitHub-Repo.
7. **Lokal testen:** Ordner mit einem einfachen Server öffnen, z. B.
   `python -m http.server 8000` im Projektordner, dann `http://localhost:8000` im Browser öffnen.
