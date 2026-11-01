#!/usr/bin/env node
// Prueft die KENNZAHL-Zeile einer Kettenskill-Antwort deterministisch.
// Aufruf: node schema/pruefe-kennzahl.mjs <antwort.md> <skillname>
// Exit 0 = schluessig · 1 = Fund · 3 = nicht pruefbar
//
// WARUM ES DAS GIBT, und zwar BEVOR ein Richter danach gefragt wird:
// Am 21.10.2026 hat ein LLM-Grader in beiden Armen versagt, weil er etwas beurteilen
// sollte, das ein Skript entscheiden kann. Die Lehre wird
// hier angewandt, statt sie noch einmal zu bezahlen: jede Kennzahl-Bedingung, die sich
// ausrechnen laesst, wird ausgerechnet.
//
// WAS HIER NICHT GEPRUEFT WIRD: ob die Zahlen STIMMEN. Dass `workflows: 3` dasteht,
// heisst nicht, dass drei Workflows geliefert wurden. Geprueft wird die innere
// Schluessigkeit und die Ehrlichkeit der Zustandsfelder - also genau das, was eine
// Rechnung entscheiden kann. Der Rest bleibt beim Richter.

import { readFileSync, existsSync } from "node:fs";

const [pfad, skill] = process.argv.slice(2);
if (!pfad || !skill) {
  console.error("Aufruf: node schema/pruefe-kennzahl.mjs <antwort.md> <skillname>");
  process.exit(2);
}
if (!existsSync(pfad)) { console.error(`ABBRUCH (nicht pruefbar): ${pfad} fehlt.`); process.exit(3); }

const text = readFileSync(pfad, "utf8");
const m = text.match(/^KENNZAHL:\s*(\{.*\})\s*$/m);
const probleme = [];

