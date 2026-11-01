---
name: automatisierungs-backlog
description: >-
  Macht aus einer geprüften Prozesslandkarte das Automatisierungs-Backlog eines
  inhabergeführten Handwerksbetriebs — der dritte Schritt der Lieferkette, direkt
  nach prozesslandkarte und vor der n8n-Umsetzung. Auslösen bei
  Automatisierungs-Backlog, Backlog, Automatisierungsliste, Umsetzungsreihenfolge,
  Priorisierung, Roadmap, "was automatisieren wir zuerst", "womit fangen wir an",
  "was bringt am meisten", Aufwandsschätzung, Umsetzungsplan, n8n-Plan,
  Workflow-Liste, Quick Wins. Nimmt prozesslandkarte.json als Eingabe, prüft sie
  mit pruefe-prozesslandkarte.mjs und BRICHT AB, wenn sie ungültig ist. Erfindet
  keine Ersparnis: ohne gemessene Zahl steht nicht_erhoben plus die Messanweisung,
  die vor einer Zusage fällig ist.
---

# Automatisierungs-Backlog

Du machst aus einer **geprüften Prozesslandkarte** eine Liste, die ein Umsetzer abarbeiten
kann — in einer Reihenfolge, die begründet ist, mit einem Aufwand, der benannt ist, und
**ohne eine einzige erfundene Zahl**.

Der Betrieb bekommt diese Liste zu sehen. Der nächste Schritt (`n8n-Umsetzung`) bekommt sie
als Eingabe.

---

# ⓿ ZUERST: die Eingabe prüfen — und bei ungültiger Eingabe ABBRECHEN

**Das ist der erste Schritt, nicht der letzte.** Ein Backlog auf einer kaputten Landkarte
ist schlimmer als keines: es sieht fertig aus, und der Umsetzer baut danach.

```bash
# Prüfer suchen — der relative Pfad löst nicht zuverlässig auf
find . -name "pruefe-prozesslandkarte.mjs" -not -path "*/node_modules/*" 2>/dev/null
# dann, mit dem Ist-Zustand als zweitem Argument, falls er beiliegt
node <gefundener-pfad> <pfad/prozesslandkarte.json> [<pfad/ist-zustand.json>]
```

Exit 0 heißt gültig, Exit 1 heißt ungültig mit benannten Verstößen.

**Ist die Landkarte ungültig → ABBRECHEN.** Kein Backlog, kein Entwurf, keine „vorläufige
Reihenfolge unter Vorbehalt". **Stattdessen:**

1. **die Verstöße wörtlich wiedergeben**, mit Feldpfad,
2. **sagen, wer sie korrigieren muss** — `prozesslandkarte` erneut laufen lassen,
3. **nichts weiter.**

**Ein Backlog mit Warnhinweis ist keine Verweigerung.** Der Hinweis wird beim Weiterleiten
abgeschnitten, die Liste nicht.

## Du reparierst die Landkarte NICHT. Du sagst, wer sie korrigieren muss.

**Verboten ist das Angebot, die Korrektur selbst einzusetzen und dann weiterzumachen** —
also keine Sätze wie „sobald Sie bestätigen, ergänze ich die fehlenden Ränge und baue das
Backlog". **Erlaubt und richtig ist der eine Satz: welches Feld fehlt, und dass
`prozesslandkarte` es nachziehen muss.** Du hast die Aufnahme nicht gemacht; setzt du einen
Wert ein, steht eine geratene Herkunft im Vertrag und niemand sieht es mehr. Und repariert
der Verbraucher, lernt der Erzeuger nie, dass er falsch abgegeben hat.

## Wenn der Prüfer nicht erreichbar ist

**Dann sagst du das, und zwar in der Antwort — nicht im Stillen.** Erlaubt ist
`"geprueft": "von_hand"` plus der Satz, welchen Pfad du gesucht und nicht gefunden hast.
**Verboten ist Schweigen über den eigenen Prüfweg** — denn „geprüft" und „nicht geprüft"
sehen in einer fertigen Liste gleich aus. Im Eval-Sandkasten ist keine Nachbardatei
erreichbar; dann ist die Handprüfung die richtige Antwort und die Behauptung, geprüft zu
haben, die falsche.

---

# ① Die Positionen

Jede Position der Landkarte wird **eine** Backlog-Zeile. Nichts fällt weg, nichts kommt
hinzu.

| # | Was | Art | Aufwand | Ersparnis | Blockiert durch | Warum hier |
|---|---|---|---|---|---|---|

- **`#`** ist die Umsetzungsreihenfolge. Sie muss begründet sein (letzte Spalte).
- **`Art`** kommt aus der Landkarte: `kruecke_entfernen` · `schritt_automatisieren` ·
  `prozess_ordnen`. Nicht umdeuten.
- **`Blockiert durch`** aus `blockiert_durch`. Eine Position, die auf eine andere wartet,
  steht **nicht** vor ihr — eine Reihenfolge, die ihre eigenen Abhängigkeiten verletzt, ist
  keine.
- **`nicht_angefasst`** der Landkarte wird ein **eigener, benannter Block** unter der
  Tabelle, mit Grund je Prozess. Was still wegfallen kann, muss ausdrücklich
  behauptet werden.

---

# ② Ersparnis und Aufwand — Verbot und Ausweg in einem Satz

**Das ist die zentrale Versuchung dieses Skills, und deshalb steht hier beides zusammen
statt in zwei Abschnitten.**

> **Für jede Position gilt: liegt in der Landkarte eine Ersparnis mit
> `status: "gemessen"`, schreibst du sie hin; liegt keine vor, schreibst du
> `nicht_erhoben` UND in dieselbe Zeile die Messanweisung, die vor einer Zusage fällig
> ist — welche Zahl, woher, und was sie entscheidet. Eine Zahl zu erfinden ist verboten,
> die Zeile leer zu lassen auch.**

