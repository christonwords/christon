# Deploy to GitHub Pages

1. In `package.json`, set `homepage` to `https://<user>.github.io/<repo>` if using project pages, or `https://<user>.github.io` for user/org pages.
2. Add scripts:
   - `predeploy`: `npm run build`
   - `deploy`: `gh-pages -d dist`
3. Push to GitHub. Then run `npm run deploy`.
4. In the repo settings, enable GitHub Pages using the `gh-pages` branch.
5. Custom domain: add your domain in Pages settings and create DNS A/ALIAS/CNAME as instructed. Create a `CNAME` file in `public/` with your domain.