---
name: uebergabe-schulung
description: >-
  Übergibt eine fertige n8n-Umsetzung an den Handwerksbetrieb und schult ihn darauf —
  der fünfte Schritt der Lieferkette, direkt nach n8n-umsetzung und vor dem
  Wirksamkeitsnachweis. Auslösen bei Übergabe, Schulung, Einweisung, Abnahme,
  Handover, Dokumentation für den Betrieb, Betriebsanleitung, "wer macht das jetzt",
  "wie übergeben wir das", "der Kunde muss das selbst können", Verantwortung,
  Zuständigkeit, Störung, Notfall, Rufbereitschaft, Betriebsübergang. Prüft die
  Eingabe mit pruefe-kennzahl.mjs und BRICHT AB, wenn sie ungültig ist. Nennt je
  Workflow einen verantwortlichen Menschen im Betrieb, was bei Störung zu tun ist,
  und was der Wirksamkeitsnachweis beweisen kann und was nicht.
---

# Übergabe und Schulung

Du machst aus einer fertigen n8n-Umsetzung etwas, das **der Betrieb ohne uns betreiben
kann** — und sagst, wer danach wofür zuständig ist.

**Der Betrieb ist ein inhabergeführter Handwerksbetrieb.** Niemand dort heißt „DevOps".
Die Schulung richtet sich an den Inhaber, das Büro und die Monteure, nicht an eine
IT-Abteilung.

---

# ⓿ ZUERST: die Eingabe prüfen — und bei ungültiger Eingabe ABBRECHEN

```bash
# Prüfer suchen — der relative Pfad löst nicht zuverlässig auf
find . -name "pruefe-kennzahl.mjs" -not -path "*/node_modules/*" 2>/dev/null
node <gefundener-pfad> <n8n-antwort.md> n8n-umsetzung
```

Exit 0 heißt: die Kennzahl-Zeile ist schlüssig. Exit 1 heißt ungültig mit benannten
Problemen. Exit 3 heißt, es konnte nicht geprüft werden — **und das ist kein „in Ordnung".**

**Ist die Eingabe ungültig → ABBRECHEN.** Keine Übergabe, keine Schulungsunterlage, kein
Entwurf. **Stattdessen:** die Probleme wörtlich wiedergeben, sagen dass `n8n-umsetzung`
sie korrigieren muss, und nichts weiter.

**Du reparierst die Eingabe NICHT.** **Verboten ist das Angebot, die Kennzahl selbst
richtigzustellen und dann weiterzumachen** — **erlaubt und richtig ist der eine Satz:
welches Feld das Problem trägt, und dass `n8n-umsetzung` es nachziehen muss.**

Ist zusätzlich ein Workflow-JSON beigelegt, such `check_workflow.py` und lass es laufen.
**Erlaubt ist `"geprueft": "von_hand"` plus der gesuchte Pfad; verboten ist `"skript"`
ohne gelaufenes Skript** — es liegt in einem fremden Plugin und ist nicht überall da
(gemessen 23.10.2026: im Eval-Sandkasten nicht erreichbar).

---

# ① Wer ist zuständig — ein Mensch, keine Rolle

**Je Workflow genau ein verantwortlicher Mensch im Betrieb**, mit Namen oder mit der
Funktion, die eine Person ist („der Inhaber", „die Bürokraft im Vorzimmer"). Nicht „das
Büro", nicht „der Betrieb", nicht „IT".

> **Steht in der Eingabe ein Name oder eine eindeutige Funktion, schreibst du sie hin;
> steht keiner, schreibst du `nicht_benannt` UND in dieselbe Zeile den Satz, dass die
> Übergabe ohne diese Festlegung nicht abgeschlossen ist. Eine Zuständigkeit zu erfinden
> ist verboten, die Zeile leer zu lassen auch.**

**WARUM EIN MENSCH UND KEINE ROLLE:** eine Automatisierung, für die niemand zuständig ist,
läuft bis zum ersten Fehler und dann nicht mehr. In einem Betrieb mit acht Leuten ist „das
Büro" keine Zuständigkeit, sondern eine Hoffnung.

---

# ② Was der Betrieb können muss, ohne uns

Je Workflow **drei** Handgriffe, als Anleitung, die der Betrieb ausführt — nicht als
Beschreibung, die er liest:

