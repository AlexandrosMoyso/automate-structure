---
name: ist-aufnahme
description: >-
  Nimmt in einem inhabergeführten Handwerksbetrieb (SHK, Elektro, Dach, Maler,
  Bau) auf, wie die Abläufe heute wirklich laufen — der erste Schritt vor jeder
  Automatisierung. Auslösen bei Sätzen des Inhabers wie "Wir ersticken in
  Papier", "Ich weiß nicht, wo die Zeit hingeht", "Mein Büro kommt nicht nach",
  "Angebote dauern bei uns zu lange", "Die Monteure schreiben auf Zettel,
  abends tippt das jemand ab", "Wir haben keinen Überblick, was offen ist",
  "bei uns läuft viel über Zuruf", "das weiß nur meine Bürokraft", "wir suchen
  ständig Unterlagen". Ebenso auslösen bei Aufmaß, Regiebericht, Stundenzettel,
  Rapportzettel, Materialliste, Nachtrag, Wartungsvertrag, Bereitschaft,
  Tourenplanung — und bei Ist-Aufnahme, Prozessaufnahme, Bestandsaufnahme,
  Abläufe aufnehmen, Prozessanalyse, Erstgespräch. Deckt Angebot, Terminierung,
  Baustelle, Rückmeldung vom Monteur, Rechnung, Mahnwesen, Büroablauf und die
  eingesetzte Handwerkersoftware (HERO, Craftnote, ToolTime) ab.
metadata:
  category: lieferkette
  version: "1.0.0"
---

# Ist-Aufnahme

Erstes Glied der Lieferkette: `ist-aufnahme` → `prozesslandkarte` →
`automatisierungs-backlog` → `n8n-umsetzung` → `uebergabe-schulung` →
`wirksamkeitsnachweis`. Sechs Glieder.

**Ein Lauf, drei Ergebnisse.** Der Leitfaden begleitet das Gespräch, das Kundendokument
ist das Produkt, der Ist-Zustand ist die Übergabe an den nächsten Skill.

| | für wen | wann |
|---|---|---|
| ① Leitfaden | nur für dich | führt den **nächsten Kontakt** — welchen, entscheidet die Lage |
| ② Kundendokument | der Betrieb | nach dem Termin, als fertiges Dokument |
| ③ `ist-zustand.json` | der nächste Skill, **nie der Kunde** | zusammen mit ②, getrennte Datei |
| ④ Nachfrage-Liste | für dich | wen man außer dem Inhaber noch fragen muss |

**Alle vier entstehen bei jedem Lauf. Ohne Ausnahme.** Was sich an die Lage bindet, ist
allein die **Form** des ersten Ergebnisses — nicht seine Existenz.

## Das Grundgesetz dieses Skills

**Erfinde nichts.** Kein Name, keine Zahl, keine Software, kein Ablauf, der nicht gesagt
wurde. Was fehlt, kommt in die Liste der offenen Punkte — sichtbar, nicht stillschweigend
weggelassen. Ein erfundener Ist-Zustand ist schlimmer als ein lückenhafter: der lückenhafte
wird nachgefragt, der erfundene wird geglaubt.

**Kennzeichne die Quelle.** Drei Stufen, die im Dokument auseinandergehalten werden:

- **gesagt** — jemand hat es berichtet
- **gesehen** — du hast es selbst beobachtet (der Stapel auf dem Schreibtisch, der Ordner)
- **gemessen** — eine Zahl aus einem System oder eine Zählung

„Die Angebote dauern zu lange" ist *gesagt*. „Zwischen Anruf und Angebot liegen im Schnitt
neun Tage" ist *gemessen*. Beides gehört ins Dokument, aber nie als dasselbe.

---

# ① Leitfaden

**Der Leitfaden ist das Werkzeug, das den nächsten Kontakt führt.** Welcher Kontakt das ist,
entscheidet die Lage. **Dass es einen gibt, entscheidet sie nicht** — es gibt nach einer
Ist-Aufnahme immer einen nächsten Kontakt, und er braucht immer ein Werkzeug.

Zwei Formen, dieselbe Bauart: Fragen, in der Reihenfolge, in der sie etwas aufdecken, kurz
genug zum Mitlesen auf einem Blatt. Nie Fließtext, nie eine Liste offener Punkte zum
Abhaken — **etwas, mit dem man telefonieren kann.**

| Lage | Form |
|---|---|
| Der Termin steht noch bevor | **Gesprächsleitfaden** — der Ablauf entlang, dann die sechs Pflichtfragen |
| Ein Protokoll liegt bereits vor | **Nachfass-Leitfaden** — siehe unten |

## Wenn ein Protokoll vorliegt: der Nachfass-Leitfaden

