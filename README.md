# Automate Structure — Lieferrepo

**Dieses Repo ist erzeugt. Nicht von Hand bearbeiten.**
Quelle: `scripts/liefern.mjs` im Entwicklungsrepo, aus dem Release-Tag.

Es enthaelt **genau das, was installiert wird** — die Skill-Koerper und die Pruefer,
die sie zur Laufzeit suchen. Es enthaelt **nicht** die Methode: keine Eval-Faelle,
keine Grader, keine Pruefmuster, kein Konventionsprotokoll. Die liegen im privaten
Entwicklungsrepo und werden nicht ausgeliefert.

## Installieren

```bash
claude plugin marketplace add AlexandrosMoyso/automate-structure
claude plugin install as-shk-elektro@automate-structure
```

## Was genau angekommen ist, nachpruefen

`releases/as-shk-elektro/1.2.2/source-index.json` nennt jede ausgelieferte Datei mit Bytes und sha256, dazu die
Revision, aus der sie gebaut wurde. Vergleichen:

```bash
shasum -a 256 plugins/*/skills/*/SKILL.md plugins/*/schema/*
```

## Fassungen

Je Fassung ein Tag in diesem Repo und ein Verzeichnis unter `releases/`.
