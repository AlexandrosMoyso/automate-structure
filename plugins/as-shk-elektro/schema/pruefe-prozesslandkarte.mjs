#!/usr/bin/env node
// Prueft prozesslandkarte.json gegen prozesslandkarte.schema.json 1.0.0.
// Ohne Abhaengigkeiten, damit er beim Kunden laeuft.
//
// Aufruf: node pruefe-prozesslandkarte.mjs <pfad> [<pfad/ist-zustand.json>]
//
// Exit 0 = gueltig · Exit 1 = ungueltig · Exit 2 = nicht lesbar
//
// WAS ENTSCHEIDBAR IST, WIRD ENTSCHIEDEN — und nicht vor einen Richter gelegt.
// Belegt am 17.10.2026: ein Richter stimmte zu acht Vertragspunkten neunmal ab und lag
// dreimal falsch, bei dreimal Pruefer-Exit 0. Ein Richter, der ueber Mechanik abstimmt,
// misst sich selbst.

import { readFileSync } from "node:fs";

const pfad = process.argv[2];
const istPfad = process.argv[3];
if (!pfad) { console.error("Aufruf: node pruefe-prozesslandkarte.mjs <pfad> [<ist-zustand.json>]"); process.exit(2); }

let d;
try { d = JSON.parse(readFileSync(pfad, "utf8")); }
catch (e) { console.error(`Nicht lesbar oder kein gueltiges JSON: ${e.message}`); process.exit(2); }

const fehler = [];
const rueg = (p, t) => fehler.push(`${p}: ${t}`);
const STATUS = ["gemessen", "geschaetzt", "nicht_erhoben", "nicht_zutreffend"];

// quelle auch bei leer Pflicht: "hier ist nichts zu holen" ist eine starke Behauptung.
// istListe: trifft auf positionen und messplan zu, NICHT auf ersparnis — dort ist 'wert'
// eine Zahl. Der erste Entwurf verlangte ueberall eine Liste und haette eine ECHTE
// gemessene Ersparnis abgewiesen. Beim Testen gefunden, nicht im Betrieb.
function pruefeMantel(v, pfad2, artName, quelleAuchLeerPflicht, istListe = true) {
  if (v === undefined) return rueg(pfad2, `fehlt. Pflichtfeld mit Status-Mantel: entweder Eintraege unter 'wert', oder {"status":"nicht_zutreffend","quelle":"<Grund>"}`);
  if (v === null || typeof v !== "object" || Array.isArray(v)) {
    return rueg(pfad2, `muss ein Fakt-Objekt sein {wert, status, quelle?} — eine nackte Liste verschweigt, ob leer heisst "nichts gefunden" oder "nicht geprueft"`);
  }
  if (!STATUS.includes(v.status)) return rueg(pfad2 + ".status", `fehlt oder unbekannt (erlaubt: ${STATUS.join(", ")})`);
  const belegt = v.status === "gemessen" || v.status === "geschaetzt";
  if (belegt) {
    if (istListe) {
      if (!Array.isArray(v.wert) || v.wert.length === 0) rueg(pfad2 + ".wert", `status '${v.status}' verlangt mindestens ${artName}`);
    } else if (v.wert === undefined || v.wert === null) {
      rueg(pfad2 + ".wert", `status '${v.status}' ohne Wert — dort traegt er`);
    }
    if (!v.quelle || !String(v.quelle).trim()) rueg(pfad2 + ".quelle", `status '${v.status}' ohne quelle`);
  } else {
    if (v.wert !== undefined && v.wert !== null) rueg(pfad2 + ".wert", `status '${v.status}' darf keinen Wert tragen`);
    if (quelleAuchLeerPflicht && (!v.quelle || !String(v.quelle).trim())) {
      rueg(pfad2 + ".quelle", `status '${v.status}' ohne Begruendung. Leer ist eine Aussage ueber den Betrieb und braucht ihren Grund`);
    }
  }
  return belegt;
}

if (d.schema_version !== "1.0.0") rueg("schema_version", `erwartet "1.0.0", gefunden ${JSON.stringify(d.schema_version)}`);

for (const k of ["quelle", "positionen", "messplan", "nicht_angefasst"]) {
  if (d[k] === undefined) rueg(k, "Pflichtabschnitt fehlt");
}

// quelle — und vor allem: WIE wurde geprueft
if (d.quelle && typeof d.quelle === "object") {
  if (!d.quelle.ist_zustand_schema) rueg("quelle.ist_zustand_schema", "fehlt — aus welcher Vertragsfassung stammt die Eingabe?");
  if (!["pruefer", "von_hand"].includes(d.quelle.geprueft)) {
    rueg("quelle.geprueft", `fehlt oder unbekannt (erlaubt: pruefer, von_hand). Schweigen ueber den eigenen Pruefweg ist der Fehler, nicht die Handpruefung`);
  }
}

const positionenBelegt = pruefeMantel(d.positionen, "positionen", "eine Position", true);
const messplanBelegt = pruefeMantel(d.messplan, "messplan", "eine Messgroesse", true);