1. **Anhalten.** Wo klickt man, damit der Workflow aufhört? (In n8n: der Schalter am
   Workflow, nicht das Löschen.)
2. **Nachsehen, ob er gelaufen ist.** Wo steht die letzte Ausführung, und woran erkennt
   man einen Fehlschlag?
3. **Wieder anschalten.** Und was vorher zu prüfen ist.

**Ohne diese drei ist die Übergabe keine Übergabe, sondern eine Vorführung.**

---

# ③ Der Störungsfall — vorher aufgeschrieben, nicht im Ernstfall erfunden

Je Workflow:

| Was ausfällt | Woran der Betrieb es merkt | Was er dann tut | Wen er anruft |
|---|---|---|---|

- **„Woran er es merkt"** darf nicht „in n8n nachsehen" sein, wenn niemand dort nachsieht.
  Der Betrieb merkt es daran, dass die Stundenzettel wieder im Ordner liegen.
- **„Was er dann tut"** ist der Rückfallweg: der Ablauf von Hand, wie vorher. Ein
  Rückfallweg, der nicht benannt ist, existiert im Ernstfall nicht.
- **„Wen er anruft"** ist ein Mensch mit Nummer oder ausdrücklich „niemand, der Rückfall
  reicht".

---

# ④ Was der Wirksamkeitsnachweis kann — und was nicht

Die Eingabe führt je Position eine Spalte **Vorher-Wert**. Lies sie und reiche sie weiter,
**ohne sie zu beschönigen**:

> **Steht dort ein gemessener Wert, sag welchen Vergleich der Nachweis später erlaubt;
> steht `nicht_erhoben`, sag für diese Position ausdrücklich, dass der Nachweis nichts
> beweisen kann. Es zu umschreiben ist verboten — „wir werden sehen, ob es hilft" ist
> keine Aussage über Beweisbarkeit.**

**Und wenn noch nichts aktiviert ist, ist jetzt der letzte Zeitpunkt, den Vorher-Wert zu
erheben.** Sag das, mit der konkreten Messung aus dem Messplan. Nach der Aktivierung ist
die Gelegenheit weg, und zwar endgültig.

---

# ⑤ Die Abnahme

Die Übergabe endet mit einer **Abnahme durch den Betrieb**, nicht mit dem Versenden der
Unterlage. Was abgenommen wird, steht als Liste da: je Workflow die drei Handgriffe
vorgeführt, der Verantwortliche benannt, der Störungsfall gelesen.

**Keine Abnahme ohne die drei Handgriffe am echten System.** Eine Unterschrift unter eine
Anleitung, die niemand ausprobiert hat, ist eine Quittung, kein Nachweis.

⚠ **Punkt ③ der Fertigstellungsgrenze zeigt vorwärts auf `wirksamkeitsnachweis`** und ist
mit benannter Bedingung aufgeschoben. Die Gegenrichtung ist eingelöst: dieser Skill liest
echte `n8n-umsetzung`-Ausgabe und weist eine ungültige ab.

---

# ⑥ Die Protokollzeile am Ende

**Eine Zeile, immer, als letzte Zeile deiner Antwort:**

```
KENNZAHL: {"datum":"2026-10-24","skill":"uebergabe-schulung","workflows":1,"mit_verantwortlichem":1,"verantwortlich_nicht_benannt":0,"handgriffe_je_workflow":3,"stoerungsfaelle":1,"vorher_wert_gemessen":0,"vorher_wert_nicht_erhoben":1,"abnahme":"offen","geprueft":"von_hand","eingabe_gueltig":true}
```

- **`mit_verantwortlichem` + `verantwortlich_nicht_benannt` muss gleich `workflows` sein** —
  jede andere Kombination heißt, dass eine Zeile leer blieb.
- **`abnahme`** ist `offen` oder `erfolgt`. `erfolgt` nur, wenn sie wirklich stattgefunden
  hat — eine geplante Abnahme ist `offen`.
- **`geprueft`** ist `skript` oder `von_hand`, nach demselben Maßstab wie in Glied 4.

Angehängt an `kennzahlen/lieferkette.jsonl`, **nie ersetzt**, wo ein beschreibbarer Pfad
existiert. **Ein gescheiterter Schreibversuch steht IN der Zeile**, nicht im Schweigen.
