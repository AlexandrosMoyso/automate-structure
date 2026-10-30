#!/usr/bin/env node
// Prüft eine ist-zustand.json gegen ist-zustand.schema.json.
//
// Aufruf: node schema/pruefe-ist-zustand.mjs <datei.json>
// Exit 0 = gültig, 1 = Verstöße, 2 = Aufrufproblem.
//
// OHNE ABHÄNGIGKEITEN. Absichtlich: dieses Plugin hat kein node_modules und soll
// keines brauchen. Der Prüfer deckt die Struktur ab UND die Regeln, die JSON
// Schema nur umständlich ausdrückt — vor allem die Fakt-Regel und die Verweise
// zwischen Rollen, Systemen und Schritten.
//
// WARUM ES DIESEN PRÜFER GIBT: im Eval urteilte bisher ein Sprachmodell über
// JSON-Struktur und stimmte uneinheitlich ab. Struktur ist entscheidbar, nicht
// beurteilbar. Was entscheidbar ist, gehört nicht vor einen Richter.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const hier = dirname(fileURLToPath(import.meta.url));
const datei = process.argv[2];
if (!datei) { console.error("Aufruf: node pruefe-ist-zustand.mjs <datei.json>"); process.exit(2); }

let d;
try { d = JSON.parse(readFileSync(datei, "utf8")); }
catch (e) { console.error(`UNGUELTIG: kein lesbares JSON — ${e.message}`); process.exit(1); }

const schema = JSON.parse(readFileSync(join(hier, "ist-zustand.schema.json"), "utf8"));
const fehler = [];
const rueg = (pfad, text) => fehler.push(`${pfad}: ${text}`);

// ---------------------------------------------------------------------------
// Die Fakt-Regel — der Kern dieser Fassung
// ---------------------------------------------------------------------------
const STATUS = ["gemessen", "geschaetzt", "nicht_erhoben", "nicht_zutreffend"];
function pruefeFakt(v, pfad) {
  if (v === undefined) return;                       // optionale Felder duerfen fehlen
  if (v === null || typeof v !== "object" || Array.isArray(v)) {
    // Gefundenes gekappt: bei einer nackten schritte-Liste waere der Dump sonst
    // laenger als die Ruege und wuerde die restlichen Verstoesse aus dem Blick
    // schieben. Eine Ruege muss lesbar bleiben, um zu wirken.
    const gefunden = JSON.stringify(v);
    const kurz = gefunden.length > 80 ? gefunden.slice(0, 77) + "…" : gefunden;
    const nachsatz = Array.isArray(v)
      ? `Eine nackte Liste ist ab 1.2.0 ungueltig: sie verschweigt, ob nie gefragt oder nicht anwendbar. Richtig: {"wert": [...], "status": "geschaetzt", "quelle": "…"}.`
      : `Ein nackter Wert oder null ist ab 1.1.0 ungueltig: er verschweigt, ob nie gemessen oder nicht anwendbar.`;
    return rueg(pfad, `muss ein Fakt-Objekt sein {wert, status, quelle?} — gefunden ${kurz}. ${nachsatz}`);
  }
  if (!STATUS.includes(v.status)) return rueg(pfad, `status fehlt oder unbekannt (erlaubt: ${STATUS.join(", ")})`);
  const belegt = v.status === "gemessen" || v.status === "geschaetzt";
  if (belegt) {
    if (v.wert === null || v.wert === undefined) rueg(pfad, `status '${v.status}' ohne Wert — dort traegt er`);
    if (!v.quelle || !String(v.quelle).trim()) {
      rueg(pfad, `status '${v.status}' ohne quelle. Eine Zahl ohne Herkunft landet sonst ungeprueft in einem Angebot.`);
    }
  } else if (v.wert !== null && v.wert !== undefined) {
    // FEHLEN und null sind bei nicht_erhoben/nicht_zutreffend gleichbedeutend.
    // Gelockert am 15.10.2026: die alte Fassung verlangte ein ausdrueckliches null
    // und erzeugte damit 44 von 156 Verstoessen in einem Lauf — ohne dass das
    // fehlende null irgendeine Information verschwiegen haette. Der Status ist
    // Pflicht, also ist nichts mehrdeutig. Eine Regel, die nur Zeremonie erzwingt,
    // macht den Pruefer laut, ohne ihn schaerfer zu machen.
    rueg(pfad, `status '${v.status}' darf keinen Wert tragen — gefunden ${JSON.stringify(v.wert)}. ` +
      `Fehlendes 'wert' und null sind hier gleichbedeutend und beide richtig.`);
  }
}

