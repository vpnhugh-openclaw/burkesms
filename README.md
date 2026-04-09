# Burke Text Messager

Burke Text Messager is a pharmacy-focused SMS workflow app for Burke Road Compounding Pharmacy.

It is designed for:
- importing patient spreadsheets
- reviewing and filtering recipients
- preparing personalised SMS content
- sending messages manually or through httpSMS
- exporting updated results for pharmacy records

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Vitest

## Local development

```bash
npm install
npm run dev
```

Default local URL:
- `http://127.0.0.1:4173/` when started with an explicit host/port

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Deployment

This project is deployable as a static Vite app.

### Generic static hosting

1. Install dependencies
2. Run `npm run build`
3. Deploy the generated `dist/` folder

### Vercel

Recommended settings:
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Netlify

Recommended settings:
- Build command: `npm run build`
- Publish directory: `dist`

## Notes

- The app stores workflow state and settings in browser local storage.
- httpSMS setup requires the account API key from `httpsms.com/settings`, not a phone API key.
- The uploaded pharmacy logo is included at `public/burke-road-logo.jpg`.