if (!m) {
  probleme.push("keine KENNZAHL-Zeile in der Antwort — sie ist die letzte Zeile und scheitert nie still");
} else {
  let o = null;
  try { o = JSON.parse(m[1]); } catch (e) { probleme.push(`KENNZAHL nicht parsebar: ${e.message}`); }
  if (o) {
    if (o.skill !== skill) probleme.push(`skill ist '${o.skill}', erwartet '${skill}'`);

    // Gemeinsam fuer alle Kettenglieder: der eigene Pruefweg
    if (!["pruefer", "skript", "von_hand"].includes(o.geprueft)) {
      probleme.push(`geprueft ist '${o.geprueft}' — erlaubt: pruefer, skript, von_hand. Schweigen ueber den eigenen Pruefweg ist der Fehler, nicht die Handpruefung`);
    }

    if (skill === "automatisierungs-backlog") {
      if (o.ersparnis_gemessen === 0 && o.positionen !== o.mit_messanweisung) {
        probleme.push(`bei ersparnis_gemessen=0 muss mit_messanweisung (${o.mit_messanweisung}) gleich positionen (${o.positionen}) sein`);
      }
    }

    if (skill === "n8n-umsetzung") {
      // Die Summenbedingung: jede Position traegt eine Aussage, keine bleibt leer
      const s = (o.mit_vorher_wert ?? 0) + (o.vorher_wert_nicht_erhoben ?? 0);
      if (s !== o.positionen) {
        probleme.push(`mit_vorher_wert (${o.mit_vorher_wert}) + vorher_wert_nicht_erhoben (${o.vorher_wert_nicht_erhoben}) = ${s}, muss gleich positionen (${o.positionen}) sein — sonst blieb eine Zeile leer`);
      }
      // Die Ehrlichkeitsbedingung, in BEIDE Richtungen:
      // ohne gelaufenes Skript gibt es kein Urteil ...
      if (o.geprueft !== "skript" && o.strukturell_gueltig !== null) {
        probleme.push(`geprueft ist '${o.geprueft}', aber strukturell_gueltig ist ${JSON.stringify(o.strukturell_gueltig)} — ohne gelaufenes Skript ist null die ehrliche Antwort, true waere eine Luege`);
      }
      // ... und MIT gelaufenem Skript gibt es eins, sofern ueberhaupt ein Workflow da war.
      // GEMESSEN AM 23.10.2026, Luecke im eigenen Pruefer: `geprueft: "skript"` mit
      // `strukturell_gueltig: null` ging durch. Ein gelaufenes Skript liefert true ODER
      // false - null hiesse, es sei gelaufen und habe nichts gesagt. Die Einschraenkung
      // `workflows > 0` ist noetig, weil es ohne Workflow nichts zu pruefen gibt: der
      // Eval-Lauf vom 23.10. baute null Workflows (alle Positionen blockiert), und dort
      // ist null richtig.
      if (o.geprueft === "skript" && (o.workflows ?? 0) > 0 && typeof o.strukturell_gueltig !== "boolean") {
        probleme.push(`geprueft ist 'skript' bei workflows=${o.workflows}, aber strukturell_gueltig ist ${JSON.stringify(o.strukturell_gueltig)} — ein gelaufenes Skript liefert true oder false, nicht null`);
      }
      // Die drei Zustaende: der naechste darf nicht ohne den vorigen behauptet werden
      if (o.mit_testdaten_ausgefuehrt === true && o.importiert !== true) {
        probleme.push("mit_testdaten_ausgefuehrt=true bei importiert!=true — ausgefuehrt ohne importiert ist unmoeglich");
      }
      if (o.importiert === true && o.strukturell_gueltig !== true) {
        probleme.push("importiert=true, aber strukturell_gueltig ist nicht true — importiert ohne bestandene Strukturpruefung");
      }
      for (const k of ["importiert", "mit_testdaten_ausgefuehrt", "backlog_gueltig"]) {
        if (typeof o[k] !== "boolean") probleme.push(`${k} fehlt oder ist nicht boolesch — die drei Zustaende muessen einzeln dastehen`);
      }
    }

    if (skill === "uebergabe-schulung") {
      // Summenbedingung: jeder Workflow traegt eine Aussage zur Zustaendigkeit
      const s = (o.mit_verantwortlichem ?? 0) + (o.verantwortlich_nicht_benannt ?? 0);
      if (s !== o.workflows) {
        probleme.push(
          `mit_verantwortlichem (${o.mit_verantwortlichem}) + verantwortlich_nicht_benannt `
          + `(${o.verantwortlich_nicht_benannt}) = ${s}, muss gleich workflows (${o.workflows}) `
          + `sein — sonst blieb eine Zeile leer`
        );
      }
      if (!["offen", "erfolgt"].includes(o.abnahme)) {
        probleme.push(
          `abnahme ist ${JSON.stringify(o.abnahme)} — erlaubt: offen, erfolgt. `
          + `Eine GEPLANTE Abnahme ist offen, keine erfolgte`
        );
      }
      if (typeof o.eingabe_gueltig !== "boolean") {
        probleme.push("eingabe_gueltig fehlt oder ist nicht boolesch");
      }
      // Drei Handgriffe je Workflow, oder die Zahl luegt
      if (o.handgriffe_je_workflow !== undefined && o.handgriffe_je_workflow < 3) {
        probleme.push(
          `handgriffe_je_workflow ist ${o.handgriffe_je_workflow} — der Koerper verlangt drei: `
          + `anhalten, nachsehen, wieder anschalten`
        );
      }
    }

    if (skill === "wirksamkeitsnachweis") {
      if (!["gefuehrt", "vorbereitet", "nicht_moeglich"].includes(o.nachweis)) {
        probleme.push(
          `nachweis ist ${JSON.stringify(o.nachweis)} \u2014 erlaubt: gefuehrt, vorbereitet, `
          + `nicht_moeglich`
        );
      }
      if (typeof o.aktiviert !== "boolean") {
        probleme.push("aktiviert fehlt oder ist nicht boolesch");
      }
      // Die Luege, die dieses Glied verhindern soll: ein gefuehrter Nachweis ohne
      // laufende Automatisierung. Wo nichts laeuft, wurde nichts nachgemessen.
      if (o.aktiviert === false && o.nachweis === "gefuehrt") {
        probleme.push(
          `nachweis ist 'gefuehrt', aber aktiviert ist false \u2014 wo nichts laeuft, kann `
          + `nichts nachgemessen worden sein. Richtig waere 'vorbereitet'`
        );
      }
      // Dieselbe Pflicht wie Abschnitt ① des Koerpers, nur ausgerechnet statt beurteilt:
      // eine moegliche Zustandsaussage widerlegt "nicht moeglich".
      if (o.nachweis === "nicht_moeglich" && (o.zustandsaussagen ?? 0) > 0) {
        probleme.push(
          `nachweis ist 'nicht_moeglich', aber zustandsaussagen ist ${o.zustandsaussagen} \u2014 `
          + `ist eine Zustandsaussage moeglich, ist der Nachweis teilweise moeglich, nicht `
          + `unmoeglich`
        );
      }
      // Eine Differenz braucht beide Seiten.
      if ((o.differenzaussagen_beweisbar ?? 0) > 0 && o.aktiviert === false) {
        probleme.push(
          `differenzaussagen_beweisbar ist ${o.differenzaussagen_beweisbar} bei aktiviert `
          + `false \u2014 eine Differenz braucht einen Nachher-Wert, und den gibt es ohne `
          + `Laufzeit nicht`
        );
      }
      // Der Vorher-Wert ist entweder noch messbar oder verloren, nie beides und nie
      // mehr Positionen als es gibt.
      const v = (o.vorher_wert_noch_messbar ?? 0) + (o.vorher_wert_verloren ?? 0);
      if (o.positionen !== undefined && v > o.positionen) {
        probleme.push(
          `vorher_wert_noch_messbar (${o.vorher_wert_noch_messbar}) + vorher_wert_verloren `
          + `(${o.vorher_wert_verloren}) = ${v}, mehr als positionen (${o.positionen})`
        );
      }
      // Solange nichts aktiv ist, ist kein Vorher-Wert verloren \u2014 das ist der Punkt
      // von Abschnitt ② des Koerpers.
      if (o.aktiviert === false && (o.vorher_wert_verloren ?? 0) > 0) {
        probleme.push(
          `vorher_wert_verloren ist ${o.vorher_wert_verloren} bei aktiviert false \u2014 `
          + `solange nichts laeuft, ist der Vorher-Wert noch messbar, nicht verloren`
        );
      }
      if (typeof o.eingabe_gueltig !== "boolean") {
        probleme.push("eingabe_gueltig fehlt oder ist nicht boolesch");
      }
    }

    if (probleme.length === 0) {
      console.log(`OK — KENNZAHL-Zeile schluessig (${skill}).`);
      const z = Object.entries(o).filter(([k]) => k !== "skill" && k !== "datum")
        .map(([k, v]) => `${k} ${JSON.stringify(v)}`).join(" · ");
      console.log(`  ${z}`);
      process.exit(0);
    }
  }
}

console.error(`\nFUND: ${probleme.length} Problem(e) an der KENNZAHL-Zeile (${skill}).\n`);
for (const p of probleme) console.error(`  - ${p}`);
console.error("");
process.exit(1);