// ---------------------------------------------------------------------------
// Struktur
// ---------------------------------------------------------------------------
if (d.schema_version !== "1.3.0") rueg("schema_version", `erwartet "1.3.0", gefunden ${JSON.stringify(d.schema_version)}`);

for (const k of schema.required) if (!(k in d)) rueg(k, "Pflichtabschnitt fehlt");
for (const k of Object.keys(d)) if (!schema.properties[k]) rueg(k, "unbekannter Abschnitt");

const liste = (x) => (Array.isArray(x) ? x : []);
const ids = (arr, f = "id") => new Set(liste(arr).map((e) => e && e[f]).filter(Boolean));

const rollenIds = ids(d.rollen);
const systemIds = new Set([...ids(d.systeme), "papier", "kopf"]);
const bereichIds = ids(d.unternehmen?.bereiche);

// unternehmen
if (d.unternehmen) {
  if (!d.unternehmen.name) rueg("unternehmen.name", "fehlt");
  for (const feld of ["gesellschaften", "standorte", "bereiche"]) {
    if (!Array.isArray(d.unternehmen[feld])) rueg(`unternehmen.${feld}`, "muss eine Liste sein (darf leer sein)");
  }
  pruefeFakt(d.unternehmen.mitarbeiter_gesamt, "unternehmen.mitarbeiter_gesamt");
  const gesIds = ids(d.unternehmen.gesellschaften);
  liste(d.unternehmen.standorte).forEach((s, i) => {
    if (s.gesellschaft && !gesIds.has(s.gesellschaft)) rueg(`unternehmen.standorte[${i}].gesellschaft`, `verweist auf unbekannte Gesellschaft '${s.gesellschaft}'`);
  });
}

// aufnahme
if (d.aufnahme) {
  const G = ["gespraech_vor_ort", "gespraech_fern", "protokoll", "unterlagen", "gemischt"];
  if (!G.includes(d.aufnahme.grundlage)) rueg("aufnahme.grundlage", `fehlt oder unbekannt (erlaubt: ${G.join(", ")})`);
  pruefeFakt(d.aufnahme.dauer_min, "aufnahme.dauer_min");
}

// rollen — Klarnamen-Heuristik
const VORNAMEN = /\b(Sandra|Thomas|Michael|Andrea|Stefan|Christian|Alexander|Sabine|Peter|Markus|Julia|Anna|Herr|Frau)\b/i;
liste(d.rollen).forEach((r, i) => {
  if (!r.id || !r.bezeichnung) rueg(`rollen[${i}]`, "id oder bezeichnung fehlt");
  if (r.bezeichnung && VORNAMEN.test(r.bezeichnung)) {
    rueg(`rollen[${i}].bezeichnung`, `sieht nach einem Klarnamen aus ('${r.bezeichnung}'). Dieses Format reist weiter — Namen gehoeren ins Kundendokument.`);
  }
  pruefeFakt(r.anzahl_personen, `rollen[${i}].anzahl_personen`);
  pruefeFakt(r.was_faellt_aus_wenn_abwesend, `rollen[${i}].was_faellt_aus_wenn_abwesend`);
});

// systeme
liste(d.systeme).forEach((s, i) => {
  if (!s.id || !s.name || !s.zweck) rueg(`systeme[${i}]`, "id, name oder zweck fehlt");
});

