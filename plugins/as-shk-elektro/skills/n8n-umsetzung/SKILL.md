---
name: n8n-umsetzung
description: >-
  Macht aus einem geprüften Automatisierungs-Backlog importierbares n8n-Workflow-JSON —
  der vierte Schritt der Lieferkette, direkt nach automatisierungs-backlog und vor
  Übergabe/Schulung. Auslösen bei n8n, Workflow bauen, Automatisierung umsetzen,
  Workflow-JSON, Node, Trigger, Webhook, Zeitplan, Import, "setz das in n8n um",
  "bau mir den Workflow", "automatisiere das jetzt", Staging, Aktivierung,
  Wirksamkeitsnachweis. Prüft den Backlog mit pruefe-backlog-antwort.mjs und BRICHT AB,
  wenn er ungültig ist. Hält drei Zustände auseinander — strukturell geprüft, importiert,
  mit Testdaten ausgeführt — und behauptet nie den nächsten, wenn nur der erste gilt.
  Schreibt nie direkt auf eine laufende Kundeninstanz.
---

# n8n-Umsetzung

Du machst aus einem **geprüften Backlog** importierbares Workflow-JSON und eine Zuordnung,
die sagt, welcher Workflow welche Backlog-Position umsetzt — und was danach **messbar**
anders ist.

---

# ⓿ ZUERST: den Backlog prüfen — und bei ungültigem Backlog ABBRECHEN

**Das ist der erste Schritt, nicht der letzte.** Ein Workflow auf einem Backlog mit
erfundenen Zahlen baut die Erfindung in ein laufendes System ein.

```bash
# Prüfer suchen — der relative Pfad löst nicht zuverlässig auf
find . -name "pruefe-backlog-antwort.mjs" -not -path "*/node_modules/*" 2>/dev/null
# dann, mit der Landkarte als Erlaubnisliste und dem Ist-Zustand, falls er beiliegt
node <gefundener-pfad> <backlog.md> <prozesslandkarte.json> [<ist-zustand.json>]
```

Exit 0 heißt: keine erfundene Zahl, `KENNZAHL`-Zeile schlüssig. Exit 1 heißt ungültig mit
benannten Fundstellen. Exit 3 heißt, es konnte nicht geprüft werden — **und das ist kein
„in Ordnung".**

**Ist der Backlog ungültig → ABBRECHEN.** Kein Workflow, kein Entwurf, keine „vorläufige
Fassung unter Vorbehalt". **Stattdessen:** die Fundstellen wörtlich wiedergeben, sagen dass
`automatisierungs-backlog` sie korrigieren muss, und nichts weiter.

**Du reparierst den Backlog NICHT.** **Verboten ist das Angebot, die erfundene Zahl selbst
zu ersetzen und dann weiterzubauen** — **erlaubt und richtig ist der eine Satz: welche
Zeile den Fund trägt, und dass der Backlog sie nachziehen muss.**

---

# ① Das Workflow-JSON — und wer über seine Gültigkeit entscheidet

**Es gibt kein eigenes Schema und keinen eigenen Prüfer dafür. Das ist entschieden, nicht
abzuwägen.** `n8n-workflow-check` bringt seinen eigenen mit (Konvention 18: sieh nach, ob
der Gegenstand die Prüfung mitbringt).

```bash
# Prüfer suchen, nicht den Pfad raten — er liegt in einem ANDEREN Plugin
find ~/.claude/plugins -name "check_workflow.py" -path "*n8n*" 2>/dev/null
python3 -I <gefundener-pfad> <workflow.json>
```

Er liefert `{"structurally_valid": …, "errors": […], "runtime_verified": false}` mit
Exit 0/1 und prüft: Knoten-Identitäten, doppelte Namen, `type` und `typeVersion`,
`parameters`, **Credential-Bindungen** (müssen aus einem teilbaren Beispiel entfernt sein),
unbekannte Verbindungsziele, `active: false`, eingebettete Geheimnisse.

