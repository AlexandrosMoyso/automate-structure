#!/usr/bin/env node
// Deterministische Nachpruefung einer Backlog-Antwort.
// Aufruf: node schema/pruefe-backlog-antwort.mjs <antwort.md> <prozesslandkarte.json> [<ist-zustand.json>]
// Exit 0 = nichts gefunden · 1 = Fund · 3 = nicht pruefbar
//
// WARUM ES DIESE PRUEFUNG GIBT, und warum sie kein Richter ist:
// Am 21.10.2026 fragte der Grader `1-keine-erfundene-ersparnis` einen LLM-Richter, ob eine
// Ersparnis erfunden sei. Ergebnis: das Kriterium scheiterte in BEIDEN Armen, 0:3 / 0:3.
// Nachgesehen statt geschlossen:
//   · with-Lauf 1 enthielt NULL Zahl mit Einheit und wurde 2:1 mit FAIL bewertet.
//   · Der einzige Zahl-Treffer in with-Lauf 3 lautete "Die 240 Minuten in der Landkarte
//     sind nur angesetzt" - also genau die verlangte Kennzeichnung. Ebenfalls FAIL.
//   · 240 steht in der EINGABE (messplan der Landkarte, zweimal im Ist-Zustand), und das
//     Kriterium erlaubte zitierte Eingabe-Zahlen ausdruecklich.
//   · Die Stimmen waren instabil: PASS FAIL FAIL, FAIL FAIL FAIL, FAIL PASS FAIL.
// Dieselbe Regel, auf den eigenen Grader angewandt: was ein Skript mit einem
// Exit-Code entscheiden kann, bekommt keinen zweiten Richter. Die Regel, die der Richter
// nicht anwenden konnte, stand im Kriterium schon drin - sie ist hier ausgeschrieben.
//
// ⚠ WAS HIER MITGEWANDERT IST, nicht gestrichen: das Merkmal von `4-liest-die-landkarte`
// (Grader am 22.10. geloescht, weil er in BEIDEN Armen bestand). Seine tragende Aussage -
// wurde die Landkarte geprueft und als gueltig befunden - steckt in der KENNZAHL-Zeile
// (`geprueft`, `landkarte_gueltig`) und wird unten geprueft. Dasselbe Muster wie
// Schemaregel 4, die von Kriterium 3 nach Selbsttest-Fall P9 umgezogen ist.
//
// DIE REGEL FUER ZAHLEN, in dieser Reihenfolge:
//   1. Gesucht werden nur Zahlen MIT EINHEIT (Stunden, Minuten, Euro, Prozent, Tage,
//      Personentage). Abzaehlungen wie "3 Positionen" sind keine Behauptung ueber
//      Ersparnis und bleiben unangetastet.
//   2. Erlaubt, wenn der Zahlwert in der EINGABE vorkommt - die Eingabe ist die
//      Erlaubnisliste. Zitieren ist nicht erfinden.
//   3. Erlaubt, wenn in derselben Zeile eine QUELLENKENNZEICHNUNG steht (siehe MARKER).
//      "Die 240 Minuten sind nur angesetzt" ist die verlangte Form, nicht ein Verstoss.
//   4. Sonst: Fund, mit Zeile und Fundstelle.
//
// WAS DIESE PRUEFUNG NICHT LEISTET, damit sie niemand fuer mehr haelt:
//   · Eine erfundene Zahl neben einem Marker-Wort geht durch. Das ist bewusst: der stille
//     Fall ist der teurere, und ein Tor, das die richtige Form bestraft, wird abgeschaltet.
//   · Sie prueft Zahlen, nicht Argumente. Ein falscher Schluss ohne Zahl faellt nicht auf.
//   · Sie entscheidet nicht, ob die Reihenfolge klug ist. Das bleibt beim Richter.

import { readFileSync, existsSync } from "node:fs";

const [antwortPfad, landkartePfad, istPfad] = process.argv.slice(2);
if (!antwortPfad || !landkartePfad) {
  console.error("Aufruf: node schema/pruefe-backlog-antwort.mjs <antwort.md> <prozesslandkarte.json> [<ist-zustand.json>]");
  process.exit(2);
}
for (const p of [antwortPfad, landkartePfad]) {
  if (!existsSync(p)) { console.error(`ABBRUCH (nicht pruefbar): ${p} fehlt.`); process.exit(3); }
}

const antwort = readFileSync(antwortPfad, "utf8");

// --- Die Erlaubnisliste -------------------------------------------------------
// ZWEI Listen, und der Grund dafuer ist gemessen, nicht ueberlegt:
// Der erste Entwurf nahm JEDE Zahl aus der Eingabe als erlaubt. Gegenprobe am 22.10.2026:
// die eingesetzte Erfindung "spart ungefaehr 7 Stunden pro Woche" ging DURCH, weil `7` in
// der Eingabe steht - als Teil von "7 Systeme" und eines Datums. Die Liste enthielt
// 0,1,2,3,4,7,9 einstellig. EINE LISTE NACKTER ZIFFERN IST FUER EINSTELLIGE ZAHLEN EIN
// FREIFAHRTSCHEIN, und genau die Groessenordnung ("3 Stunden", "2 Tage") ist die, in der
// erfunden wird.
//   A) MIT EINHEIT: Zahl-plus-Einheit-Paare aus der Eingabe. Traegt Beweis, unabhaengig
//      von der Stellenzahl - ein zitiertes "240 Minuten" ist zitiert.
//   B) MEHRSTELLIG: Zahlen ab zwei Stellen, die in der Eingabe vorkommen. Eine 240 oder
//      eine 2026 aus der Eingabe ist kein Zufallstreffer; eine 7 ist einer.
const mitEinheit = new Set();
const mehrstellig = new Set();
const normal = (z) => z.replace(",", ".");
const EINHEIT_QUELLE = /(\d+(?:[.,]\d+)?)\s*(stunden?|std\.?|minuten?|min\.?|euro|eur|€|%|prozent|tage?|personentage?|pt)\b/giu;