// prozesse
liste(d.prozesse).forEach((p, i) => {
  if (!p.id || !p.name) rueg(`prozesse[${i}]`, "id oder name fehlt");
  if (p.bereich && bereichIds.size && !bereichIds.has(p.bereich)) rueg(`prozesse[${i}].bereich`, `unbekannter Bereich '${p.bereich}'`);
  if (p.laeuft_je && !["unternehmen", "gesellschaft", "standort", "person"].includes(p.laeuft_je)) rueg(`prozesse[${i}].laeuft_je`, "unbekannter Wert");
  pruefeFakt(p.multiplikator, `prozesse[${i}].multiplikator`);
  pruefeFakt(p.schmerzgrad, `prozesse[${i}].schmerzgrad`);
  pruefeFakt(p.monatsende_rueckstand, `prozesse[${i}].monatsende_rueckstand`);
  // schritte traegt ab 1.2.0 den Status-Mantel. Ein Prozess ohne genannte Schritte ist
  // {status:"nicht_erhoben"} und bleibt ein Eintrag — das Feld bleibt Pflicht, der Inhalt
  // darf "nicht erhoben" sein. WARUM NICHT OPTIONAL: fehlend wuerde wieder gleichzeitig
  // "nicht gefragt" und "gibt es nicht" bedeuten. WARUM KEIN EIGENES FLAG: das waere eine
  // zweite Mechanik fuer etwas, das die erste schon kann. Fuer prozesslandkarte ist die
  // Unterscheidung die wichtigste von allen — Luecke in der Aufnahme gegen Prozess aus
  // einem Handgriff. Die zu verwechseln kostet eine falsche Prozesslandkarte.
  if (p.schritte === undefined) return rueg(`prozesse[${i}].schritte`, "fehlt. Pflichtfeld, auch ohne genannte Schritte: dann {\"status\":\"nicht_erhoben\"}");
  pruefeFakt(p.schritte, `prozesse[${i}].schritte`);
  const schritteBelegt = p.schritte && (p.schritte.status === "gemessen" || p.schritte.status === "geschaetzt");
  if (schritteBelegt && (!Array.isArray(p.schritte.wert) || p.schritte.wert.length === 0)) {
    return rueg(`prozesse[${i}].schritte.wert`, `status '${p.schritte.status}' verlangt mindestens einen Schritt unter 'wert' — sonst ist der Status nicht_erhoben`);
  }
  if (!schritteBelegt) return;
  p.schritte.wert.forEach((s, j) => {
    const pf = `prozesse[${i}].schritte.wert[${j}]`;
    if (typeof s.nr !== "number") rueg(pf + ".nr", "fehlt");
    if (!s.was) rueg(pf + ".was", "fehlt");
    if (!s.rolle) rueg(pf + ".rolle", "fehlt — wer macht diesen Schritt (als Rolle)?");
    else if (rollenIds.size && !rollenIds.has(s.rolle)) rueg(pf + ".rolle", `verweist auf unbekannte Rolle '${s.rolle}'`);
    if (!s.system) rueg(pf + ".system", "fehlt");
    else if (!systemIds.has(s.system)) rueg(pf + ".system", `verweist auf unbekanntes System '${s.system}' (erlaubt sind systeme[].id sowie 'papier' und 'kopf')`);
    for (const f of ["dauer_min", "haeufigkeit_pro_woche", "wartezeit_tage"]) pruefeFakt(s[f], `${pf}.${f}`);
  });
});

