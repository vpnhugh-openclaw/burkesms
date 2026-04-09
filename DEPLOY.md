# Deploying Burke Text Messager

## Current deployment status

This repo is linked locally to a Vercel project:
- Project: `burkesms`
- Team: `vpnhugh-4227s-projects`

Note: the local Vercel link succeeded, but automatic GitHub repo connection in Vercel failed. That means deploys can still be done from the CLI immediately, but Git-based auto-deploy may need to be connected in the Vercel dashboard.

## Pre-deploy check

Run this from the repo root:

```bash
npm run build
npm run test
```

## Deploy a preview build

```bash
vercel
```

## Deploy to production

```bash
vercel --prod
```

## Useful Vercel commands

List projects:

```bash
vercel projects ls
```

Inspect the current linked project:

```bash
cat .vercel/project.json
```

## Optional: connect GitHub for automatic deploys

If you want pushes to GitHub to trigger deploys automatically:

1. Open the Vercel dashboard
2. Open the `burkesms` project
3. Connect the GitHub repository `vpnhugh-openclaw/burkesms`
4. Confirm framework is `Vite`
5. Confirm build settings:
   - Build command: `npm run build`
   - Output directory: `dist`

## Suggested publish sequence

```bash
git push origin main
vercel --prod
```

If GitHub integration is connected successfully later, `git push origin main` can become the main deployment trigger.