Der Termin war. Ein Gesprächsleitfaden für ihn wäre sinnlos — aber die Aufnahme hat Lücken
und Widersprüche aufgedeckt, und die gehören geklärt, bevor ein Angebot entsteht. Genau das
ist jetzt der Leitfaden.

**Die Fragen sind die im Protokoll aufgedeckten Lücken und Widersprüche**, in der
Reihenfolge, **in der sie das Angebot blockieren** — nicht in der Reihenfolge, in der sie im
Protokoll auftauchten, und nicht nach Themen sortiert.

Die Reihenfolge ergibt sich so:

1. **Was ohne Antwort kein Angebot zulässt.** Ein Prozess, der nur angedeutet ist, lässt
   sich nicht automatisieren und nicht beziffern.
2. **Widersprüche.** Zwei Aussagen, die beide nicht stimmen können, machen jede darauf
   gebaute Zahl wertlos. Frag sie ohne Vorwurf: „Sie sagten X, an anderer Stelle Y — was
   davon ist der Alltag?"
3. **Fehlende Zahlen**, die eine Ersparnis beziffern sollen. Ohne sie steht im Backlog eine
   Behauptung statt eines Nutzens.
4. **Namen ohne Rolle und Rollen ohne Namen.** Wer macht es, und was passiert, wenn er
   ausfällt.

Jede Frage bekommt einen Satz dazu, **warum** sie gestellt wird — damit das Telefonat nicht
wie ein Verhör klingt, sondern wie jemand, der etwas Bestimmtes bauen will.

Form: höchstens eine Seite, die wichtigste Frage oben. Wer zwanzig Fragen mitbringt, bekommt
auf keine eine gute Antwort.

## Wenn der Termin bevorsteht: der Gesprächsleitfaden

Kein Fragebogen zum Abhaken. Die Reihenfolge ist die, in der Fragen etwas aufdecken: erst
den Ablauf entlang, dann dorthin, wo es wehtut, zuletzt die Stellen, über die niemand von
selbst spricht. **Vor dem Termin ausgeben**; während des Gesprächs wird geschrieben, nicht
formuliert.

### Einstieg — den Ablauf abgehen, nicht die Abteilungen

Ein Zwölf-Mann-Betrieb hat keine Abteilungen. Er hat einen Weg, den ein Auftrag nimmt. Geh
diesen Weg ab, vom ersten Anruf bis zum Geld auf dem Konto:

> „Erzählen Sie mir einen ganz normalen Auftrag. Vom Anruf bis zur bezahlten Rechnung.
> Nicht den schwierigsten — einen von letzter Woche."

Dann an jeder Station nachfassen: **Wer macht das? Womit? Und wie lange dauert es?**

Die Stationen, die fast immer vorkommen: Anfrage kommt rein · Termin vor Ort · Aufmaß ·
Angebot · Auftrag · Material bestellen · Tourenplanung · Monteur auf der Baustelle ·
Rückmeldung (Stundenzettel, Regiebericht) · Nachtrag · Rechnung · Mahnwesen ·
Wartungsverträge und Bereitschaft, falls vorhanden.

### Die sieben Pflichtfragen

Diese sechs werden gestellt. Sie decken die Stellen auf, an denen Automatisierung später
tatsächlich greift — jede davon zeigt entweder einen Medienbruch, eine Einzelabhängigkeit
oder eine unsichtbare Warteschlange.

1. **„Wo entsteht bei Ihnen Papier?"**
   Jeder Zettel ist entweder ein Medienbruch oder ein Beleg. Frag nach, welcher von beidem.

2. **„Wo wird bei Ihnen etwas abgetippt, das woanders schon steht?"**
   Die teuerste und unsichtbarste Arbeit im Betrieb. Antworten wie „abends tippt das jemand
   ab" sind die direkteste Automatisierungsspur, die es gibt.

3. **„Wo ruft jemand hinterher?"**
   Hinterhertelefonieren heißt: eine Information kommt nicht von selbst an. Frag, **wem**
   hinterhergerufen wird und **wie oft in der Woche**.

4. **„Was passiert, wenn genau dieser eine krank ist?"**
   Ersetzt die Eskalationsfrage. In einem Betrieb dieser Größe ist nicht die Frage, wer
   verantwortlich ist, sondern was stillsteht, wenn eine Person ausfällt. Stell die Frage
   mit dem Vornamen: „Was passiert, wenn Sabine zwei Wochen ausfällt?"

5. **„Was liegt am Monatsende noch da?"**
   Der Rückstand ist ehrlicher als jede Zufriedenheitsfrage. Nicht geschriebene Rechnungen,
   nicht erfasste Stunden, nicht bearbeitete Nachträge — das ist gestaute Arbeit mit Datum.