// ketten — die Kernänderung
liste(d.ketten).forEach((k, i) => {
  const pf = `ketten[${i}]`;
  if (!k.id || !k.was) rueg(pf, "id oder was fehlt");
  if (!Array.isArray(k.stationen) || k.stationen.length < 2) {
    return rueg(pf + ".stationen", "mindestens zwei Stationen — eine Kette mit einer Station ist kein Weg");
  }
  const rollen = k.stationen.map((s) => s && s.rolle);
  if (rollen[0] !== "quelle") rueg(pf + ".stationen[0].rolle", "die erste Station muss 'quelle' sein");
  if (rollen[rollen.length - 1] !== "ziel") rueg(pf + `.stationen[${rollen.length - 1}].rolle`, "die letzte Station muss 'ziel' sein");
  k.stationen.forEach((s, j) => {
    const sp = `${pf}.stationen[${j}]`;
    if (!s.system) rueg(sp + ".system", "fehlt");
    else if (!systemIds.has(s.system)) rueg(sp + ".system", `unbekanntes System '${s.system}'`);
    if (!["quelle", "kruecke", "ziel"].includes(s.rolle)) rueg(sp + ".rolle", "muss quelle, kruecke oder ziel sein");
    if (j > 0 && j < k.stationen.length - 1 && s.rolle !== "kruecke") {
      rueg(sp + ".rolle", "Zwischenstationen sind 'kruecke' — quelle und ziel stehen nur am Anfang und am Ende");
    }
  });
  // Scheinbruch: zwei aufeinanderfolgende Stationen im selben System ohne Handgriff
  for (let j = 1; j < k.stationen.length; j++) {
    const a = k.stationen[j - 1], b = k.stationen[j];
    if (a.system === b.system && !a.handgriff) {
      rueg(`${pf}.stationen[${j}]`, `gleiches System wie die Station davor ('${a.system}') und kein Handgriff dazwischen — ` +
        `das ist kein Medienbruch, sondern eine Rechenkette innerhalb eines Werkzeugs. Nicht als Kette fuehren.`);
    }
  }
  for (const f of ["haeufigkeit_pro_woche", "minuten_je_mal", "multiplikator"]) pruefeFakt(k[f], `${pf}.${f}`);
});

// wuensche / offen / nachfragen
liste(d.wuensche).forEach((w, i) => {
  if (!w.text) rueg(`wuensche[${i}].text`, "fehlt");
  if (!["offen", "geparkt", "erledigt"].includes(w.status)) rueg(`wuensche[${i}].status`, "muss offen, geparkt oder erledigt sein");
});
liste(d.offen).forEach((o, i) => {
  if (!o.frage) rueg(`offen[${i}].frage`, "fehlt");
  if (!o.blockiert) rueg(`offen[${i}].blockiert`, "fehlt — was ist ohne diese Antwort nicht moeglich?");
});
// nachfragen traegt ab 1.3.0 den Status-Mantel — als STRUKTURregel.
//
// WARUM: bis 1.2.0 stand hier eine nackte Liste, und dieser forEach lief bei einer
// LEEREN Liste null Mal. Eine leere Nachfrage-Liste galt damit als gueltig, obwohl der
// Pruefer sie nie angesehen hatte. Gemessen am 17.10.2026, als zu jedem Punkt der alten
// Pruefliste ein gezielter Verstoss gebaut wurde: sieben fing der Pruefer, DIESER rutschte
// durch. Es sah geprueft aus und war es nicht.
//
// WARUM 'quelle' HIER AUCH BEI LEER PFLICHT IST, anders als bei den Zahlenfeldern:
// "niemand ausser dem Inhaber muss gefragt werden" ist eine starke Behauptung ueber einen
// Betrieb. Im Lauf vom 15.10. lagen FUENF VON SIEBEN tragenden Antworten nicht beim
// Inhaber. Wer das Gegenteil behauptet, soll sagen, woher er es weiss.
//
// Keine zweite Mechanik: derselbe Mantel wie bei schritte, eine Verschaerfung.
if (d.nachfragen === undefined) {
  rueg("nachfragen", "fehlt. Pflichtfeld: entweder Eintraege unter 'wert', oder {\"status\":\"nicht_zutreffend\",\"quelle\":\"<Begruendung>\"}");
} else {
  pruefeFakt(d.nachfragen, "nachfragen");
  const nBelegt = d.nachfragen && (d.nachfragen.status === "gemessen" || d.nachfragen.status === "geschaetzt");
  if (nBelegt) {
    if (!Array.isArray(d.nachfragen.wert) || d.nachfragen.wert.length === 0) {
      rueg("nachfragen.wert", `status '${d.nachfragen.status}' verlangt mindestens einen Eintrag — leer heisst nicht_zutreffend, mit Begruendung`);
    } else {
      d.nachfragen.wert.forEach((n, i) => {
        const pf = `nachfragen.wert[${i}]`;
        if (!n.rolle) rueg(pf + ".rolle", "fehlt");
        if (!n.frage) rueg(pf + ".frage", "fehlt");
        if (n.rolle && VORNAMEN.test(n.rolle)) rueg(pf + ".rolle", `sieht nach einem Klarnamen aus ('${n.rolle}')`);
      });
    }
  } else if (d.nachfragen && typeof d.nachfragen === "object" && !Array.isArray(d.nachfragen)) {
    // Leer ist erlaubt — aber nur als AUSSAGE, nie stillschweigend.
    if (!d.nachfragen.quelle || !String(d.nachfragen.quelle).trim()) {
      rueg("nachfragen.quelle", `status '${d.nachfragen.status}' ohne Begruendung. Eine leere Nachfrage-Liste ist eine Behauptung ueber den Betrieb und braucht ihren Grund — hier ist 'quelle' Pflicht, anders als bei den Zahlenfeldern`);
    }
  }
}