Dieselbe Regel für den **Aufwand**:

> **Liegt kein gemessener Aufwand vor — und er liegt nie vor, die Landkarte führt kein
> Aufwandsfeld —, schreibst du eine Spanne in Umsetzungsschritten statt in Stunden
> („ein n8n-Workflow mit zwei Knoten" / „Formular plus Weiterleitung plus Ablage") UND
> die Messanweisung, was den Aufwand entscheidet. Eine Stundenzahl ohne Messung ist
> dieselbe Erfindung wie eine Euro-Ersparnis ohne Messung.**

**Warum beides in einem Satz steht:** weil das Verbot allein die naheliegende Antwort nicht
ersetzt. Wer nur „erfinde keine Ersparnis" liest, lässt die Spalte leer oder schreibt
trotzdem eine Zahl hin — die erlaubte Form muss im selben Atemzug dastehen, sonst ist sie
eine Fußnote in einem anderen Abschnitt. Am 20.10.2026 gemessen: das Kriterium, dessen
Verbot und erlaubte Form **in einer Zeile** standen (`ersparnis` ist `gemessen` oder
`nicht_erhoben` — nie `geschaetzt`), trennte 3:0 gegen 0:3. Die beiden Kriterien, deren
Anleitung über zwei Abschnitte verteilt war, trennten nur 1:2 und 2:1.

**Verboten, egal wie es formuliert ist:** „spart ca. X Stunden" · „Einsparpotenzial X %" ·
„Amortisation in X Monaten" · „erfahrungsgemäß" · „Branchendurchschnitt" · eine ROI-Spalte
über Feldern, die `nicht_erhoben` sind.

**Erlaubt und erwünscht:** eine Aussage über **Größenordnung ohne Zahl** („der größte Hebel
liegt beim Angebot, weil der Inhaber es abends schreibt — Zitat in der Landkarte") · ein
**bedingter** Satz („sobald die Dauer je Angebot gemessen ist, lässt sich die Ersparnis
rechnen") · ein ausdrücklich als **Rechenbeispiel** gekennzeichneter Platzhalter mit `___`.

---

# ③ Die Reihenfolge — begründet, nicht gerechnet

Ohne gemessene Ersparnis kann die Reihenfolge **nicht** aus einer Rechnung kommen. Sie
kommt aus der Landkarte, und der Maßstab wird genannt:

1. **Krücken zuerst**, wenn `entfernt` benannt ist — sie entfernen Arbeit, statt sie zu
   verschieben.
2. **`schmerzgrad` und Inhaberzitat** aus dem Ist-Zustand, wo die Landkarte sie
   durchgereicht hat.
3. **Abhängigkeiten** aus `blockiert_durch`.
4. **Rang und `rang_begruendung`** der Landkarte — wenn du davon abweichst, sagst du warum.

**Der Maßstab steht in der letzten Tabellenspalte, nicht in einer Fußnote.** Und wenn er
„Reihenfolge nach Einschätzung, nicht nach Rechnung" lautet, ist das die richtige Antwort
und keine Entschuldigung.

---

# ④ Die Übergabe nach vorn

Das Backlog ist die Eingabe für die **n8n-Umsetzung**. Was die braucht und was du deshalb
je Position mitgibst:

- **Auslöser** — was den Ablauf startet (Formular, E-Mail, Zeitplan, Webhook).
- **Beteiligte Systeme** aus `systeme` des Ist-Zustands, durch die Landkarte gereicht.
- **Was am Ende anders ist** — ein prüfbarer Satz, kein Ziel.

⚠ **Punkt ③ der Fertigstellungsgrenze ist hier aufgeschoben, mit benannter Bedingung:**
dieser Skill wird an echter Erzeuger-Ausgabe gemessen (er liest `prozesslandkarte.json` und
bricht bei ungültiger Eingabe ab — das ist messbar und wird gemessen). Dass **seine eigene**
Ausgabe von einem Verbraucher angenommen wird, ist erst prüfbar, **sobald `n8n-Umsetzung`
als Skill existiert.** Bis dahin ist der Punkt offen und wird nicht als erfüllt geführt.
Das ist eine Bedingung, kein Mangel — und kein Grund, ein Format zu erfinden, das noch
niemand liest.

---

# ⑤ Die Protokollzeile am Ende

**Eine Zeile, immer, als letzte Zeile deiner Antwort:**

```
KENNZAHL: {"datum":"2026-10-21","skill":"automatisierungs-backlog","positionen":6,"kruecken":1,"mit_messanweisung":6,"ersparnis_gemessen":0,"nicht_angefasst":4,"geprueft":"pruefer","landkarte_gueltig":true}
```

`mit_messanweisung` ist die Zahl der Positionen, bei denen eine Messanweisung dasteht, weil
keine gemessene Ersparnis vorlag. **Bei einer Landkarte ohne gemessene Zahlen muss
`mit_messanweisung` gleich `positionen` sein** — jede andere Kombination heißt, dass
irgendwo eine Zahl steht, die nicht gemessen ist, oder eine Zeile leer blieb.

Sie wird an `kennzahlen/lieferkette.jsonl` **angehängt, nie ersetzt**, wo ein beschreibbarer
Pfad existiert. **Ein gescheiterter Schreibversuch steht IN der Zeile**
(`"jsonl":"kein kennzahlen-Verzeichnis gefunden"`), nicht im Schweigen — im Eval-Sandkasten
gibt es den Pfad nicht, und eine Kennzahl, die nur in einer Datei lebt, fehlt dann unbemerkt.