if (positionenBelegt === true) {
  const raenge = [];
  d.positionen.wert.forEach((p, i) => {
    const pf = `positionen.wert[${i}]`;
    for (const k of ["id", "name", "art", "rang", "rang_begruendung"]) if (!p[k]) rueg(`${pf}.${k}`, "fehlt");
    if (p.art && !["kruecke_entfernen", "schritt_automatisieren", "prozess_ordnen"].includes(p.art)) {
      rueg(`${pf}.art`, `unbekannt: '${p.art}'`);
    }
    // Eine Kruecken-Position, die nichts entfernt, ist keine.
    if (p.art === "kruecke_entfernen" && (!p.entfernt || !String(p.entfernt).trim())) {
      rueg(`${pf}.entfernt`, `art 'kruecke_entfernen' ohne 'entfernt'. Wenn nichts wegfaellt, wird die Kruecke bedient statt entfernt — und das ist der Fehler, gegen den das Kettenformat gebaut wurde`);
    }
    pruefeMantel(p.ersparnis, `${pf}.ersparnis`, "einen Wert", false, false);
    // Eine belegte Ersparnis braucht eine Quelle, die auf eine MESSUNG zeigt.
    if (p.ersparnis && p.ersparnis.status === "geschaetzt") {
      rueg(`${pf}.ersparnis`, `status 'geschaetzt' ist hier nicht zulaessig. Eine Ersparnis ist gemessen oder nicht_erhoben — eine geschaetzte Ersparnis ist eine Erfindung mit Tabellenrand`);
    }
    if (typeof p.rang === "number") raenge.push(p.rang);
  });
  const doppelt = raenge.filter((r, i) => raenge.indexOf(r) !== i);
  if (doppelt.length) rueg("positionen.wert[].rang", `doppelte Raenge: ${[...new Set(doppelt)].join(", ")} — eine Reihenfolge mit zwei Ersten ist keine`);
}

if (messplanBelegt === true) {
  d.messplan.wert.forEach((m, i) => {
    for (const k of ["zahl", "woher", "entscheidet"]) {
      if (!m[k] || !String(m[k]).trim()) rueg(`messplan.wert[${i}].${k}`, k === "entscheidet" ? "fehlt — eine Zahl ohne Folge ist Neugier, nicht ein Messplan" : "fehlt");
    }
  });
}

if (!Array.isArray(d.nicht_angefasst)) {
  if (d.nicht_angefasst !== undefined) rueg("nicht_angefasst", "muss eine Liste sein (leer ist erlaubt, fehlen nicht)");
} else {
  d.nicht_angefasst.forEach((n, i) => {
    for (const k of ["prozess", "grund"]) if (!n[k]) rueg(`nicht_angefasst[${i}].${k}`, "fehlt");
  });
}

// ---------------------------------------------------------------------------
// Gegen den Ist-Zustand, falls er mitgegeben wird: KEIN Prozess darf still
// verschwinden. Dauerregel 28 — was still wegfallen kann, muss ausdruecklich
// behauptet werden.
// ---------------------------------------------------------------------------
if (istPfad) {
  let ist;
  try { ist = JSON.parse(readFileSync(istPfad, "utf8")); }
  catch (e) { rueg("ist-zustand", `nicht lesbar: ${e.message}`); }
  if (ist && Array.isArray(ist.prozesse)) {
    const alle = ist.prozesse.map((p) => p.id).filter(Boolean);
    const inPos = new Set((positionenBelegt === true ? d.positionen.wert : []).flatMap((p) => p.betrifft?.prozesse || []));
    const inNicht = new Set((Array.isArray(d.nicht_angefasst) ? d.nicht_angefasst : []).map((n) => n.prozess));
    const verschwunden = alle.filter((id) => !inPos.has(id) && !inNicht.has(id));
    if (verschwunden.length) {
      rueg("nicht_angefasst", `${verschwunden.length} Prozess(e) des Ist-Zustands kommen weder in einer Position noch in nicht_angefasst vor: ${verschwunden.join(", ")}. Sie sind still verschwunden`);
    }
    for (const id of inPos) if (!alle.includes(id)) rueg("positionen.wert[].betrifft.prozesse", `verweist auf unbekannten Prozess '${id}'`);
    for (const id of inNicht) if (!alle.includes(id)) rueg("nicht_angefasst[].prozess", `verweist auf unbekannten Prozess '${id}'`);
  }
}

const zahl = (x) => (Array.isArray(x) ? x.length : 0);
if (fehler.length === 0) {
  console.log("GUELTIG gegen prozesslandkarte.schema.json 1.0.0");
  const pos = positionenBelegt === true ? d.positionen.wert : [];
  console.log(`  ${pos.length} Positionen · ${pos.filter((p) => p.art === "kruecke_entfernen").length} davon Kruecken-Entfernung`);
  console.log(`  ${messplanBelegt === true ? d.messplan.wert.length : 0} Messgroessen · ${zahl(d.nicht_angefasst)} nicht angefasst`);
  console.log(`  Eingabe geprueft: ${d.quelle?.geprueft ?? "?"} · Ist-Zustand-Fassung ${d.quelle?.ist_zustand_schema ?? "?"}`);
  const mitZahl = pos.filter((p) => p.ersparnis?.status === "gemessen").length;
  console.log(`  ${mitZahl} Position(en) mit gemessener Ersparnis${mitZahl === 0 ? " — richtig, solange nichts gemessen ist" : ""}`);
  process.exit(0);
}
console.error(`UNGUELTIG — ${fehler.length} Verstoss/Verstoesse gegen prozesslandkarte.schema.json 1.0.0\n`);
for (const f of fehler) console.error("  - " + f);
process.exit(1);
