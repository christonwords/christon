# Christon Site

Modern dark-themed artist website built with Vite + React + TypeScript + Tailwind.

- Admin auth & uploads powered by Firebase (news, unreleased, merch, production)
- Reactive Vanta background, advanced UI styles
- Sidebar headliner with hip-hop/X feed
- Streaming embeds & social links
- Optional on-site AI dev panel (client-only)

## Local dev

```bash
npm install
npm run dev
```

Create `.env` with Firebase + options:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_AI_DEV_ENABLED=false
VITE_GA_ID=
```

## Deploy to GitHub Pages

- Push to `main`. Workflow in `.github/workflows/deploy.yml` builds and deploys.
- Set repository Pages source to GitHub Actions.

## Content

- Admin login via header → `#/admin`
- Collections: `news`, `unreleased`, `merch`, `production`
- Security: Configure Firebase rules to restrict writes to your account.
