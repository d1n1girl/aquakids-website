// AquaKids Rhein-Neckar: Digitaler Schwimmunterrichtsvertrag (vertrag.html)
// Vertragstexte stehen hier zentral und werden sowohl auf der Seite als auch im PDF verwendet.
// Preise kommen aus js/preise-data.js, Kontaktdaten/IBAN aus js/vertrag-werkzeuge.js.

// ---------- Angebote ----------

function angebotsListe() {
  const { kennenlern, privat, duo } = PREISE;
  return [
    {
      id: "kennenlern",
      name: kennenlern.name,
      details: `${kennenlern.dauerMinuten} Minuten · ${euro(kennenlern.preis)} · einmalig pro Kind`,
    },
    {
      id: "privat",
      name: privat.name,
      details: `${privat.dauerMinuten} Minuten (bei guter Konzentration bis 50 Minuten ohne Aufpreis) · ${euro(privat.preis)} je Einheit`,
    },
    {
      id: "privat-zehner",
      name: `Zehnerkarte ${privat.name}`,
      details: `10 Einheiten à ${privat.dauerMinuten} Minuten · ${euro(privat.zehnerkarte)}`,
    },
    {
      id: "duo",
      name: duo.name,
      details: `${dauerText(duo)} · ${euro(duo.preisProKind)} je Kind und Einheit`,
      duo: true,
    },
    {
      id: "duo-zehner",
      name: "Zehnerkarte Duo",
      details: `10 Einheiten à ${dauerText(duo)} · ${euro(duo.zehnerkarteProKind)} je Kind`,
      duo: true,
    },
    {
      id: "intensiv",
      name: "Intensivkurs",
      details: "Umfang, Termine und Preis nach individueller Absprache",
      intensiv: true,
    },
  ];
}

const GESUNDHEIT_FRAGEN = [
  { id: "epilepsie", frage: "Epilepsie oder Krampfanfälle" },
  { id: "herz", frage: "Herzerkrankung" },
  { id: "atemwege", frage: "Atemwegserkrankung oder Asthma" },
  { id: "ohren", frage: "Paukenröhrchen oder Ohrenerkrankung" },
  { id: "haut", frage: "Hauterkrankung (z. B. Neurodermitis)" },
  { id: "sehen_hoeren", frage: "Seh- oder Höreinschränkung" },
  { id: "allergien", frage: "Allergien" },
  { id: "medikamente", frage: "Regelmäßige Medikamente oder Notfallmedikament" },
  { id: "sonstiges", frage: "Sonstiges, das ich wissen sollte" },
];

// ---------- Vertragstexte ----------

function bankverbindungText() {
  return KURSLEITUNG.iban
    ? `auf das Konto von ${KURSLEITUNG.kontoinhaberin}, IBAN ${KURSLEITUNG.iban}`
    : "auf das in der Rechnung genannte Konto";
}