6. **„Was macht Ihre Bürokraft, was sonst keiner kann?"**
   Hier liegt das Wissen, das nirgends steht. Oft die wertvollste Antwort des Termins — und
   die, die am seltensten freiwillig kommt.

7. **„Welche Programme laufen bei Ihnen — alle, auch die, an die man nicht denkt?"**
   Nachfassen, bis die Liste vollständig ist: Warenwirtschaft, Kasse, Zeiterfassung, Lohn,
   Buchhaltung, Banking, Mail und Kalender, Dateiablage und Netzlaufwerk, Messenger,
   Branchensoftware, dazu jedes Portal mit eigenem Login. **Dann die Gegenprobe:** „Und
   wo liegen Dateien, die niemand von diesen Programmen kennt?"

   Diese Frage ist am 15.10.2026 aus einem Fehlschlag entstanden. Eine Aufnahme sah vier
   Systeme nicht — Dateiablage, Banking, Office-Paket und Mail —, weil nichts danach fragte
   und sie in keinem beschriebenen Ablauf vorkamen. **Ein System, nach dem niemand fragt,
   taucht nirgends auf; ein Ablauf, der durch ein unsichtbares System läuft, lässt sich
   nicht automatisieren.** Bei Betrieben, die weniger Material mitbringen, ist diese
   Blindheit größer, nicht kleiner.

   Die Antwort gehört vollständig nach `systeme` — auch Systeme, die in keinem einzigen
   Prozess vorkommen. Gerade die sind der Fund.

### Nachfassen mit Zahlen

Eine Antwort ohne Zahl ist eine Stimmung. Frag die Kette nach, bis eine Zahl dasteht, und
**spiegele sie zurück**:

> „Wie oft kommt das in der Woche vor?" — „Und wie lange brauchen Sie dann jedes Mal?" —
> „Also etwa ‹Häufigkeit × Dauer› pro Woche, nur dafür?"

Das Zurückspiegeln ist kein Stilmittel: es ist die Stelle, an der der Inhaber die Zahl
entweder bestätigt oder korrigiert. Beides ist ein Gewinn.

⚠ **Im geschriebenen Leitfaden bleibt die Zahl eine Leerstelle.** Schreib
`„Also etwa ___ Angebote die Woche, je ___ Stunden?"` — nie eine ausgedachte Zahl, auch
nicht als Beispiel. Eine Beispielzahl in einem Leitfaden für **diesen** Betrieb ist für den
Meister am Telefon nicht von einer Behauptung zu unterscheiden, und sie verstößt gegen das
Grundgesetz oben. Die Zahl entsteht im Gespräch, nicht vorher.

> Technik übernommen aus **AKQ AI Sales Masterclass › 1 – Setting Prozess (Erstgespräch) ›
> „Inspiration bei Painfragen"** — dort wird dieselbe Zahlenkette im Verkaufsgespräch
> benutzt („Wie viele neue Termine hattest du letzten Monat? Und im Monat davor? Okay, also
> etwa drei in den letzten zwei Monaten…").

### Worauf du hörst, nicht fragst

> **AKQ AI Foundation › 4) Marktrecherche › „Die richtigen Fragen stellen":** „Achte darauf,
> was emotional rüberkommt, da sitzt meistens der echte Schmerz."

Wo die Stimme lauter wird, wo jemand seufzt, wo vom Thema abgeschweift wird — das ist die
Stelle, die ins Dokument gehört. Notiere den **wörtlichen Satz**, nicht deine Zusammenfassung
davon.

> **AKQ Leadgen – Cold Calling › 9 Tage Cold Calling Ramping › „Customer-Challenging statt
> Bullshit-Bingo":** „Ich will nicht hören, was du für ein Problem hast, sondern ich will
> hören, **wie du dein Problem benennst**."

Das ist der Grund für die wörtlichen Zitate in ②. Ein Betrieb erkennt sich an seinen eigenen
Worten wieder, nicht an deinen.

### Was du NICHT fragst

Keine Reifegrad-Einstufung, keine Rollenmatrix, keine Zufriedenheitsskala von 1 bis 10, keine
Frage nach der „Digitalisierungsstrategie". Wer so fragt, bekommt Antworten für den Berater
statt über den Betrieb.

---

# ② Das Kundendokument

**Maßstab ist Wiedererkennung, nicht Vollständigkeit.** Der Betrieb liest es und sagt: „Ja,
genau so ist es bei uns." Erst danach die drei Stellen, an denen es am meisten wehtut.

## Prüfbares Kriterium