**Was er ausdrücklich NICHT beweist** — sein eigener Text, nicht meine Einschätzung:
„it does not prove n8n node compatibility, safe JavaScript or absence of all secrets".

## Wenn der Prüfer nicht erreichbar ist

**Dann sagst du das, und zwar in der Antwort — nicht im Stillen.** **Erlaubt ist
`"geprueft": "von_hand"` plus der Satz, welchen Pfad du gesucht und nicht gefunden hast;
verboten ist `"geprueft": "skript"` ohne gelaufenes Skript** — denn „geprüft" und „nicht
geprüft" sehen in einem fertigen JSON gleich aus.

⚠ **Gemessen am 23.10.2026:** im Eval-Sandkasten ist dieser Prüfer **nicht** erreichbar.
Das HOME des Kindes enthält nur `.git`, `.gitconfig` und `cwd` — kein `.claude`, kein
`plugins`. Das plugin-**eigene** `schema/` kommt mit, ein fremdes Plugin nicht. Im Eval
wird also der Handprüf-Zweig gemessen; der Skript-Zweig braucht einen Beweis außerhalb des
Evals.

---

# ② Die Zuordnung — welcher Workflow setzt welche Position um

Eine Zeile je Backlog-Position. Nichts fällt weg, nichts kommt hinzu.

| Position | Workflow | Auslöser | Systeme | **Vorher-Wert, gemessen vor Aktivierung** | Was danach messbar anders ist |
|---|---|---|---|---|---|

**Die fünfte Spalte ist Pflicht und trägt den Status-Mantel** — `{wert, status, quelle}` mit
`status` aus `gemessen` · `nicht_erhoben`:

> **Liegt ein vor der Aktivierung gemessener Wert vor, schreibst du ihn hin; liegt keiner
> vor, schreibst du `nicht_erhoben` UND in dieselbe Zeile den Satz, dass der
> Wirksamkeitsnachweis für diese Position nichts beweisen kann. Aktivieren ohne Vorher-Wert
> ist erlaubt — es stillschweigend zu tun ist es nicht, und einen Vorher-Wert zu erfinden
> auch nicht.**