// ---------------------------------------------------------------------------
// Bericht
// ---------------------------------------------------------------------------
// NUR fuer die Zusammenfassung. Ein Feld kann eine nackte Liste sein ODER den
// Status-Mantel tragen, also {wert:[...], status, quelle} — `schritte` seit 1.2.0,
// `nachfragen` seit 1.3.0.
//
// WARUM NICHT liste() SELBST MANTEL-FAEHIG MACHEN: liste() steht in den PRUEFpfaden.
// Dass es fuer eine Nicht-Liste [] liefert, ist dort kein Mangel, sondern die Bremse:
// ein falsch geformtes `prozesse: {wert:[...]}` wuerde sonst still als gueltig
// durchlaufen. Zaehlen und Pruefen brauchen hier verschiedene Lesarten.
//
// GEFUNDEN AM 20.10.2026, und nicht von uns: der Eval-Lauf von `prozesslandkarte`
// meldete von sich aus "Der Pruefer zaehlt die Nachfragen falsch. Er meldet 0
// Nachfragen, obwohl 7 in der Eingabe stehen." Nachgemessen: stimmt. `nachfragen`
// wurde mit 1.3.0 zum Mantel-Feld, der Zaehler las weiter die nackte Liste und fand
// keine. Das Urteil "gueltig" war richtig, die Zahl daneben war falsch — also genau
// die Sorte Fehler, die eine Zaehlleiste unbemerkt verschiebt.
const zahl = (x) => (Array.isArray(x) ? x : Array.isArray(x?.wert) ? x.wert : []).length;
if (fehler.length === 0) {
  console.log("GUELTIG gegen ist-zustand.schema.json 1.3.0");
  console.log(`  ${zahl(d.unternehmen?.gesellschaften)} Gesellschaften · ${zahl(d.unternehmen?.standorte)} Standorte · ${zahl(d.systeme)} Systeme`);
  console.log(`  ${zahl(d.prozesse)} Prozesse · ${zahl(d.ketten)} Ketten · ${zahl(d.rollen)} Rollen`);
  console.log(`  ${zahl(d.offen)} offene Punkte · ${zahl(d.nachfragen)} Nachfragen · ${zahl(d.wuensche)} Wuensche`);
  const kruecken = liste(d.ketten).flatMap((k) => liste(k.stationen)).filter((s) => s.rolle === "kruecke").length;
  console.log(`  davon ${kruecken} Kruecken — Zwischenstationen, die nur existieren, weil die Enden nicht reden`);
  process.exit(0);
}
console.error(`UNGUELTIG — ${fehler.length} Verstoss/Verstoesse gegen ist-zustand.schema.json 1.3.0\n`);
for (const f of fehler) console.error("  - " + f);
process.exit(1);
