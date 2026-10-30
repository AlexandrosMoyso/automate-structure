---
name: wirksamkeitsnachweis
description: >-
  Weist nach, ob eine ausgelieferte n8n-Automatisierung wirklich etwas geändert hat —
  das sechste und letzte Glied der Lieferkette, direkt nach uebergabe-schulung.
  Auslösen bei Wirksamkeit, Nachweis, Erfolgsmessung, Nachher-Wert, Vorher-Nachher,
  ROI, Ersparnis belegen, "hat es sich gelohnt", "was hat es gebracht", Abschluss-
  bericht, Bilanz, Rückblick, Kontrolle nach der Einführung, Nachmessung. Prüft die
  Eingabe mit pruefe-kennzahl.mjs und BRICHT AB, wenn sie ungültig ist. Trennt
  Differenzaussagen (brauchen einen gemessenen Vorher-Wert) von Zustandsaussagen
  (brauchen keinen) und erklärt nur das für unbeweisbar, was wirklich unbeweisbar
  ist. Rettet den Vorher-Wert, solange noch nichts aktiv ist.
---

# Wirksamkeitsnachweis

Du beantwortest eine Frage, die der Betrieb stellen wird: **hat es etwas gebracht?**

Und du beantwortest sie **so ehrlich, wie die Datenlage es erlaubt** — nicht ehrlicher
und nicht optimistischer.

---

# ⓿ ZUERST: die Eingabe prüfen — und bei ungültiger Eingabe ABBRECHEN

```bash
# Prüfer suchen — der relative Pfad löst nicht zuverlässig auf
find . -name "pruefe-kennzahl.mjs" -not -path "*/node_modules/*" 2>/dev/null
node <gefundener-pfad> <uebergabe.md> uebergabe-schulung
```

Exit 0 heißt: die Kennzahl-Zeile ist schlüssig. Exit 1 heißt ungültig mit benannten
Problemen. Exit 3 heißt, es konnte nicht geprüft werden — **und das ist kein „in Ordnung".**

**Ist die Eingabe ungültig → ABBRECHEN.** Kein Nachweis, kein Bericht, keine Bilanz, kein
Entwurf und keine „vorläufige Einschätzung". **Stattdessen:** die Probleme wörtlich
wiedergeben, sagen dass `uebergabe-schulung` sie korrigieren muss, und nichts weiter.

**Du reparierst die Eingabe NICHT.** **Verboten ist das Angebot, die Kennzahl selbst
richtigzustellen und dann weiterzumachen** — **erlaubt und richtig ist der eine Satz:
welches Feld das Problem trägt, und dass `uebergabe-schulung` es nachziehen muss.**

**Und sag, womit du geprüft hast.** Welcher Pfad, welcher Exit-Code. Hast du den Prüfer
nicht gefunden, steht das da — mit den Orten, an denen du gesucht hast. **Schweigen über
den eigenen Prüfweg ist der Fehler, nicht die Handprüfung.**

## ⓿b Eine Regel, die der Prüfer NICHT entscheiden kann — und die trotzdem gilt

**`abnahme: "erfolgt"` ist ungültig, solange die Übergabe selbst sagt, dass der Workflow
nicht importiert und nicht mit Testdaten gelaufen ist** (`active: false`).

**Der Grund steht in Glied 5, Abschnitt ⑤:** *„Keine Abnahme ohne die drei Handgriffe am
echten System. Eine Unterschrift unter eine Anleitung, die niemand ausprobiert hat, ist
eine Quittung, kein Nachweis."* Die drei Handgriffe sind Anhalten, Nachsehen und Wieder
anschalten — **am echten System**. An einem Workflow, der nie importiert wurde, kann
niemand sie vorgeführt bekommen. Eine Unterschrift kann vorliegen; eine Abnahme nicht.

⚠ **`pruefe-kennzahl.mjs` meldet hier Exit 0**, und das ist kein Fehler des Prüfers: die
Kennzahl-Zeile von Glied 5 führt kein Feld für „importiert" oder „aktiv". Die Widerlegung
steht im **Prosatext**, nicht in der Zeile — also kann sie kein Skript ausrechnen. **Exit
0 ist deshalb keine Freigabe**, wenn diese Regel verletzt ist.

**Dann gilt derselbe Abbruch wie oben:** kein Nachweis, kein Bericht, keine Bilanz. Den
Widerspruch benennen — unterschriebene Abnahme gegen nie importierten Workflow — und
sagen, dass `uebergabe-schulung` die Abnahme auf `offen` zurücksetzen muss, bis die drei
Handgriffe am echten System vorgeführt sind.

---

# ① Drei Sorten von Aussagen — und nur eine braucht einen Vorher-Wert

**Das ist der Kern dieses Skills.** Wer sie nicht trennt, erklärt einen Nachweis für
unmöglich, der zur Hälfte möglich ist.

**① Differenzaussage** — „das Abtippen dauert jetzt 40 statt 240 Minuten".
Braucht **zwingend** einen gemessenen Vorher-Wert. Fehlt er, ist die Aussage
**unbeweisbar**, und zwar endgültig.

**② Zustandsaussage** — „am Freitag liegt kein Stundenzettel mehr im Sammelordner".
Braucht **keinen** Vorher-Wert. Man geht hin und zählt. Null oder nicht null.
**Diese Aussage ist beweisbar, auch wenn nie etwas gemessen wurde.**

**③ Vollständigkeitsaussage** — „zu jeder Datei in `eingang/` gibt es eine in
`bestaetigt/`". Braucht keinen Vorher-Wert, nur den heutigen Bestand. Beweist, dass der
Ablauf **durchläuft** und nicht in der Mitte versandet.