> **Der Meister korrigiert höchstens ZWEI Fakten. Korrigiert er zehn, ist die Aufnahme
> gescheitert** — dann wurde zugehört, aber nicht verstanden, und das Dokument wird neu
> gemacht statt nachgebessert.

Dieses Kriterium wird dem Betrieb **vorher genannt**: „Lesen Sie das durch und sagen Sie mir,
was nicht stimmt." Es ist kein Höflichkeitsritual, sondern die Abnahme dieses Schritts.

**Der Absatz steht wörtlich in der Vorlage unten, direkt unter dem Datum** — er wird von dort
übernommen, nicht aus diesem Abschnitt neu formuliert. Drei Dinge müssen darin vorkommen:
die Aufforderung zum Korrigieren, die **Zahl** als Schwelle, und die **Folge**, wenn sie
überschritten wird. Beim Kürzen fällt erfahrungsgemäß die Folge zuerst weg — und damit das,
was die Schwelle überhaupt verbindlich macht.

Zwei Korrekturen sind normal — ein Name, eine Zahl. Zehn bedeuten, dass der Ablauf im Kern
falsch verstanden wurde, und jedes Glied danach würde auf dem Fehler aufbauen.

## Sprache

Deutsch, Sie-Form. **Vornamen statt Rollen** — „Sabine schreibt die Rechnungen", nicht „die
kaufmännische Sachbearbeitung". Keine Beratungssprache: kein Stakeholder, kein Prozessowner,
kein Schnittstellenmanagement, kein Reifegrad, kein Potenzial. Ein Satz, den der Meister
nicht am Telefon sagen würde, gehört nicht ins Dokument.

Zahlen in Stunden pro Woche, nicht in Prozent. „Spart vier Stunden pro Woche im Büro" statt
„Effizienzsteigerung von 18 %".

## Vorlage — so wird ausgegeben

```markdown
# So läuft es heute bei [Betrieb]

Aufgenommen am [Datum] im Gespräch mit [Vornamen].
Stand: wie Sie es mir beschrieben haben. Was nicht stimmt, streichen Sie bitte an.

**Bitte lesen Sie das gegen.** Ein, zwei Korrekturen sind normal — dann hat die Aufnahme
getroffen. Sind es deutlich mehr, habe ich Ihren Ablauf im Kern falsch verstanden; dann
schreibe ich das Ganze neu, statt daran herumzubessern.

## Ihr Betrieb in fünf Zeilen
[Gewerk, Mitarbeitende draußen/innen, Einsatzgebiet, eingesetzte Software,
 was den Betrieb ausmacht — in den Worten des Inhabers]

## Der Weg eines Auftrags

### 1. [Station, z. B. „Die Anfrage kommt rein"]
**Wer:** [Vorname] · **Womit:** [Telefon, Zettel, HERO, WhatsApp, Excel, im Kopf]
**Wie lange:** [Minuten] · **Wie oft:** [pro Woche]

[Zwei bis vier Sätze, wie es wirklich läuft. Konkret, mit den Details, die nur
 dieser Betrieb hat — der Ordner auf der Fensterbank, der Anruf um 6:30 Uhr.
 Diese Details erzeugen die Wiedererkennung.]

> „[Wörtliches Zitat, wenn eines gefallen ist]"

### 2. […]

## Wo die Arbeit doppelt gemacht wird
| Von | Nach | Was wird übertragen | Wie oft | Minuten je Mal |
|---|---|---|---|---|
| Stundenzettel (Papier) | HERO | Arbeitszeiten | täglich | 25 |

## Wenn einer ausfällt
| Person | Was nur sie oder er kann | Was dann liegen bleibt |
|---|---|---|

## Was am Monatsende noch daliegt
[Konkret, mit Zahl, wenn eine genannt wurde]

## Die drei Stellen, an denen es am meisten wehtut

### 1. [Überschrift in den Worten des Betriebs]
**Was passiert:** […]
**Was es kostet:** [Stunden pro Woche · verlorene Aufträge · Mahnungen · Nachtschichten]
**Woher wir das wissen:** [gesagt | gesehen | gemessen]

### 2. […]
### 3. […]

## Was wir noch nicht wissen
- [Offene Frage, mit Angabe, wer sie beantworten kann]

## Wie es weitergeht
[Ein Absatz. Was der nächste Schritt ist und was er von Ihnen braucht.]
```

## Regeln zur Vorlage

- **Die Vorlage ist ein Gerüst, keine Pflicht.** Stationen, die es im Betrieb nicht gibt,
  fallen weg. Eine leere Überschrift ist schlimmer als keine.
- **Höchstens drei Schmerzstellen.** Wer fünf nennt, hat nicht priorisiert. Die Auswahl
  begründet sich aus Häufigkeit mal Zeitaufwand, nicht aus Lautstärke.
