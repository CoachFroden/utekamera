# Utekamera 🐦

Egen mobiltilpasset kameravisning for Home Assistant. Koden ligger i GitHub, men kameraet vises via Home Assistants egen innloggede frontend, også over Nabu Casa.

## Installasjon

1. Last ned `utekamera-card.js` fra dette repoet.
2. Legg filen i `/config/www/utekamera/utekamera-card.js` på Home Assistant.
3. Gå til **Innstillinger → Dashbord → Ressurser**, legg til JavaScript-modul:
   `/local/utekamera/utekamera-card.js`
4. Opprett et eget dashbord, f.eks. **Utekamera**, og legg inn et **Manuelt kort** med:

```yaml
type: custom:utekamera-card
entity: camera.utekamera
title: Fuglebrettet
```

**Viktig:** Kontroller den faktiske kamera-entitets-ID-en i Home Assistant. Endre `entity` hvis den er annerledes.

## Tilgang utenfra

Åpne dashbordet gjennom Home Assistants vanlige adresse eller Nabu Casa. Innlogging og videostrømming håndteres av Home Assistant. Ingen direkte tilgang til RTSP-port 554 er nødvendig.

## Merknader

- Første versjon bruker Home Assistants innebygde `picture-entity`-kort for livevideo.
- Oppdater-knappen gjenoppretter kortet; den starter ikke kameraet fysisk på nytt.
- Øyeblikksbilder og en helt frittstående `/local/`-side krever separat løsning for autentisering og er ikke implementert ennå.
- Reserver gjerne `192.168.0.133` i ruteren slik at kameraets IP ikke endres.