function vertragsParagrafen() {
  const { privat, duo } = PREISE;
  const beispielErstattung = privat.zehnerkarte - 4 * privat.preis;
  return [
    {
      titel: "§ 1 Vertragsgegenstand",
      absaetze: [
        `Die Kursleitung (${KURSLEITUNG.name}, ${KURSLEITUNG.firma}) erteilt dem angemeldeten Kind privaten Schwimmunterricht im gebuchten Umfang. Vertragspartner der Kursleitung ist die unterschreibende erziehungsberechtigte Person („Eltern“), nicht das Kind.`,
        "Geschuldet ist ein sorgfältiger und altersgerechter Unterricht, nicht ein bestimmter Lernerfolg wie das Bestehen eines Schwimmabzeichens.",
        "Bei Kindern mit geistiger oder körperlicher Behinderung können Fortschrittseinschätzungen (z. B. zur Zahl der benötigten Einheiten) entfallen. Auch eine Zehnerkarte kann dann genutzt werden, wenn das Kind am Ende noch nicht schwimmen kann.",
        "Je nach Kind und Tagesform kann innerhalb einer Einheit eine Pause von etwa 5 Minuten liegen. Zur Leistung gehören außerdem Absprachen mit den Eltern, Planung, Terminfindung und Rückmeldung zum Lernstand.",
        "Unterrichtet wird in öffentlichen Bädern in Mannheim, Heidelberg und Umgebung oder nach Absprache in einem privaten Pool. Es gilt die Haus- und Badeordnung des jeweiligen Bades.",
      ],
    },
    {
      titel: "§ 2 Angebote und Preise",
      absaetze: [
        `Es gelten folgende Festpreise:\n${angebotsListe().map((a) => `– ${a.name}: ${a.details}`).join("\n")}`,
        "Es fallen keine Fahrtkosten und keine Zuschläge an. Der Eintritt ins Schwimmbad für das Kind ist nicht im Preis enthalten und wird vor Ort bezahlt. Beim Intensivkurs in Seckenheim fällt kein Badeintritt an.",
        "Die Kursleitung ist Kleinunternehmerin nach § 19 UStG; es wird keine Umsatzsteuer berechnet.",
        "Preisänderungen gelten nur für künftige Buchungen und werden mindestens vier Wochen vorher in Textform angekündigt. Bereits gebuchte Leistungen bleiben unberührt.",
      ],
    },
    {
      titel: "§ 3 Zahlung und Zehnerkarten",
      absaetze: [
        `Die Zahlung erfolgt per Überweisung ${bankverbindungText()}.`,
        "Kennenlernstunde und Einzelstunden sind innerhalb von vierzehn Tagen nach der Stunde zu zahlen. Zehnerkarten und Intensivkurse sind vollständig vor der ersten Einheit zu zahlen.",
        "Zehnerkarten sind sechs Monate ab Kaufdatum gültig. Bei einem wichtigen Grund (z. B. längere Erkrankung oder Verletzung des Kindes) verlängert die Kursleitung die Gültigkeit auf Anfrage angemessen.",
        `Endet eine Zehnerkarte vorzeitig – durch Beendigung nach § 9 oder durch Ablauf der Gültigkeit –, werden die genommenen Einheiten zum Einzelpreis abgerechnet (Privatunterricht ${euro(privat.preis)}, Duo ${euro(duo.preisProKind)} je Kind), und das Restguthaben wird erstattet. Der Rabatt der Zehnerkarte entfällt dann, weil er an die Abnahme von zehn Einheiten geknüpft ist. Beispiel: Nach 4 Einheiten Privatunterricht werden 4 × ${euro(privat.preis)} = ${euro(4 * privat.preis)} berechnet; von ${euro(privat.zehnerkarte)} werden ${euro(beispielErstattung)} erstattet. Ein ersatzloser Verfall bezahlter Einheiten findet nicht statt.`,
      ],
    },
    {
      titel: "§ 4 Termine, Absagen und Ausfall",
      absaetze: [
        "Bad, Wochentag und Uhrzeit werden individuell vereinbart.",
        "Eine Stunde kann bis 24 Stunden vor Beginn kostenfrei per WhatsApp, Telefon oder E-Mail abgesagt werden; ein Ersatztermin wird gemeinsam vereinbart.",
        "Bei späterer Absage oder Nichterscheinen wird die Stunde berechnet bzw. von der Zehnerkarte abgebucht. Das gilt nicht, wenn das Kind akut erkrankt ist und dies auf Nachfrage nachgewiesen wird (z. B. durch eine ärztliche Bescheinigung).",
        "Sagt die Kursleitung eine Stunde ab, wird ein Ersatztermin angeboten oder die Stunde gutgeschrieben bzw. erstattet.",
        "Ist das Bad geschlossen, überfüllt oder aus anderen Gründen nicht nutzbar (z. B. Wasserschaden, technische Störung), wird ein Ersatztermin vereinbart; die Stunde wird nicht berechnet.",
        "Kommt das Kind zu spät, verlängert sich die Stunde nicht.",
      ],
    },
    {
      titel: "§ 5 Duo-Unterricht",
      absaetze: [
        "Duo-Unterricht setzt ein ähnliches Können beider Kinder voraus, mindestens Wassergewöhnung bzw. die Seepferdchen-Vorstufe. Der erste Kontakt von Nichtschwimmern mit dem Wasser findet im Privatunterricht statt.",
        "Jede Familie schließt einen eigenen Vertrag über ihr Kind. Die Eltern schulden nur den Anteil für ihr eigenes Kind und haften nicht für den Anteil der anderen Familie.",
        `Fehlt das Partnerkind kurzfristig, gilt die bei der Buchung angekreuzte Regelung: Die Stunde findet als Privatunterricht (${privat.dauerMinuten} Minuten, ${euro(privat.preis)}) statt, oder sie wird auf einen gemeinsamen Ersatztermin verschoben.`,
        "Fällt das Partnerkind dauerhaft aus, entscheiden die Eltern, ob der Unterricht auf Privatunterricht umgestellt oder gemeinsam ein neues Partnerkind gesucht wird. Ein bestehendes Guthaben wird angerechnet oder nach § 3 Abs. 4 abgerechnet.",
      ],
    },
    {
      titel: "§ 6 Gesundheit",
      absaetze: [
        "Die Eltern geben vor der ersten Stunde die Gesundheitserklärung (eigenes Dokument) vollständig und wahrheitsgemäß ab. Änderungen teilen sie unverzüglich mit, spätestens vor der nächsten Stunde.",
        "Das Kind nimmt nicht teil bei ansteckenden Erkrankungen, Fieber oder offenen Wunden sowie bis 48 Stunden nach dem letzten Durchfall oder Erbrechen. § 4 Abs. 3 Satz 2 gilt entsprechend.",
        "Im Notfall darf die Kursleitung Erste Hilfe leisten und ärztliche oder rettungsdienstliche Hilfe holen; die Eltern willigen hierin ein. Die Eltern bzw. der Notfallkontakt werden umgehend informiert.",
      ],
    },
    {
      titel: "§ 7 Aufsicht, Übergabe und Abholung",
      absaetze: [
        "Die Aufsichtspflicht geht mit der persönlichen Übergabe des Kindes am vereinbarten Treffpunkt für die Dauer der Stunde im Wasser auf die Kursleitung über. Sie endet mit der persönlichen Übergabe an die Eltern oder eine abholberechtigte Person nach der Stunde.",
        "Vor und nach der Stunde – insbesondere in Umkleide, Dusche, Wartebereich und auf dem Weg zum und vom Becken – liegt die Aufsichtspflicht bei den Eltern bzw. der übergebenden oder abholenden Person.",
        "Während der Stunde bleibt eine volljährige Person im Bad anwesend und ist erreichbar.",
        "Das Kind wird nur an die Eltern oder die im Vertrag genannten volljährigen Personen übergeben.",
        "Die Kursleitung darf eine Stunde abbrechen, wenn das Kind sich oder andere trotz Hinweis gefährdet oder gesundheitliche Anzeichen gegen eine Fortsetzung sprechen. Bei einem Abbruch aus gesundheitlichen Gründen wird die Stunde nicht berechnet.",
      ],
    },
    {
      titel: "§ 8 Haftung",
      absaetze: [
        "Die Kursleitung haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, auch bei einfacher Fahrlässigkeit.",
        "Für sonstige Schäden haftet die Kursleitung unbeschränkt bei Vorsatz und grober Fahrlässigkeit.",
        "Bei einfacher Fahrlässigkeit haftet die Kursleitung für sonstige Schäden nur, wenn sie eine wesentliche Vertragspflicht verletzt – also eine Pflicht, deren Erfüllung die ordnungsgemäße Durchführung des Unterrichts erst ermöglicht und auf deren Einhaltung die Eltern vertrauen dürfen. Die Haftung ist dann auf den vertragstypischen, vorhersehbaren Schaden begrenzt.",
        "Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.",
        "Für mitgebrachte Wertsachen wird – vorbehaltlich der Absätze 1 bis 4 – keine Haftung übernommen.",
      ],
    },
    {
      titel: "§ 9 Laufzeit, Beendigung und Widerruf",
      absaetze: [
        "Kennenlernstunde und Einzelstunden enden mit ihrer Durchführung. Eine Zehnerkarte endet, wenn alle Einheiten genommen sind oder die Gültigkeit abgelaufen ist; ein Intensivkurs mit der letzten vereinbarten Einheit.",
        "Die Eltern können eine Zehnerkarte oder einen Intensivkurs jederzeit in Textform (z. B. E-Mail oder WhatsApp) beenden. Zehnerkarten werden nach § 3 Abs. 4 abgerechnet; beim Intensivkurs werden die genommenen Einheiten anteilig berechnet und der Rest erstattet.",
        "Beendet die Kursleitung den Vertrag, ohne dass die Eltern hierfür einen Grund gesetzt haben, werden nicht genommene Einheiten anteilig zum gezahlten Preis erstattet.",
        "Das Recht beider Seiten zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.",
        "Die Eltern haben ein gesetzliches Widerrufsrecht von 14 Tagen ab Vertragsschluss. Einzelheiten stehen in der Widerrufsbelehrung (Anlage 1); für den Widerruf kann das Muster-Widerrufsformular (Anlage 2) verwendet werden.",
      ],
    },
    {
      titel: "§ 10 Datenschutz (Informationen nach Art. 13 DSGVO)",
      absaetze: [
        `Verantwortlich ist ${KURSLEITUNG.name}, ${KURSLEITUNG.strasse}, ${KURSLEITUNG.ort}, E-Mail: ${KURSLEITUNG.email}, Telefon: ${KURSLEITUNG.telefon}.`,
        "Die Angaben in diesem Vertrag (Kontaktdaten, Angaben zum Kind, Buchung, Notfallkontakt, Zahlungen) werden zur Durchführung und Abrechnung des Vertrags verarbeitet (Art. 6 Abs. 1 lit. b DSGVO) sowie zur Erfüllung gesetzlicher Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO). Ohne diese Angaben kann der Vertrag nicht geschlossen werden.",
        "Gesundheitsangaben des Kindes sind besonders geschützte Daten (Art. 9 DSGVO). Sie werden nur auf Grundlage der ausdrücklichen Einwilligung in der gesonderten Gesundheitserklärung verarbeitet (Art. 9 Abs. 2 lit. a DSGVO) und sollen nicht per WhatsApp übermittelt werden. Im Notfall dürfen sie an Rettungskräfte oder Ärzte weitergegeben werden (Art. 9 Abs. 2 lit. c DSGVO).",
        "Eine Weitergabe an sonstige Dritte findet nicht statt. Wählen die Eltern WhatsApp (WhatsApp Ireland Ltd.) oder E-Mail (Google Gmail) für die Kommunikation, werden Daten über diese Dienste übertragen; dabei ist eine Verarbeitung außerhalb der EU möglich.",
        "Speicherdauer: Rechnungen und Buchungsbelege acht Jahre, der Vertrag und sonstige Geschäftsunterlagen sechs Jahre (§ 147 AO). Gesundheitsangaben und Notfallkontakt werden gelöscht, sobald sie nicht mehr benötigt werden, spätestens mit Vertragsende.",
        "Die Eltern haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Erteilte Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden. Außerdem besteht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde, z. B. beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit Baden-Württemberg.",
        "Fotos und Videos des Kindes werden nur mit einer gesonderten, freiwilligen Einwilligung (eigenes Formular) gemacht und verwendet. Ohne Einwilligung entsteht kein Nachteil.",
      ],
    },
    {
      titel: "§ 11 Vertragsschluss und Schlussbestimmungen",
      absaetze: [
        "Mit dem Zusenden dieses unterschriebenen Vertrags geben die Eltern ein verbindliches Angebot ab. Der Vertrag kommt zustande, wenn die Kursleitung ihn in Textform bestätigt, in der Regel durch Rücksendung des gegengezeichneten Vertrags per E-Mail vor der ersten Stunde.",
        "Änderungen und Ergänzungen dieses Vertrags bedürfen der Textform (z. B. E-Mail oder WhatsApp).",
        "Ergänzend gelten die AGB von AquaKids Rhein-Neckar. Bei Widersprüchen geht dieser Vertrag vor.",
        "Sollte eine Bestimmung dieses Vertrags unwirksam sein, bleibt der Vertrag im Übrigen wirksam; an die Stelle der unwirksamen Bestimmung tritt die gesetzliche Regelung.",
        "Es gilt das Recht der Bundesrepublik Deutschland.",
      ],
    },
  ];
}