- **Keine Lösungen.** Dieses Dokument beschreibt den Ist-Zustand. Vorschläge kommen in
  `automatisierungs-backlog`, und zwar mit Aufwand und Nutzen. Eine Lösung hier macht den
  Betrieb skeptisch gegen alles, was danach kommt.
- **Kein Deckblatt, kein Management Summary, kein Logo-Raster.** Ein Meister liest zwei
  Seiten, die stimmen. Zwölf Seiten liest er nicht.

---

# ③ Maschinenlesbarer Ist-Zustand

Als `ist-zustand.json` neben dem Kundendokument. **Der Betrieb bekommt diese Datei nie zu
sehen** — sie ist die Übergabe an `prozesslandkarte`.

## ZUERST: das Schema suchen und lesen

```bash
find . -name "ist-zustand.schema.json" -not -path "*/node_modules/*" 2>/dev/null
```

Erwarteter Ort: `<plugin>/schema/ist-zustand.schema.json`, also neben dem Ordner `skills/`.
**Such sie, statt den Pfad zu raten** — er löst nicht zuverlässig auf, siehe „Den Vertrag
finden" unten.

**Lies diese Datei, bevor du die JSON schreibst.** Sie ist der Vertrag; hier unten stehen
nur die Namen. Findest du sie nicht, brich diesen Teil ab und sag es — die beiden anderen
Ergebnisse hängen nicht davon ab.

**Wenn du sie nicht findest oder nicht lesen kannst: brich ab und sag es.** Schreib keine
JSON nach bestem Wissen. Am 15.10.2026 ist genau das passiert — der Verweis war ein
relativer Pfad ohne Leseanweisung, das Schema wurde nie geöffnet, und statt einer Meldung
„Vertrag nicht gefunden" entstanden **156 Inhaltsverstöße** in einer Datei, die auf den
ersten Blick richtig aussah. **Ein fehlender Vertrag muss laut sein**, nicht still.

## Die Schlüssel — nur die Namen, die Regeln stehen im Schema

Doppelte Namen sind billig. Doppelte Regeln wären eine zweite Wahrheit, deshalb steht die
Begründung je Feld ausschließlich im Schema.

```jsonc
{
  "schema_version": "1.3.0",
  "unternehmen":  { "name", "gesellschaften":[{"id","name","zweck"}],
                    "standorte":[{"id","name","kennung","gesellschaft"}],
                    "bereiche":[{"id","name"}], "mitarbeiter_gesamt": FAKT },
  "aufnahme":     { "datum", "aufgenommen_von",
                    "grundlage": "gespraech_vor_ort|gespraech_fern|protokoll|unterlagen|gemischt",
                    "gespraechspartner_rollen":[], "dauer_min": FAKT },
  "systeme":      [{ "id","name","zweck","gesellschaften":[],
                     "zustand":{"herkunft","zuletzt_gepflegt","wer_kann_aendern","maengel":[]} }],
  "rollen":       [{ "id","bezeichnung","bereich", "anzahl_personen": FAKT,
                     "unersetzlich_bei":[], "was_faellt_aus_wenn_abwesend": FAKT }],
  "prozesse":     [{ "id","name","bereich","ausloeser","ergebnis",
                     "laeuft_je":"unternehmen|gesellschaft|standort|person",
                     "multiplikator": FAKT,
                     "schritte": FAKT mit "wert":[{ "nr","was","rolle","system",
                                   "dauer_min": FAKT, "haeufigkeit_pro_woche": FAKT,
                                   "wartezeit_tage": FAKT }],
                     "schmerzgrad": FAKT, "schmerz_zitat", "monatsende_rueckstand": FAKT }],
  "ketten":       [{ "id","was","prozess",
                     "stationen":[{ "system", "rolle":"quelle|kruecke|ziel",
                                    "form", "handgriff" }],
                     "haeufigkeit_pro_woche": FAKT, "minuten_je_mal": FAKT,
                     "multiplikator": FAKT }],
  "wuensche":     [{ "text", "status":"offen|geparkt|erledigt", "bereich", "quelle" }],
  "offen":        [{ "frage", "blockiert", "rolle" }],
  "nachfragen":   FAKT mit "wert":[{ "rolle", "intern": true, "frage", "blockiert" }]
}
```

**FAKT** steht überall für `{ "wert": …, "status": …, "quelle": "…" }`:

- `status` ist Pflicht: `gemessen` · `geschaetzt` · `nicht_erhoben` · `nicht_zutreffend`
- bei `gemessen` und `geschaetzt`: `wert` **und** `quelle` sind Pflicht
- bei `nicht_erhoben` und `nicht_zutreffend`: `wert` **weglassen oder null** — beides ist
  gleichbedeutend und beides richtig. Der Status sagt bereits alles.

