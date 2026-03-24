---
name: hubspot
version: 1.0.0
description: HubSpot CRM integration — søg deals og kontakter, tilføj noter. Brug til at tjekke for duplikater inden deal-oprettelse i Amalo Operator, og til at logge leadkilder og tidshorisonter i HubSpot.
---

# HubSpot Skill

Kalder HubSpot API via `node hubspot.js` scriptet.

## Token

Sæt `HUBSPOT_TOKEN` som environment variable:

```bash
export HUBSPOT_TOKEN="pat-na1-your-token-here"
```

Eller opret en `.env` fil i skills-mappen (tilføjet til .gitignore).

## Kommandoer

### Søg efter deal (duplikat-tjek)
```bash
node /path/to/hubspot.js search-deal "Vejnavn 11"
```
Returnerer: ID, dealname, stage for alle matches.

### Tilføj note til deal
```bash
node /path/to/hubspot.js add-note <dealId> "Varmepumpeportal.dk - \"Inden for 1 måned\""
```

### Tilføj note til kontakt
```bash
node /path/to/hubspot.js add-note-contact <contactId> "Notattekst"
```

### Hent deal detaljer
```bash
node /path/to/hubspot.js get-deal <dealId>
```

### Søg kontakt på email
```bash
node /path/to/hubspot.js search-contact "email@example.com"
```

## Workflow for Maja

1. **Duplikat-tjek:** Kør `search-deal <vejnavn>` — er der resultater?
2. **Ingen duplikat:** Opret deal i Amalo Operator → tilføj note med `add-note <dealId> "Kilde - 'Tidshorisonten'"`
3. **Duplikat:** Tilføj note på eksisterende deal + kontakt

## Note-format (fra Jes Rindom)
- Ny deal: `Varmepumpeportal.dk - "Inden for 1 måned"`
- Duplikat: `Brotoften 11 er nu også kommet ind via Varmepumpeportal.dk - "Inden for 3 måneder"`