const WIDERRUFSBELEHRUNG = [
  {
    titel: "Widerrufsrecht",
    absaetze: [
      "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
      `Um Ihr Widerrufsrecht auszuüben, müssen Sie mich (${KURSLEITUNG.name}, ${KURSLEITUNG.firma}, ${KURSLEITUNG.strasse}, ${KURSLEITUNG.ort}, Telefon: ${KURSLEITUNG.telefon}, E-Mail: ${KURSLEITUNG.email}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
      "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
    ],
  },
  {
    titel: "Folgen des Widerrufs",
    absaetze: [
      "Wenn Sie diesen Vertrag widerrufen, habe ich Ihnen alle Zahlungen, die ich von Ihnen erhalten habe, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei mir eingegangen ist. Für diese Rückzahlung verwende ich dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
      "Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so haben Sie mir einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie mich von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
    ],
  },
];

const MUSTER_WIDERRUF_ZEILEN = [
  "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung (*)",
  "Bestellt am (*) / erhalten am (*)",
  "Name des/der Verbraucher(s)",
  "Anschrift des/der Verbraucher(s)",
  "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
  "Datum",
];

const ERKLAERUNGEN = {
  agb: "Ich habe die Vertragsbedingungen (§ 1–11), die Widerrufsbelehrung und die AGB gelesen und bin einverstanden.",
  vertretung: "Ich bin sorgeberechtigt. Gibt es weitere Sorgeberechtigte (auch bei getrennt lebenden Eltern), handle ich mit deren Zustimmung und darf den Vertrag auch für sie abschließen.",
  aufsicht: "Vor und nach der Stunde (Umkleide, Dusche, Wartebereich, Weg zum Becken) liegt die Aufsicht bei uns Eltern. Eine volljährige Person bleibt während der Stunde im Bad und ist erreichbar.",
  notfall_einwilligung: "Im Notfall darf Erste Hilfe geleistet und ärztliche oder rettungsdienstliche Hilfe geholt werden (§ 6 Abs. 3).",
  datenschutz: "Ich habe die Datenschutzhinweise in § 10 zur Kenntnis genommen.",
  sofortbeginn: "Ich verlange ausdrücklich, dass der Unterricht vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass ich bei einem Widerruf die bis dahin erbrachten Stunden anteilig bezahle und dass mein Widerrufsrecht erlischt, sobald der Vertrag vollständig erfüllt ist.",
  gesundheit_wahr: "Meine Angaben sind vollständig und richtig. Änderungen teile ich unverzüglich mit, spätestens vor der nächsten Stunde.",
  gesundheit_einwilligung: "Ich willige ausdrücklich ein, dass die Gesundheitsangaben meines Kindes nur für einen sicheren Unterricht und für Notfälle verarbeitet und gelöscht werden, sobald sie dafür nicht mehr gebraucht werden, spätestens mit Vertragsende (Art. 9 Abs. 2 lit. a DSGVO). Die Einwilligung kann ich jederzeit mit Wirkung für die Zukunft widerrufen.",
};

// ---------- Seite aufbauen ----------

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vertrag-form");
  if (!form || typeof PREISE === "undefined") return;

  const signatur = signaturFeld(document.getElementById("signatur-eltern"));
  texteAufSeite();
  angebotsAuswahlAufbauen();
  gesundheitsFragenAufbauen();
  sichtbarkeitSteuern(form);
  vertragsFormularEinrichten(form, signatur);
  vorlagenEinrichten();
});

function texteAufSeite() {
  paragrafenAufSeite(document.getElementById("vertrag-bedingungen"), vertragsParagrafen());

  const widerruf = document.getElementById("widerrufsbelehrung");
  widerruf.append(textElement("h3", "Anlage 1: Widerrufsbelehrung"));
  WIDERRUFSBELEHRUNG.forEach(({ titel, absaetze }) => {
    widerruf.append(textElement("h3", titel));
    absaetze.forEach((absatz) => widerruf.append(textElement("p", absatz)));
  });
  widerruf.append(textElement("p", "Ende der Widerrufsbelehrung"));
  widerruf.append(textElement("h3", "Anlage 2: Muster-Widerrufsformular"));
  widerruf.append(textElement("p", "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)"));
  widerruf.append(textElement("p", `– An ${KURSLEITUNG.name}, ${KURSLEITUNG.firma}, ${KURSLEITUNG.strasse}, ${KURSLEITUNG.ort}, E-Mail: ${KURSLEITUNG.email}`));
  MUSTER_WIDERRUF_ZEILEN.forEach((zeile) => widerruf.append(textElement("p", `– ${zeile}: ____________`)));
  widerruf.append(textElement("p", "(*) Unzutreffendes streichen."));

  document.getElementById("duo-ausfall-privat-text").textContent =
    `als Privatunterricht stattfinden (${PREISE.privat.dauerMinuten} Minuten, ${euro(PREISE.privat.preis)})`;
}

function angebotsAuswahlAufbauen() {
  const container = document.getElementById("angebot-karten");
  const vorauswahl = new URLSearchParams(location.search).get("angebot");

  angebotsListe().forEach((angebot, i) => {
    const label = document.createElement("label");
    label.className = "angebot-karte";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "angebot";
    input.value = angebot.id;
    if (i === 0) input.required = true;
    if (angebot.id === vorauswahl) input.checked = true;
    const text = document.createElement("span");
    text.append(textElement("strong", angebot.name), textElement("small", angebot.details));
    label.append(input, text);
    container.append(label);
  });
}

function gesundheitsFragenAufbauen() {
  const container = document.getElementById("gesundheit-fragen");
  GESUNDHEIT_FRAGEN.forEach(({ id, frage }) => {
    const gruppe = document.createElement("div");
    gruppe.className = "auswahl-gruppe gesundheit-frage";
    gruppe.append(textElement("p", `${frage} *`, "auswahl-titel"));

    const optionen = document.createElement("div");
    optionen.className = "ja-nein";
    ["nein", "ja"].forEach((wert) => {
      const label = document.createElement("label");
      label.className = "auswahl-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `g_${id}`;
      input.value = wert;
      label.append(input, textElement("span", wert === "ja" ? "Ja" : "Nein"));
      optionen.append(label);
    });
    gruppe.append(optionen);

    const details = document.createElement("div");
    details.className = "form-group";
    details.hidden = true;
    const detailId = `g_${id}_details`;
    const detailLabel = textElement("label", "Bitte kurz beschreiben *");
    detailLabel.htmlFor = detailId;
    const detailInput = document.createElement("input");
    detailInput.type = "text";
    detailInput.id = detailId;
    detailInput.name = detailId;
    if (id === "medikamente") detailInput.placeholder = "Welche? Wo ist das Notfallmedikament?";
    details.append(detailLabel, detailInput);
    gruppe.append(details);

    gruppe.addEventListener("change", () => {
      details.hidden = !gruppe.querySelector('input[value="ja"]:checked');
    });
    container.append(gruppe);
  });
}

function sichtbarkeitSteuern(form) {
  const angebote = angebotsListe();
  const aktualisieren = () => {
    const gewaehlt = form.querySelector('input[name="angebot"]:checked');
    const angebot = gewaehlt && angebote.find((a) => a.id === gewaehlt.value);
    document.getElementById("gruppe-duo").hidden = !(angebot && angebot.duo);
    document.getElementById("gruppe-intensiv").hidden = !(angebot && angebot.intensiv);

    const weg = form.querySelector('input[name="gesundheit_weg"]:checked');
    document.getElementById("gruppe-gesundheit").hidden = !weg || weg.value !== "digital";
    document.getElementById("hinweis-gesundheit-papier").hidden = !weg || weg.value !== "papier";
  };
  form.addEventListener("change", aktualisieren);
  aktualisieren();
}

function pflichtfelderFuer(form) {
  const daten = formularDaten(form);
  const pflicht = new Set();
  const angebot = angebotsListe().find((a) => a.id === daten.angebot);
  if (angebot && angebot.intensiv) pflicht.add("intensiv_umfang").add("intensiv_preis");
  if (angebot && angebot.duo) pflicht.add("duo_ausfall");
  if (daten.gesundheit_weg === "digital") {
    pflicht.add("gesundheit_wahr").add("gesundheit_einwilligung");
    GESUNDHEIT_FRAGEN.forEach(({ id }) => pflicht.add(`g_${id}`).add(`g_${id}_details`));
  }
  return pflicht;
}

function vertragsFormularEinrichten(form, signatur) {
  const status = document.getElementById("vertrag-status");
  const submit = form.querySelector(".vertrag-submit");
  const ergebnis = document.getElementById("vertrag-ergebnis");
  document.getElementById("unterschrift_datum").value = datumDeutsch(new Date());

  // Nach Änderungen müssen die PDFs neu erstellt werden, damit sie zu den Angaben passen.
  const aenderung = (event) => {
    const gruppe = event.target.closest && event.target.closest(".form-group, .form-group-checkbox, .auswahl-gruppe");
    if (gruppe) gruppe.classList.remove("fehler");
    if (!ergebnis.hidden) {
      ergebnis.hidden = true;
      statusSetzen(status, "Sie haben Angaben geändert – bitte die PDFs neu erstellen.", false);
    }
  };
  form.addEventListener("input", aenderung);
  form.addEventListener("change", aenderung);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusSetzen(status, "", false);

    const fehler = formularPruefen(form, { zusatzPflicht: pflichtfelderFuer(form), signaturen: [signatur] });
    if (fehler) {
      statusSetzen(status, "Bitte ergänzen Sie die rot markierten Angaben.", true);
      zumFehlerSpringen(fehler);
      return;
    }

    submit.disabled = true;
    const buttonText = submit.textContent;
    submit.textContent = "PDFs werden erstellt …";

    try {
      const daten = vertragsDatenAufbereiten(form, signatur);
      const dokumente = await vertragsDokumenteErstellen(daten);
      document.getElementById("vertrag-nummer").textContent = daten.nummer;
      dokumenteAnzeigen(document.getElementById("vertrag-dokumente"), dokumente);
      ergebnis.hidden = false;
      ergebnis.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (fehlerBeimErstellen) {
      console.error(fehlerBeimErstellen);
      statusSetzen(status, "Die PDFs konnten leider nicht erstellt werden. Bitte versuchen Sie es mit einem anderen Browser oder schreiben Sie mir per WhatsApp.", true);
    } finally {
      submit.textContent = buttonText;
      submit.disabled = false;
    }
  });
}

function vertragsDatenAufbereiten(form, signatur) {
  const daten = formularDaten(form);
  daten.angebotObj = angebotsListe().find((a) => a.id === daten.angebot);
  if (daten.angebotObj.intensiv) {
    const zahl = Number(daten.intensiv_preis.replace(/\s|€/g, "").replace(/\./g, "").replace(",", "."));
    daten.intensivPreisText = Number.isFinite(zahl) && zahl > 0 ? `${euro(zahl)} gesamt` : daten.intensiv_preis;
  }
  daten.striche = signatur.striche.map((strich) => strich.slice());
  daten.nummer = neueDokumentnummer("AK");
  daten.zeitpunkt = new Date();
  return daten;
}

async function vertragsDokumenteErstellen(daten) {
  await schriftenLaden();
  const kind = dateinameSicher(`${daten.kind_vorname}-${daten.kind_nachname}`);
  const dokumente = [
    {
      titel: "1. Schwimmunterrichtsvertrag",
      beschreibung: "Bitte per WhatsApp oder E-Mail an mich senden.",
      blob: await vertragPdf(daten),
      dateiname: `AquaKids-Vertrag_${kind}_${daten.nummer}.pdf`,
      whatsapp: true,
      emailBetreff: `Schwimmvertrag ${daten.nummer}`,
      teilenText: `Hallo Nadine, anbei der unterschriebene Schwimmvertrag (Vertrags-Nr. ${daten.nummer}).`,
    },
  ];

  if (daten.gesundheit_weg === "digital") {
    dokumente.push({
      titel: "2. Gesundheitserklärung",
      beschreibung: "Bitte per E-Mail senden.",
      warnung: "Enthält Gesundheitsdaten – bitte nicht per WhatsApp verschicken.",
      blob: await gesundheitserklaerungPdf(daten),
      dateiname: `AquaKids-Gesundheitserklaerung_${kind}_${daten.nummer}.pdf`,
      whatsapp: false,
      emailBetreff: `Gesundheitserklärung zu Vertrag ${daten.nummer}`,
      teilenText: `anbei die Gesundheitserklärung zum Schwimmvertrag ${daten.nummer}.`,
    });
  } else {
    dokumente.push({
      titel: "2. Gesundheitserklärung zum Ausdrucken",
      beschreibung: "Bitte ausdrucken, ausfüllen, unterschreiben und zur ersten Stunde mitbringen.",
      blob: await gesundheitserklaerungPdf(null, daten.nummer),
      dateiname: `AquaKids-Gesundheitserklaerung_Vorlage_${daten.nummer}.pdf`,
      whatsapp: false,
    });
  }
  return dokumente;
}

function vorlagenEinrichten() {
  const button = document.getElementById("btn-vorlagen");
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Vorlagen werden erstellt …";
    try {
      await schriftenLaden();
      dokumenteAnzeigen(document.getElementById("vorlagen-dokumente"), [
        { titel: "Vertrag (leer)", blob: await vertragPdf(null), dateiname: "AquaKids-Vertrag_Vorlage.pdf" },
        { titel: "Gesundheitserklärung (leer)", blob: await gesundheitserklaerungPdf(null), dateiname: "AquaKids-Gesundheitserklaerung_Vorlage.pdf" },
        { titel: "Foto-Einwilligung (leer, freiwillig)", blob: await fotoEinwilligungPdf(null), dateiname: "AquaKids-Foto-Einwilligung_Vorlage.pdf" },
      ]);
      button.hidden = true;
    } catch (fehler) {
      console.error(fehler);
      button.textContent = "Leider fehlgeschlagen – bitte erneut versuchen";
      button.disabled = false;
    }
  });
}

// ---------- PDF: Vertrag ----------

async function vertragPdf(daten) {
  const leer = !daten;
  const w = (schluessel) => (leer ? null : daten[schluessel]);
  const pdf = new PdfLayout(
    "Schwimmunterrichtsvertrag",
    leer ? "Schwimmunterrichtsvertrag AquaKids Rhein-Neckar" : `Vertrags-Nr. ${daten.nummer} · Kind: ${daten.kind_vorname} ${daten.kind_nachname}`
  );

  pdf.titel(
    "Schwimmunterrichtsvertrag",
    leer ? "Vertrag über privaten Schwimmunterricht" : `Vertrags-Nr. ${daten.nummer} · erstellt am ${datumDeutsch(daten.zeitpunkt)}`
  );

  pdf.abschnitt("Vertragspartner");
  pdf.feld("Kursleitung", `${KURSLEITUNG.name}, ${KURSLEITUNG.firma}, ${KURSLEITUNG.strasse}, ${KURSLEITUNG.ort} · Tel. ${KURSLEITUNG.telefon} · ${KURSLEITUNG.email} · Kleinunternehmerin nach § 19 UStG (keine Umsatzsteuer)`);
  pdf.feld("Erziehungsberechtigte/r", leer ? null : `${daten.eltern_vorname} ${daten.eltern_nachname}`);
  pdf.feld("Anschrift", leer ? null : `${daten.strasse}, ${daten.plz_ort}`);
  pdf.feld("Mobilnummer", w("telefon"));
  pdf.feld("E-Mail", w("email"));

  pdf.abschnitt("Teilnehmendes Kind");
  pdf.feld("Name", leer ? null : `${daten.kind_vorname} ${daten.kind_nachname}`);
  pdf.feld("Geburtsdatum", leer ? null : datumDeutsch(daten.kind_geburtsdatum));
  pdf.feld("Stand im Wasser", w("schwimmstand"));

  pdf.abschnitt("Gebuchtes Angebot");
  angebotsListe().forEach((angebot) => {
    pdf.ankreuzen(!leer && daten.angebot === angebot.id, `${angebot.name} – ${angebot.details}`);
    if (angebot.intensiv && (leer || daten.angebot === "intensiv")) {
      pdf.feld("      Umfang und Termine", w("intensiv_umfang"));
      pdf.feld("      Preis", leer ? null : daten.intensivPreisText);
    }
  });

  if (leer || daten.angebotObj.duo) {
    pdf.unterabschnitt("Nur bei Duo-Unterricht");
    pdf.feld("Partnerkind", leer ? null : daten.duo_partner || "wird noch abgestimmt");
    pdf.absatz("Wenn das Partnerkind kurzfristig fehlt, soll die Stunde …");
    pdf.ankreuzen(!leer && daten.duo_ausfall === "privat", `als Privatunterricht stattfinden (${PREISE.privat.dauerMinuten} Minuten, ${euro(PREISE.privat.preis)})`);
    pdf.ankreuzen(!leer && daten.duo_ausfall === "verschieben", "auf einen gemeinsamen Ersatztermin verschoben werden");
  }

  pdf.unterabschnitt("Unterrichtsort");
  ["Öffentliches Bad in Mannheim", "Öffentliches Bad in Heidelberg", "Öffentliches Bad in der Umgebung", "Privater Pool nach Absprache"]
    .forEach((ort) => pdf.ankreuzen(!leer && daten.ort === ort, ort));
  pdf.feld("Bad bzw. Adresse", leer ? null : daten.ort_details || "wird noch abgestimmt");
  pdf.feld("Gewünschter Beginn", leer ? null : datumDeutsch(daten.beginn) || "nach Absprache");

  pdf.abschnitt("Übergabe, Abholung und Notfall");
  pdf.feld("Notfallkontakt", leer ? null : `${daten.notfall_name}, ${daten.notfall_telefon}`);
  pdf.feld("Weitere Abholberechtigte", leer ? null : daten.abholberechtigt || "keine", { zeilen: 2 });
  pdf.unterabschnitt("Gesundheitserklärung (eigenes Dokument, § 6 Abs. 1)");
  pdf.ankreuzen(!leer && daten.gesundheit_weg === "digital", "wird digital als separates Dokument per E-Mail übermittelt");
  pdf.ankreuzen(!leer && daten.gesundheit_weg === "papier", "wird auf Papier zur ersten Stunde mitgebracht");

  pdf.abschnitt("Vertragsbedingungen");
  vertragsParagrafen().forEach((paragraf) => pdf.paragraf(paragraf));

  pdf.abschnitt("Erklärungen der Eltern");
  ["agb", "vertretung", "aufsicht", "notfall_einwilligung", "datenschutz"].forEach((schluessel) =>
    pdf.ankreuzen(!leer, ERKLAERUNGEN[schluessel])
  );
  pdf.unterabschnitt("Beginn vor Ablauf der Widerrufsfrist (freiwillig)");
  pdf.ankreuzen(!leer && daten.sofortbeginn, ERKLAERUNGEN.sofortbeginn);
  if (!leer && !daten.sofortbeginn) {
    pdf.absatz("Nicht angekreuzt: Der Unterricht beginnt frühestens nach Ablauf der 14-tägigen Widerrufsfrist.", { groesse: 18, farbe: FARBE_HELL });
  }

  pdf.platz(420);
  pdf.abschnitt("Unterschriften");
  pdf.absatz("Mit meiner Unterschrift melde ich mein Kind verbindlich zum oben angekreuzten Angebot an. Der Vertrag kommt mit der Bestätigung durch die Kursleitung in Textform zustande (§ 11 Abs. 1).");
  pdf.y += 10;
  pdf.unterschriften([
    {
      titel: "Erziehungsberechtigte/r",
      name: leer ? "" : `${daten.eltern_vorname} ${daten.eltern_nachname}`,
      ortDatum: leer ? null : `${daten.unterschrift_ort}, ${datumDeutsch(daten.zeitpunkt)}`,
      striche: leer ? null : daten.striche,
    },
    { titel: "Kursleitung (Gegenzeichnung)", name: KURSLEITUNG.name, ortDatum: null, striche: null },
  ]);
  if (!leer) {
    pdf.absatz(`Elektronisch unterschrieben am ${datumDeutsch(daten.zeitpunkt)} um ${uhrzeitDeutsch(daten.zeitpunkt)} Uhr über aquakids-rn.de/vertrag.html.`, { groesse: 17, farbe: FARBE_HELL });
  }

  pdf.unterabschnitt("Anlagen");
  pdf.absatz("– Anlage 1: Widerrufsbelehrung\n– Anlage 2: Muster-Widerrufsformular\n– Separat (Pflicht vor der ersten Stunde): Gesundheitserklärung\n– Separat (freiwillig): Einwilligung Fotos & Videos");

  pdf.neueSeite();
  pdf.abschnitt("Anlage 1: Widerrufsbelehrung");
  WIDERRUFSBELEHRUNG.forEach(({ titel, absaetze }) => {
    pdf.unterabschnitt(titel);
    absaetze.forEach((absatz) => pdf.absatz(absatz));
  });
  pdf.absatz("Ende der Widerrufsbelehrung", { farbe: FARBE_HELL });

  pdf.neueSeite();
  pdf.abschnitt("Anlage 2: Muster-Widerrufsformular");
  pdf.absatz("(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)");
  pdf.absatz(`An: ${KURSLEITUNG.name}, ${KURSLEITUNG.firma}, ${KURSLEITUNG.strasse}, ${KURSLEITUNG.ort}, E-Mail: ${KURSLEITUNG.email}`);
  pdf.y += 10;
  MUSTER_WIDERRUF_ZEILEN.forEach((zeile) => {
    pdf.absatz(zeile);
    pdf.feld("", null, { labelBreite: 0 });
  });
  pdf.absatz("(*) Unzutreffendes streichen.", { groesse: 17, farbe: FARBE_HELL });

  return pdf.alsPdf(leer ? "Schwimmunterrichtsvertrag (Vorlage)" : `Schwimmunterrichtsvertrag ${daten.nummer}`);
}

// ---------- PDF: Gesundheitserklärung ----------

async function gesundheitserklaerungPdf(daten, vertragsnummer) {
  const leer = !daten;
  const nummer = leer ? vertragsnummer || "" : daten.nummer;
  const pdf = new PdfLayout(
    "Gesundheitserklärung",
    nummer ? `Gesundheitserklärung zu Vertrags-Nr. ${nummer}` : "Gesundheitserklärung AquaKids Rhein-Neckar"
  );

  pdf.titel("Gesundheitserklärung", nummer ? `zum Schwimmunterrichtsvertrag Nr. ${nummer}` : "zum Schwimmunterrichtsvertrag");
  pdf.absatz("Eigenes Dokument, getrennt vom Vertrag. Bitte per E-Mail senden oder auf Papier zur ersten Stunde mitbringen – nicht per WhatsApp.", { farbe: FARBE_HELL });

  pdf.abschnitt("Kind und Eltern");
  pdf.feld("Name des Kindes", leer ? null : `${daten.kind_vorname} ${daten.kind_nachname}`);
  pdf.feld("Geburtsdatum", leer ? null : datumDeutsch(daten.kind_geburtsdatum));
  pdf.feld("Erziehungsberechtigte/r", leer ? null : `${daten.eltern_vorname} ${daten.eltern_nachname}`);
  pdf.feld("Telefon", leer ? null : daten.telefon);

  pdf.abschnitt("Hat Ihr Kind eine der folgenden Erkrankungen?");
  GESUNDHEIT_FRAGEN.forEach(({ id, frage }) => {
    const antwort = leer ? "" : daten[`g_${id}`];
    pdf.platz(80);
    const y = pdf.y;
    pdf.schrift(700, 19, SCHRIFT_TEXT, FARBE_TEXT);
    pdf.ctx.fillText(frage, RAND_X, y + 2);
    const spalteNein = SEITE_BREITE - RAND_X - 230;
    pdf.kaestchen(spalteNein, y, antwort === "nein");
    pdf.schrift(400, 19, SCHRIFT_TEXT, FARBE_TEXT);
    pdf.ctx.fillText("nein", spalteNein + 36, y + 2);
    pdf.kaestchen(spalteNein + 120, y, antwort === "ja");
    pdf.ctx.fillText("ja", spalteNein + 156, y + 2);
    pdf.y += 36;
    if (leer) {
      pdf.feld("      wenn ja:", null, { labelBreite: 140 });
    } else if (antwort === "ja") {
      pdf.feld("      Details:", daten[`g_${id}_details`], { labelBreite: 140 });
    }
    pdf.balken(pdf.y, "#e3eef2", 1);
    pdf.y += 8;
  });

  pdf.abschnitt("Ängste oder besondere Erfahrungen im Wasser");
  pdf.feld("", leer ? null : daten.aengste || "keine Angaben", { zeilen: 3, labelBreite: 0 });

  pdf.abschnitt("Erklärung und Einwilligung");
  pdf.ankreuzen(!leer && daten.gesundheit_wahr, ERKLAERUNGEN.gesundheit_wahr);
  pdf.ankreuzen(!leer && daten.gesundheit_einwilligung, ERKLAERUNGEN.gesundheit_einwilligung);
  pdf.absatz(`Verantwortlich: ${KURSLEITUNG.name}, ${KURSLEITUNG.strasse}, ${KURSLEITUNG.ort}, ${KURSLEITUNG.email}. Die Angaben werden nur für einen sicheren Unterricht verwendet, im Notfall an Rettungskräfte oder Ärzte weitergegeben und sonst an niemanden. Weitere Informationen stehen in § 10 des Vertrags.`, { groesse: 17, farbe: FARBE_HELL });

  pdf.platz(300);
  pdf.y += 10;
  pdf.unterschriften([
    {
      titel: "Erziehungsberechtigte/r",
      name: leer ? "" : `${daten.eltern_vorname} ${daten.eltern_nachname}`,
      ortDatum: leer ? null : `${daten.unterschrift_ort}, ${datumDeutsch(daten.zeitpunkt)}`,
      striche: leer ? null : daten.striche,
    },
  ]);
  if (!leer) {
    pdf.absatz(`Elektronisch unterschrieben am ${datumDeutsch(daten.zeitpunkt)} um ${uhrzeitDeutsch(daten.zeitpunkt)} Uhr über aquakids-rn.de/vertrag.html.`, { groesse: 17, farbe: FARBE_HELL });
  }

  return pdf.alsPdf(nummer ? `Gesundheitserklärung ${nummer}` : "Gesundheitserklärung (Vorlage)");
}