**`schritte` trägt denselben Mantel** (ab Fassung 1.2.0). Das Feld ist **Pflicht**, auch wenn
niemand Schritte genannt hat:

```jsonc
"schritte": { "status": "nicht_erhoben" }                      // Lücke in der Aufnahme
"schritte": { "wert": [ … ], "status": "geschaetzt",
              "quelle": "Inhaber im Gespräch am 14.10." }      // genannt, nicht gemessen
```

**Der Prozess bleibt ein Eintrag, auch ohne Schritte.** „Das Mahnwesen macht die Büroleitung
irgendwie" ist ein echter Prozess — er gehört in die Liste, mit `nicht_erhoben`, nicht
weggelassen und nicht erfunden.

WARUM NICHT EINFACH WEGLASSEN: ein fehlendes Feld würde wieder gleichzeitig „nicht gefragt"
und „gibt es nicht" bedeuten — genau die Mehrdeutigkeit, die der Status-Mantel beseitigt. Für
`prozesslandkarte` ist das der wichtigste Fall von allen: ein Prozess ohne Schritte ist
entweder eine **Lücke in der Aufnahme** oder ein **Prozess aus einem einzigen Handgriff**
(dann steht dieser eine Schritt unter `wert`). Die beiden zu verwechseln kostet eine falsche
Prozesslandkarte.

**`nachfragen` trägt denselben Mantel** (ab Fassung 1.3.0) — und hier ist `quelle` **auch
bei leer Pflicht**:

```jsonc
"nachfragen": { "wert": [ … ], "status": "geschaetzt",
                "quelle": "aus dem Erstgespräch am 14.10. abgeleitet" }
"nachfragen": { "status": "nicht_zutreffend",
                "quelle": "Einmannbetrieb ohne Steuerberater, vom Inhaber bestätigt" }
```

**Eine leere Nachfrage-Liste ist erlaubt — aber nur als Aussage, nie stillschweigend.**
„Niemand außer dem Inhaber muss gefragt werden" ist eine starke Behauptung über einen
Betrieb: im Lauf vom 15.10. lagen **fünf von sieben** tragenden Antworten nicht beim Inhaber.
Wer das Gegenteil behauptet, sagt, woher er es weiß.

Deshalb ist `quelle` hier strenger als bei den Zahlenfeldern, wo sie bei `nicht_erhoben`
entfallen darf. Bis 1.2.0 lief der Prüfer über eine **leere** Liste null Mal und meldete
gültig — es sah geprüft aus und war es nicht.

**Drei Regeln, die der Prüfer durchsetzt und die man leicht übersieht:**

1. `schritte.wert[].rolle` verweist auf ein `rollen[].id`, `schritte.wert[].system` auf ein
   `systeme[].id`. Platzhalter wie `"unbekannt"` sind ungültig — **ist die Rolle unbekannt,
   gehört das in `offen`**, nicht in den Schritt.
2. Eine Kette beginnt mit `quelle`, endet mit `ziel`, alles dazwischen ist `kruecke`.
3. `papier` und `kopf` sind als `system` erlaubt, ohne in `systeme[]` zu stehen. Alles
   andere muss dort deklariert sein — auch `telefon`, `whatsapp`, `email`.

## Je Kette eine ausdrückliche Aussage über die Zwischenstationen

**Sag zu jeder Kette, welche Zwischenstationen sie hat — oder dass sie keine hat.** Nicht
nebenbei im Text, sondern als Satz, der eine Behauptung ist:

> Kette „Arbeitsstunden der Monteure": **eine Zwischenstation** — der Ordner im Büro, in dem
> die Zettel eine Woche liegen.
>
> Kette „Wochenplan": **keine Zwischenstation** — die Excel-Tabelle geht direkt per WhatsApp
> raus.

**Station ist alles, wodurch ein Fakt läuft.** Nicht nur Programme: ein Blatt Papier, ein
Ordner im Regal, ein Stapel auf der Fensterbank, ein Posteingang, ein Anruf, der Kopf einer
Person. **Wenn eine Information irgendwo wartet, ist dieses Warten eine eigene Station** —
auch dann, wenn sich das Medium nicht ändert. Papier → Papier ist eine gültige Folge, wenn
das zweite Papier ein anderer Ort und eine andere Wartezeit ist.

**WARUM DAS HIER STEHT, gemessen am 15./16.10.2026:** über zwei Eval-Messungen entstand die
Dreierkette `Stundenzettel → Ordner → Streit` in nur **2 von 6 Läufen.** In den anderen vier
stand der Ordner als Beiwerk — `form: "Stundenzettel, gesammelt im Ordner im Büro"` — und
die Kette hatte zwei Stationen statt drei.