const zahlenAus = (text) => {
  for (const m of text.matchAll(EINHEIT_QUELLE)) mitEinheit.add(normal(m[1]));
  for (const m of text.matchAll(/\d+(?:[.,]\d+)?/g)) {
    if (m[0].replace(/[.,]/g, "").length >= 2) mehrstellig.add(normal(m[0]));
  }
};
let quellen = 1;
zahlenAus(readFileSync(landkartePfad, "utf8"));
if (istPfad && existsSync(istPfad)) { zahlenAus(readFileSync(istPfad, "utf8")); quellen = 2; }
const erlaubteZahlen = new Set([...mitEinheit, ...mehrstellig]);

// --- Quellenkennzeichnung ----------------------------------------------------
// Steht eines dieser Woerter in derselben Zeile, ist die Zahl als nicht gemessen oder als
// zitiert gekennzeichnet - und genau das verlangt der Koerper.
const MARKER = [
  "angesetzt", "nicht erhoben", "nicht_erhoben", "nicht gemessen", "ungemessen",
  "laut landkarte", "aus der eingabe", "aus der landkarte", "zitat", "zitiert",
  "gemessen", "rechenbeispiel", "___", "sobald", "sofern", "nur ein", "platzhalter",
  "schaetzung des betriebs", "geschaetzt",
];

const EINHEIT = /(\d+(?:[.,]\d+)?)\s*(stunden?|std\.?|minuten?|min\.?|euro|eur|€|%|prozent|tage?|personentage?|pt)\b/giu;

const funde = [];
antwort.split("\n").forEach((zeile, i) => {
  const klein = zeile.toLowerCase();
  const hatMarker = MARKER.some((m) => klein.includes(m));
  for (const m of zeile.matchAll(EINHEIT)) {
    const zahl = m[1];
    const inEingabe = erlaubteZahlen.has(normal(zahl));
    if (inEingabe || hatMarker) continue;
    funde.push({
      zeile: i + 1,
      treffer: m[0].trim(),
      umfeld: zeile.trim().slice(Math.max(0, m.index - 45), m.index + 55).trim(),
    });
  }
});

// --- Die KENNZAHL-Zeile ------------------------------------------------------
// Hier liegt das Merkmal, das von `4-liest-die-landkarte` hierher umgezogen ist.
const kz = antwort.match(/^KENNZAHL:\s*(\{.*\})\s*$/m);
const kennzahl = { vorhanden: !!kz, probleme: [] };
if (!kz) {
  kennzahl.probleme.push("keine KENNZAHL-Zeile in der Antwort");
} else {
  let o = null;
  try { o = JSON.parse(kz[1]); } catch (e) { kennzahl.probleme.push(`KENNZAHL nicht parsebar: ${e.message}`); }
  if (o) {
    kennzahl.werte = o;
    if (!["pruefer", "von_hand"].includes(o.geprueft)) {
      kennzahl.probleme.push(`geprueft ist '${o.geprueft}' — erlaubt sind pruefer, von_hand. Schweigen ueber den eigenen Pruefweg ist der Fehler`);
    }
    if (o.landkarte_gueltig !== true && o.landkarte_gueltig !== false) {
      kennzahl.probleme.push("landkarte_gueltig fehlt oder ist nicht boolesch");
    }
    // Die im Koerper eingebaute Konsistenzbedingung
    if (o.ersparnis_gemessen === 0 && o.positionen !== o.mit_messanweisung) {
      kennzahl.probleme.push(
        `bei ersparnis_gemessen=0 muss mit_messanweisung (${o.mit_messanweisung}) gleich positionen (${o.positionen}) sein — `
        + "sonst steht irgendwo eine Zahl ohne Messung oder eine Zeile blieb leer"
      );
    }
  }
}

// --- Bericht -----------------------------------------------------------------
let fehler = 0;
if (funde.length > 0) {
  fehler++;
  console.error(`\nFUND: ${funde.length} Zahl(en) mit Einheit, die weder in der Eingabe stehen noch als Quelle gekennzeichnet sind.\n`);
  for (const f of funde.slice(0, 25)) {
    console.error(`  Zeile ${f.zeile}: „${f.treffer}"`);
    console.error(`     … ${f.umfeld} …`);
  }
  if (funde.length > 25) console.error(`  … und ${funde.length - 25} weitere`);
  console.error(`\n  Erlaubt waere: die Zahl aus der Eingabe zitieren, oder sie als nicht gemessen`);
  console.error(`  kennzeichnen ("nur angesetzt", "nicht erhoben") und die Messanweisung dazu.`);
}
if (kennzahl.probleme.length > 0) {
  fehler++;
  console.error(`\nFUND: ${kennzahl.probleme.length} Problem(e) an der KENNZAHL-Zeile.\n`);
  for (const p of kennzahl.probleme) console.error(`  - ${p}`);
}

if (fehler > 0) process.exit(1);

const w = kennzahl.werte || {};
console.log(`OK — keine erfundene Zahl, KENNZAHL-Zeile schluessig.`);
console.log(`  Erlaubnisliste: ${erlaubteZahlen.size} Zahlwerte aus ${quellen} Eingabedatei(en)`);
console.log(`  positionen ${w.positionen} · mit_messanweisung ${w.mit_messanweisung} · ersparnis_gemessen ${w.ersparnis_gemessen}`);
console.log(`  geprueft ${w.geprueft} · landkarte_gueltig ${w.landkarte_gueltig}`);
process.exit(0);
