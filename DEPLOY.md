Deployment instructions
=======================

1) Build locally (already validated in this workspace):

```powershell
npm run build
```

2) Deploy to Vercel (recommended for static React apps):

- Install Vercel CLI and login:

```powershell
npm i -g vercel
vercel login
```

- From the project root run:

```powershell
vercel --prod
```

Vercel will detect `vercel.json` and publish the `dist` folder.

3) Deploy to Netlify (alternative):

- Using Netlify CLI:

```powershell
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

Or connect your GitHub repo in Netlify UI and set build command to `npm run build` and publish directory to `dist`.

4) Make the site discoverable by Google

- After deployment, copy your live site URL (e.g. `https://your-site.vercel.app`).
- Go to Google Search Console (https://search.google.com/search-console) and add your site (requires Google account).
- Verify ownership (recommended: add the provided TXT record to your DNS, or use the HTML file method).
- In Search Console use "URL inspection" → enter your homepage URL → Request indexing.

Notes & next steps
- Replace the `sitemap.xml` entry `https://example.com/` with your live domain before requesting indexing.
- Add meta tags and Open Graph tags in `index.html` for better preview and SEO.
- If you want, I can create a GitHub repo, commit these files, and provide exact `vercel`/`netlify` commands to run — but I cannot publish to Vercel/Netlify or Google without your accounts and credentials.