Die Information war also nie verloren. **Gezählt wurde sie nicht.** Und das ist der
Unterschied, auf den alles ankommt: `prozesslandkarte` sucht Krücken, um sie zu entfernen.
Eine Krücke, die als Adjektiv in einem `form`-Feld steht, wird nicht gefunden. **Genau die
Entfernung dieser Zwischenstation ist das, was der Betrieb bezahlt** — sie nicht zu zählen
heißt, das Angebot nicht zu haben.

Die Probe vor der Abgabe: **jede Station mit einer Wartezeit ist eine eigene Station.** Liegt
etwas irgendwo, bis jemand es holt, dann ist dieses Irgendwo eine Station — nicht die
Beschreibung der vorherigen.

# ④ Die Nachfrage-Liste

Für dich, nicht für den Kunden. **Wen muss man außer dem Inhaber noch fragen, und was
genau?**

Ein Betriebsinhaber weiß, *dass* eine Arbeit gemacht wird. Wie lange sie dauert, weiß die
Person, die sie macht. Ob eine Schnittstelle existiert, weiß der Softwareanbieter. Ob ein
Importweg offensteht, weiß der Steuerberater.

**Belegt am 15.10.2026:** in einem echten Mandat lagen **fünf von sieben tragenden
Antworten nicht beim Inhaber.** Das ist der Normalfall, nicht der Sonderfall — und ohne
diese Liste merkt man es erst, wenn das Nachfasstelefonat mit dem Inhaber nichts gebracht
hat.

Je Eintrag: **Rolle** (nicht Name), ob sie **im Betrieb** sitzt oder außerhalb, die
**Frage**, und **was ohne die Antwort blockiert ist**.

| Rolle | intern | Frage | blockiert |
|---|---|---|---|
| Büroleitung | ja | Wie lange dauert … je Durchgang? | jede Ersparnisrechnung |
| Steuerberater | nein | Gibt es einen Importweg nach Datev? | ob die Zwischenstation entfällt |
| Softwareanbieter | nein | Welche Exporte liefert …? | die Machbarkeit insgesamt |

Die Liste geht auch nach `nachfragen` im Ist-Zustand, damit der nächste Skill weiß, worauf
die Zahlen noch warten.

**Sortierung: was am meisten blockiert, steht oben.** Eine Frage an den Steuerberater, die
über die ganze Richtung entscheidet, ist dringender als drei Detailfragen im Haus.

---

# Der Ausgabevertrag

`ist-zustand.json` folgt `ist-zustand.schema.json` (Fassung **1.3.0**). Das Schema ist der
Vertrag zwischen diesem Skill und `prozesslandkarte` — beide Seiten nennen es.

## Den Vertrag finden — ausdrücklich, nicht auf Glück

**Suche die Datei, bevor du die JSON schreibst.** Ein relativer Pfad in diesem Text löst
nicht zuverlässig auf: er hängt am Arbeitsverzeichnis des Laufs, nicht am Ort dieses Skills.
Die Suche ist deshalb **vorgeschrieben, nicht geraten**:

```bash
# im Plugin-Ordner dieses Skills, zwei Ebenen über skills/ist-aufnahme/
find . -name "ist-zustand.schema.json" -not -path "*/node_modules/*" 2>/dev/null
```

Oder mit `Glob`: `**/ist-zustand.schema.json`. Erwarteter Ort im Plugin:
`<plugin>/schema/ist-zustand.schema.json`, daneben `pruefe-ist-zustand.mjs`.

**Findest du sie nicht, sag das laut und brich ab** — schreib keine JSON auf Verdacht.
Ein stillschweigend geratenes Format sieht richtig aus und ist beim Verbraucher Müll. Die
Meldung lautet dann: „Vertrag `ist-zustand.schema.json` nicht gefunden, Ist-Zustand nicht
geschrieben" plus die beiden anderen Ergebnisse, die davon nicht abhängen.

BELEGT 15.10.2026, deshalb steht es hier: in einem echten Lauf löste der damalige Pfad
`schema/…` nicht auf. Das Modell fand die Datei trotzdem — über eine Suche, die niemand
verlangt hatte. **Ein Zeiger, der nur funktioniert, weil daneben gesucht wird, ist kein
Zeiger.** Eine belegte Form gibt es nicht: `${CLAUDE_PLUGIN_ROOT}` ist in der Doku nur für
Plugin-**Befehle** dokumentiert und in der Bash-Umgebung eines Skill-Laufs nicht gesetzt
(nachgemessen). Die dokumentierte Skill-Ablage (`scripts/`, `references/`, `assets/`) liegt
INNERHALB des Skill-Ordners — dieses Schema liegt eine Ebene darüber, weil zwei Skills es
teilen. Eine zweite Kopie wäre eine zweite Wahrheit, also bleibt es eine Datei plus diese
Suchanweisung.