**WARUM BEIDES IN EINEM SATZ STEHT:** ohne Vorher-Wert ist jeder spätere
Wirksamkeitsnachweis eine Behauptung mit Zeitstempel. Das Verbot allein („erfinde keinen
Vorher-Wert") lässt die Spalte leer, und eine leere Spalte sieht wie ein Versäumnis aus,
nicht wie eine Aussage. Der Ausweg muss im selben Atemzug dastehen.

<!-- DRITTER PROSPEKTIVER ANSATZ DER EIN-SATZ-HYPOTHESE, vor dem Lauf aufgeschrieben:
     Die Hypothese lautet, dass Verbot und erlaubte Form in EINEM Satz besser trennen als
     über zwei Abschnitte verteilt.
       1. Ansatz (prozesslandkarte, 20.10.): verteilt -> 3:0/1:2 und 3:0/2:1, teilweise.
          Zusammengeführt beim ersparnis-Feld -> 3:0/0:3.
       2. Ansatz (automatisierungs-backlog, 21.10.): zusammengeführt -> die erlaubte Form
          (Messanweisung) trennte 3:0/0:3; die Verbotshälfte war nicht messbar, weil der
          Grader nicht messbar war.
       3. Ansatz: DIESER Satz über den Vorher-Wert. Trennt das zugehörige Kriterium
          3:0/0:3, hat die Hypothese drei Skills und zwei saubere Treffer. Trennt es nur
          teilweise, ist sie an einem von drei Skills gescheitert und das ist der Fund. -->

---

# ③ Drei Zustände, die der Kunde verwechselt — und die du nicht verwechseln darfst

| Zustand | Wer entscheidet | In der Kette prüfbar? |
|---|---|---|
| **strukturell geprüft** | `check_workflow.py`, Exit 0 | **ja** |
| **importiert** | n8n, der Workflow ist angelegt | nein |
| **mit Testdaten ausgeführt** | ein Lauf in einer Wegwerf-Instanz | nein |

**Nur der erste ist in dieser Kette prüfbar.** Deshalb:

> **Du sagst „der Workflow läuft" nur, wenn er mit Testdaten gelaufen ist. Gilt nur der
> erste Zustand, lautet der Satz „strukturell geprüft, Ausführung unbelegt" — und das ist
> eine vollständige, richtige Antwort, keine Entschuldigung.**

`runtime_verified: false` kommt aus dem Prüfer selbst. Schreib es nicht auf `true` um.

## Die Reihenfolge ist Dauerregel 4, nicht meine Erfindung

> **„Erst Staging, dann Kunde. Validieren vor deploy. Schreibzugriffe nur mit Freigabe."**

Daraus folgt für jeden Workflow, in dieser Reihenfolge: **validieren → Staging → Kundeninstanz.**

- **Nie direkt auf eine laufende Kundeninstanz schreiben.** Kein Import, keine Aktivierung,
  kein Überschreiben eines bestehenden Workflows ohne ausdrückliche Freigabe für genau
  diesen Schritt.
- **`active: false` bleibt**, bis der Betrieb die Aktivierung verlangt. Produktions-Webhooks
  und Zeitpläne bleiben inaktiv.
- **Tests gehören in eine Wegwerf-Instanz ohne Produktionszugangsdaten.** Nicht in die
  bestehende Datenbank des Kunden, und nichts darin wird zurückgesetzt.
- **Zugangsdaten bleiben in der n8n-Instanz des Kunden.** Keine Keys ins JSON, keine
  `Authorization`-Werte, keine Bitte an den Kunden, einen Key in den Chat zu schreiben
  (Dauerregel 2: Kundendaten nie über Fremd-Clouds).

---

# ④ Die Übergabe nach vorn

Für `Übergabe/Schulung` und den `Wirksamkeitsnachweis` gibst du je Workflow mit:
Zieldatei, n8n-Zielfassung, benötigte Credential-Bindungen (als Namen, nicht als Werte),
Auslöserzustand, ein repräsentatives Eingabe/Ausgabe-Paar, **und welche Prüfungen
tatsächlich gelaufen sind** — nicht, welche vorgesehen waren.

⚠ **Punkt ③ der Fertigstellungsgrenze ist aufgeschoben, mit benannter Bedingung:** dass
*diese* Ausgabe von einem Verbraucher angenommen wird, ist erst prüfbar, sobald
`uebergabe-schulung` als Skill existiert. Die Gegenrichtung ist eingelöst — dieser Skill
liest echte Backlog-Ausgabe und weist eine ungültige ab.

---

# ⑤ Die Protokollzeile am Ende

**Eine Zeile, immer, als letzte Zeile deiner Antwort:**

```
KENNZAHL: {"datum":"2026-10-23","skill":"n8n-umsetzung","workflows":3,"positionen":3,"mit_vorher_wert":0,"vorher_wert_nicht_erhoben":3,"geprueft":"von_hand","strukturell_gueltig":null,"importiert":false,"mit_testdaten_ausgefuehrt":false,"backlog_gueltig":true}
```

- **`geprueft`** ist `skript` oder `von_hand`. `skript` nur, wenn `check_workflow.py`
  wirklich gelaufen ist.
- **`strukturell_gueltig`** ist `true`/`false` nach dem Skript — oder **`null`**, wenn es
  nicht erreichbar war. `null` ist die ehrliche Antwort; `true` ohne Lauf ist eine Lüge.
- **`importiert`** und **`mit_testdaten_ausgefuehrt`** sind `false`, solange du es nicht
  selbst getan und belegt hast. Das sind die zwei Zustände aus ③.
- **`mit_vorher_wert` + `vorher_wert_nicht_erhoben` muss gleich `positionen` sein** — jede
  andere Kombination heißt, dass eine Zeile leer blieb.

Angehängt an `kennzahlen/lieferkette.jsonl`, **nie ersetzt**, wo ein beschreibbarer Pfad
existiert. **Ein gescheiterter Schreibversuch steht IN der Zeile**, nicht im Schweigen.
