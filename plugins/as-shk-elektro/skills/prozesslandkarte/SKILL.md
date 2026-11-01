---
name: prozesslandkarte
description: >-
  Macht aus einem aufgenommenen Ist-Zustand die Prozesslandkarte eines
  inhabergeführten Handwerksbetriebs — der zweite Schritt der Lieferkette,
  direkt nach ist-aufnahme und vor dem Automatisierungs-Backlog. Auslösen bei
  Prozesslandkarte, Prozesskarte, Prozessübersicht, Ablaufdiagramm,
  Wertstromanalyse, Medienbruch-Analyse, Schwachstellenanalyse,
  Automatisierungspotenzial, "wo hängt es bei uns", "wo verlieren wir Zeit",
  "was sollen wir zuerst anfassen", "woran erkennt man den größten Hebel",
  "welche Schritte kann man automatisieren". Ebenso auslösen, wenn eine
  ist-zustand.json, ein Aufnahmeprotokoll oder ein Prozessinventar vorliegt und
  daraus eine Bewertung, Priorisierung oder Landkarte werden soll. Findet
  Krücken (Zwischenstationen, die nur existieren, weil zwei Systeme nicht
  miteinander reden), benennt sie zum Entfernen statt zum Automatisieren, und
  sagt, welche Zahlen fehlen, bevor sich eine Ersparnis rechnen lässt.
metadata:
  category: lieferkette
  version: "1.0.0"
---

# Prozesslandkarte

Du bekommst einen aufgenommenen Ist-Zustand und machst daraus die Landkarte: **was läuft
wie, wo bricht es, und was ist zuerst wert angefasst zu werden.** Der Betrieb liest sie, und
der nächste Schritt der Kette baut darauf auf.

---

# ⓿ ZUERST: die Eingabe prüfen — und bei ungültiger Eingabe ABBRECHEN

**Das ist der erste Schritt, nicht der letzte.** Eine Landkarte auf einer kaputten Eingabe
ist schlimmer als keine: sie sieht fertig aus.

```bash
# Prüfer suchen — der relative Pfad löst nicht zuverlässig auf
find . -name "pruefe-ist-zustand.mjs" -not -path "*/node_modules/*" 2>/dev/null
# dann
node <gefundener-pfad> <pfad/ist-zustand.json>
```

Exit 0 heißt gültig, Exit 1 heißt ungültig mit benannten Verstößen.

**Ist der Prüfer ungültig → ABBRECHEN.** Keine Landkarte, kein Entwurf, keine „vorläufige
Fassung unter Vorbehalt". Stattdessen:

1. **die Verstöße wörtlich wiedergeben**, mit Feldpfad,
2. **sagen, was zu tun ist** — `ist-aufnahme` erneut laufen lassen oder die Felder nachziehen,
3. **nichts weiter.**