**Vor der Abgabe prüfen, wenn der Prüfer erreichbar ist:**

```bash
node <gefundener-pfad>/pruefe-ist-zustand.mjs <pfad/ist-zustand.json>
```

Exit 0 heißt gültig. Jeder Verstoß wird mit Pfad und Grund genannt. **Struktur ist
entscheidbar, nicht beurteilbar** — was ein Programm prüfen kann, gehört nicht vor einen
Richter und nicht in die Hoffnung.

⚠ **Dieser Aufruf ist gute Praxis, kein Nachweis.** Eine Selbstmeldung des Erzeugers
beweist nichts — wer seine eigene Ausgabe prüft und „in Ordnung" sagt, hat behauptet, nicht
belegt. Der Vertrag wird **beim Verbraucher** durchgesetzt: `prozesslandkarte` ruft denselben
Prüfer als ersten Schritt auf und **verweigert ungültige Eingabe**. Eine Verweigerung des
Verbrauchers ist ein Nachweis, unabhängig davon, ob der Erzeuger ehrlich, nachlässig oder
kaputt war.

Drei Regeln, die über reine Struktur hinausgehen und im Prüfer stecken:

1. **Jeder Fakt trägt seinen Status.** `{wert, status, quelle?}` mit `gemessen`,
   `geschaetzt`, `nicht_erhoben` oder `nicht_zutreffend`. Ein nackter Wert ist ungültig,
   ein leeres Feld auch. Bei `gemessen` und `geschaetzt` ist `quelle` Pflicht — eine Zahl
   ohne Herkunft landet sonst ungeprüft in einem Angebot.
2. **Ketten statt Paare.** Eine Kette beginnt mit `quelle`, endet mit `ziel`, alles
   dazwischen ist `kruecke`. Zwei Stationen im selben System ohne Handgriff dazwischen sind
   **kein** Medienbruch, sondern eine Rechenkette — der Prüfer weist das ab.
   ⚠ Das heißt NICHT, dass zwei Stationen im selben Medium verboten wären. `papier` →
   `papier` ist richtig, wenn dazwischen ein Handgriff und eine Wartezeit liegen: der Zettel
   wird abgegeben, liegt eine Woche im Ordner, dann tippt jemand ab. **Verboten ist die
   Station ohne Handgriff, nicht die Station im selben Medium.** Siehe ③, „Je Kette eine
   ausdrückliche Aussage".
3. **Rollen, keine Namen.** Der Prüfer schlägt bei Vornamen an. Klarnamen gehören ins
   Kundendokument, das beim Betrieb bleibt; der Ist-Zustand reist weiter.

---

# Was aus den Vorlagen übernommen und was gestrichen wurde

## `operations:process-doc`

**Übernommen:** die eingebaute Ausgabevorlage (der eigentliche Grund, dort hinzusehen) ·
„Include the exceptions" → der Abschnitt zu Ausnahmen und Rückständen · „Name the people" →
Vornamen statt Rollen · die Struktur Wer / Womit / Wie lange je Schritt.

**Gestrichen:** RACI-Matrix · Metrics-Tabelle mit Zielwerten · Review Cadence · Related
Documents · Scope-Abschnitt · „If Connectors Available" · ASCII-Flowchart. Ein
Zwölf-Mann-Betrieb hat keine vier Rollen je Schritt, keine quartalsweise Prozessrevision und
niemanden, der ein ASCII-Diagramm liest.

## `management-consulting:engagement-setup`

**Übernommen:** das Erfindungsverbot („Mark unknown stakeholder positions … rather than
filling them with plausible names, dates") → das Grundgesetz oben · die Unterscheidung
zwischen Bericht, Beobachtung und Messung → `quelle` · „Track what was requested, supplied,
tested, and still missing" → `offen`.

**Gestrichen:** Power-Interest-Matrix · Projekt-Charter · Kickoff-Design mit Pre-Read ·
Workstream-Ownership · Decision Rights · Governance · Kommunikationskanäle ·
Eskalationswege. Das ist die Ausstattung eines Mandats mit zwanzig Beteiligten; hier sitzen
der Meister, die Bürokraft und du am Küchentisch.

---

# Abschluss

Beide Dateien gehen zusammen raus, an verschiedene Adressaten. Protokollzeile:

```
IST-AUFNAHME: <Betrieb> · <n> Prozesse · <n> Medienbrüche · <n> offene Punkte
```

Danach `prozesslandkarte`, die `ist-zustand.json` liest.