> **PFLICHT, je Position: du nennst mindestens eine Zustands- oder
> Vollständigkeitsaussage mit der konkreten Prüfung dazu (wo man nachsieht, was man
> zählt, was das Ergebnis bedeutet) — ODER du begründest, warum es bei dieser Position
> keine gibt. Und für die Differenzaussage sagst du beim Wort „unbeweisbar", wenn der
> Vorher-Wert fehlt.**
>
> **„Der Nachweis kann nichts beweisen" ist nur dann richtig, wenn AUCH keine
> Zustands- und keine Vollständigkeitsaussage möglich ist.** Das ist selten. Es
> vorschnell zu sagen ist derselbe Fehler wie eine erfundene Ersparnis, nur in die
> andere Richtung: beides spart die Arbeit, hinzusehen.

**WARUM DAS HIER STEHT:** die Eingabe aus Glied 5 sagt in der Regel „ohne Vorher-Wert
kann der Nachweis nichts beweisen", und das ist für die **Zeitersparnis** richtig. Für
das **verschwundene Papier** ist es falsch. Wer den Satz übernimmt, übernimmt ihn eine
Stufe zu breit.

---

# ② Rekonstruktion: was noch zu retten ist

**Steht die Automatisierung noch auf `active: false`, ist der Vorher-Wert NICHT verloren.**
Dann ist dies der Bericht, der ihn rettet:

- **Welche Messung, konkret.** Nicht „die Zeit erfassen", sondern: Freitag vor dem
  Abtippen die Zettel im Ordner zählen, Beginn und Ende auf die Minute mitschreiben,
  zwei Freitage hintereinander.
- **Wer sie macht.** Ein Mensch, der heute schon dort sitzt.
- **Dass sie VOR der Aktivierung passiert**, und dass die Gelegenheit danach endgültig
  weg ist.

**Ist schon aktiviert und wurde nichts gemessen**, suchst du nach Spuren, die es noch
gibt: der alte Ordner samt Inhalt, Mails mit Zeitstempeln, Kalendereinträge, die
Rechnungsstellung. **Findest du eine Spur, sag was sie hergibt und was nicht.**
**Findest du keine, erklärst du die Differenzaussage ausdrücklich für unbeweisbar** — und
gehst zu den Zustandsaussagen aus ①, denn die gehen weiterhin.

**Verboten:** eine Zahl, die nicht gemessen wurde, als Vorher-Wert behandeln. Die
„240 Minuten" aus dem Backlog sind **angesetzt**, nicht gemessen. Wer sie als Vorher-Wert
nimmt, rechnet eine Ersparnis gegen eine Schätzung — und das Ergebnis ist eine Zahl mit
der Anmutung einer Messung. **Das ist die Lüge, die dieses Glied verhindern soll.**

---

# ③ Der Nachher-Wert braucht einen Zeitpunkt

Ohne Stichtag ist „wir messen nach" eine Absicht. Also:

- **Wann** gemessen wird (ein Datum, nicht „nach ein paar Wochen").
- **Woran erkennbar ist, dass es zu früh ist.** Vier Wochen nach der Aktivierung hat der
  Betrieb den neuen Ablauf noch nicht als Gewohnheit — eine Messung in der Umstellzeit
  misst die Umstellung, nicht den Zustand.
- **Was passiert, wenn das Ergebnis schlecht ist.** Ein Nachweis, der nur gut ausgehen
  kann, ist kein Nachweis.

---

# ④ Der Kreis: was zurück in die Landkarte geht

Dieses Glied ist das letzte **und** der Eingang zum nächsten Durchgang. Am Ende gehört
dazu, was `prozesslandkarte` beim nächsten Mal anders aufschreiben muss:

- **Welcher Prozess einen neuen Ist-Zustand hat** — der Ablauf ist nicht mehr der von
  der Aufnahme.
- **Welche Positionen blockiert geblieben sind, und woran.**
- **Welche Annahme sich als falsch erwiesen hat.** Das ist der wertvollste Teil und der,
  der am leichtesten verschwindet.

**Das ist ausdrücklich keine neue Landkarte.** Du schreibst die Übergabe, nicht den
nächsten Durchgang.

---

# ⑤ Die Protokollzeile am Ende

**Eine Zeile, immer, als letzte Zeile deiner Antwort:**

```
KENNZAHL: {"datum":"2026-10-28","skill":"wirksamkeitsnachweis","positionen":3,"aktiviert":false,"nachweis":"vorbereitet","zustandsaussagen":1,"differenzaussagen_beweisbar":0,"differenzaussagen_unbeweisbar":1,"vorher_wert_noch_messbar":1,"vorher_wert_verloren":0,"geprueft":"von_hand","eingabe_gueltig":true}
```

- **`nachweis`** ist `gefuehrt`, `vorbereitet` oder `nicht_moeglich`.
  **`gefuehrt` setzt `aktiviert: true` voraus** — wo nichts läuft, kann nichts nachgemessen
  worden sein.
- **`nicht_moeglich` verträgt sich nicht mit `zustandsaussagen > 0`.** Ist eine
  Zustandsaussage möglich, ist der Nachweis nicht unmöglich, sondern teilweise möglich.
- **`differenzaussagen_beweisbar > 0` setzt `aktiviert: true` voraus** — eine Differenz
  braucht beide Seiten.
- **`geprueft`** ist `skript` oder `von_hand`, nach demselben Maßstab wie in Glied 4 und 5.

Angehängt an `kennzahlen/lieferkette.jsonl`, **nie ersetzt**, wo ein beschreibbarer Pfad
existiert. **Ein gescheiterter Schreibversuch steht IN der Zeile**, nicht im Schweigen.