**Eine Landkarte mit Warnhinweis ist keine Verweigerung.** Der Hinweis wird beim Weiterleiten
abgeschnitten, die Karte nicht. Wer unter Zeitdruck („ich brauche sie heute noch") trotzdem
liefert, setzt den Vertrag nicht durch — und dann ist der Vertrag keiner.

## Du reparierst die Eingabe NICHT. Du sagst, wer sie korrigieren muss.

Zeig die richtige Form — „dort gehört `{"status": "nicht_erhoben"}` hin" — und **benenne die
Zuständigkeit**: wer entscheidet, welcher Wert dort steht.

**Verboten ist das Angebot, die Korrektur selbst einzusetzen und dann weiterzumachen.** Also
keine Sätze wie „sobald Sie bestätigen, setze ich die drei Korrekturen ein und baue die
Karte", „ich übernehme die Schritte aus der Kette", „geben Sie mir grünes Licht, dann lege
ich los".

**WARUM, und es ist nicht Unhilfsbereitschaft:**

- **Der Fehler wandert von der Stelle, die ihn belegen kann, an die, die ihn nur raten kann.**
  Ob der Schmerzgrad 4 vom Inhaber genannt oder vom Berater abgeleitet wurde, weiß nur, wer
  im Gespräch saß. Du nicht. Setzt du ihn ein, steht eine geratene Herkunft im Vertrag — und
  Herkunft ist der ganze Zweck des Status-Mantels.
- **Der Erzeuger muss dann nie korrekt liefern.** Repariert der Verbraucher, lernt
  `ist-aufnahme` nie, dass es falsch abgegeben hat. Der Vertrag verfällt, weil er nie weh tut.

Richtig klingt das so: „Den Status bitte nach dem Gesprächsprotokoll setzen, ich rate ihn
nicht."

## Wenn der Prüfer nicht erreichbar ist

Dann prüfst du **von Hand** gegen diese Liste und **sagst ausdrücklich, dass du von Hand
geprüft hast.** Schweigen über den eigenen Prüfweg ist der Fehler, nicht die Handprüfung.

- `schema_version` ist `"1.3.0"`
- Alle Abschnitte da: `unternehmen` `aufnahme` `systeme` `rollen` `prozesse` `ketten`
  `wuensche` `offen` `nachfragen`
- Jedes Zahlenfeld ist `{wert, status, quelle?}` mit `status` aus `gemessen` ·
  `geschaetzt` · `nicht_erhoben` · `nicht_zutreffend` — nie ein nackter Wert
- `prozesse[].schritte` trägt denselben Mantel: entweder `{"status":"nicht_erhoben"}` oder
  `{"wert":[…],"status":…,"quelle":…}`
- Jede Kette beginnt mit `quelle`, endet mit `ziel`, dazwischen `kruecke`

**WARUM DIESER ABSCHNITT ÜBERHAUPT EXISTIERT:** weil der Prüfer in manchen Umgebungen nicht
erreichbar ist (gemessen: im Eval-Sandkasten liegt keine Nachbardatei). Ohne ihn hätte dieser
Skill zwei stille Verhalten — „geprüft" und „nicht geprüft" sehen gleich aus. Mit ihm hat er
zwei **laute**.

---

# ① Die Landkarte

Für den Betrieb. Ein Dokument, das der Inhaber seiner Bürokraft hinlegen kann.

## Alle Prozesse, auch die halb bekannten

**Jeder Prozess aus der Eingabe steht in der Landkarte. Ohne Ausnahme.** Auch die mit
`schritte: {"status":"nicht_erhoben"}` — bei denen hat niemand die Schritte genannt, aber der
Prozess existiert.

| Prozess | Läuft über | Schritte | Bricht bei | Schmerz |
|---|---|---|---|---|
| Angebot schreiben | Block, Word, Kopf | **nicht aufgenommen** | — | hoch, Zitat |
| Stunden erfassen | Zettel → Ordner → Streit | 3 | Ordner im Büro | — |

**Ein Prozess mit erfundenen Schritten ist derselbe Fehler wie ein weggelassener**, nur in
der anderen Richtung. Steht dort `nicht_erhoben`, schreibst du „nicht aufgenommen" — nicht
einen plausiblen Ablauf.

**Eine Landkarte, die nur die bekannten Prozesse zeigt, ist keine Landkarte.** Und die
weggelassene Hälfte ist genau die, über die am wenigsten bekannt ist — also die riskantere.

## Die Krücken, und zwar zum Entfernen

Eine `kruecke` in einer Kette ist eine Zwischenstation, **die nur existiert, weil die Enden
nicht miteinander reden.** Sie ist keine Arbeit, die jemand braucht.

**Der Vorschlag entfernt sie. Er macht sie nicht bequemer.**

| ✗ falsch | ✓ richtig |
|---|---|
| den Ordner digitalisieren | die Stunden entstehen dort, wo sie anfallen, und landen ohne Zwischenstation in der Software |
| die Zettel scannen | — |
| das Abtippen per OCR beschleunigen | — |
| eine Erinnerung einrichten, damit das Abtippen nicht liegen bleibt | — |

**Das ist der Kern des Geschäftsmodells, nicht eine Feinheit.** Der Betrieb bezahlt dafür,
dass eine Station verschwindet. Wer sie automatisiert, verkauft ihm die Station ein zweites
Mal.

Ein Zwischenschritt dorthin ist erlaubt, **wenn er als solcher benannt ist**: „bis die
Monteure selbst erfassen können, bleibt der Ordner — Ziel ist, dass er wegfällt."

---

# ② Keine Ersparnis ohne gemessene Zahl

**Die zentrale Versuchung dieses Skills.** Eine Landkarte mit ROI-Spalte sieht professionell
aus und verkauft sich gut. Eine ROI-Spalte über nicht erhobenen Feldern ist eine Erfindung
mit Tabellenrand.

Jede Aussage der Form „spart X Stunden", „spart X Euro", „Einsparpotenzial X %",
„Amortisation in X Monaten" braucht eine Zahl, die in der Eingabe mit `status: "gemessen"`
steht. Sonst: **nicht hinschreiben.**

**Erlaubt und erwünscht:**

- **Größenordnung ohne Zahl:** „der größte Hebel liegt beim Angebot, weil der Inhaber es
  abends nach Feierabend schreibt."
- **Bedingt:** „sobald die Dauer je Angebot gemessen ist, lässt sich die Ersparnis rechnen."
- **Rechenbeispiel mit Platzhalter:** „___ Angebote × ___ Stunden = ___ Stunden je Woche."
- **Die geschätzten Angaben benutzen — als geschätzt gekennzeichnet.** Eine Schätzung in eine
  Rechnung einzusetzen, aufzusummieren oder hochzurechnen behandelt sie wie eine Messung,
  und das ist der Verstoß.

**Priorisieren darfst du trotzdem** — nur mit genanntem Maßstab: der `schmerzgrad` aus der
Eingabe, ein Zitat des Inhabers, die Anzahl der Krücken, oder ausdrücklich „Reihenfolge nach
Einschätzung, nicht nach Rechnung".

---

# ③ Der Messplan

Was der Berater beim nächsten Kontakt holt, damit sich beim nächsten Mal etwas rechnen lässt.
**Ein eigener, benannter Block** — nicht verstreut.

Je Eintrag drei Angaben:

| Zahl | woher | entscheidet |
|---|---|---|
| Dauer je Angebot | Inhaber, drei Angebote mitstoppen | ob sich das Angebotswerkzeug rechnet |
| Angebote je Woche | Ausgangsordner zählen, vier Wochen | dieselbe Rechnung, zweiter Faktor |
| Minuten je Abtipp-Durchgang | Bürokraft, einmal mitschreiben | ob die Erfassung beim Monteur lohnt |

**Eine Zahl ohne Folge ist Neugier, nicht ein Messplan.** Die dritte Spalte ist die, die
zählt.

Die Einträge kommen aus den `nicht_erhoben`-Feldern und aus `nachfragen` der Eingabe —
**nicht erfunden.** Eine Messgröße, die in der Eingabe nirgends fehlt, gehört nicht in den
Plan.

**Der Messplan ist NICHT die `nachfragen`-Liste der Eingabe.** Die richtet sich an Dritte und
fragt nach Machbarkeit; der Messplan fragt nach **Zahlen**, meist beim Betrieb selbst. Eine
Überschneidung ist normal, eine Kopie ist ein Missverständnis.

---

# ④ Die Übergabe an den nächsten Schritt

Als `prozesslandkarte.json` neben den Dokumenten. **Der Betrieb bekommt sie nie zu sehen** —
sie ist die Eingabe für `automatisierungs-backlog`.

Der Vertrag ist `prozesslandkarte.schema.json` (Fassung **1.0.0**). **Such ihn, statt den
Pfad zu raten** — wie beim Ist-Zustand:

```bash
find . -name "prozesslandkarte.schema.json" -not -path "*/node_modules/*" 2>/dev/null
node <gefundener-pfad>/pruefe-prozesslandkarte.mjs <deine.json> [<ist-zustand.json>]
```

Gibst du den Ist-Zustand als zweites Argument mit, prüft der Prüfer zusätzlich, **dass kein
Prozess still verschwunden ist.** Tu das.

## Die Schlüssel — die Regeln stehen im Schema

```jsonc
{
  "schema_version": "1.0.0",
  "quelle":    { "ist_zustand_schema", "geprueft": "pruefer|von_hand", "aufnahme_datum" },
  "positionen": FAKT mit "wert":[{
      "id", "name",
      "art": "kruecke_entfernen|schritt_automatisieren|prozess_ordnen",
      "betrifft": { "prozesse":[ids], "ketten":[ids] },
      "entfernt",                      // bei kruecke_entfernen PFLICHT
      "blockiert_durch": [],
      "ersparnis": FAKT,               // gemessen ODER nicht_erhoben — nie geschaetzt
      "rang", "rang_begruendung" }],
  "messplan":  FAKT mit "wert":[{ "zahl", "woher", "entscheidet" }],
  "nicht_angefasst": [{ "prozess", "grund" }]
}
```

**Vier Regeln, die der Prüfer durchsetzt und die man leicht übersieht:**

1. **`quelle.geprueft` ist Pflicht.** Entweder `pruefer` oder `von_hand`. Schweigen über den
   eigenen Prüfweg ist der Fehler, nicht die Handprüfung — und am 18.10. war genau dieses
   Merkmal das, was mit Körper 3:0 und ohne 0:3 stand.
2. **`ersparnis` ist `gemessen` oder `nicht_erhoben` — niemals `geschaetzt`.** Eine
   geschätzte Ersparnis ist eine Erfindung mit Tabellenrand. Solange nichts gemessen ist,
   steht überall `nicht_erhoben`, und das ist richtig.
3. **Bei `art: "kruecke_entfernen"` ist `entfernt` Pflicht.** Fällt nichts weg, wird die
   Krücke bedient statt entfernt — genau der Fehler, gegen den das Kettenformat gebaut wurde.
4. **Jeder Prozess des Ist-Zustands steht in einer Position ODER in `nicht_angefasst`.**
   Mit Grund: was still wegfallen kann, muss ausdrücklich behauptet werden.
   Der Prüfer rechnet das gegen den Ist-Zustand nach, wenn du ihn mitgibst.

**Leere Listen sind Aussagen.** Keine Positionen zu haben heißt
`{"status": "nicht_zutreffend", "quelle": "<Grund>"}` — `quelle` ist dort Pflicht, denn
„hier ist nichts zu holen" ist eine starke Behauptung über einen Betrieb.

---

# ⑤ Die Protokollzeile am Ende

**Eine Zeile, immer, als letzte Zeile deiner Antwort:**

```
KENNZAHL: {"datum":"2026-10-20","skill":"prozesslandkarte","positionen":6,"kruecken":1,"messgroessen":3,"nicht_angefasst":4,"ersparnis_gemessen":0,"geprueft":"von_hand"}
```

Sie wird an `kennzahlen/lieferkette.jsonl` **angehängt, nie ersetzt** — der Wert liegt in der
Reihe, nicht in der letzten Zeile.

**WARUM EINE PROTOKOLLZEILE UND KEIN DATEISCHREIBEN:** ein Schreibversuch kann still
scheitern — im Eval-Sandkasten gibt es keinen beschreibbaren Pfad, beim Kunden vielleicht
keine Rechte. Eine Zeile in der Antwort scheitert nie still. **Ein Prüfwerkzeug darf nie
schweigen, wenn es nicht prüfen konnte** — dasselbe gilt für ein
Messwerkzeug.

**WARUM ÜBERHAUPT:** die Zahl der Krücken, die eine Landkarte findet, und die Zahl der
Prozesse, die sie nicht anfasst, sagen über mehrere Mandate hinweg, ob die Kette trägt. Eine
Liste wird abgearbeitet und ist weg; eine Reihe von Zahlen bleibt. Gelernt am 19.10., als
die Zehn-Punkte-Liste eines Reviewers vom 13.10. nicht mehr auffindbar war — **die Liste war
verloren, die Zahl wäre es nicht gewesen.**

