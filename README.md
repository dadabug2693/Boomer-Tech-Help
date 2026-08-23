# Boomer Tech Help — landing page

A single-page, static site for boomertechhelps.com. Plain HTML/CSS/JS — no build step, no framework, no dependencies.

## Files

```
index.html          The whole page
css/styles.css       All styles (design tokens at the top of the file)
js/main.js            Mobile nav, share button, footer year, scroll reveal
assets/logo.png       Boomer Tech Help logo (from the YouTube channel)
assets/favicon-*.png  Favicons generated from the logo
assets/apple-touch-icon.png
netlify.toml         Netlify build/publish config
```

## Preview locally

No build tools needed. From this folder, run any static server, for example:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## One place to update links

Open `js/main.js` and edit `SITE_CONFIG` at the top:

```js
var SITE_CONFIG = {
  youtubeUrl: 'https://www.youtube.com/@BoomerTechHelps',
  youtubeShortsUrl: 'https://www.youtube.com/@BoomerTechHelps/shorts',
  siteUrl: 'https://boomertechhelps.com'
};
```

Every "Watch on YouTube" / "Subscribe" / footer link on the page pulls from this one place. (Each of those links also has a real `href` already in the HTML, so they still work even if JavaScript is disabled.)

## The Shorts section

`#shorts` embeds three YouTube Shorts via `<iframe>` (using `youtube-nocookie.com`, no API key required). Right now they point at **placeholder video IDs** — `VIDEO_ID_1`, `VIDEO_ID_2`, `VIDEO_ID_3` — in `index.html`. Replace those with real video IDs (the part of a YouTube URL after `/shorts/`) to make them live.

A true auto-updating "feed" (one that always shows your latest Shorts automatically) requires the YouTube Data API, which needs an API key. Since the brief asked not to expose secrets in the static site, this uses direct video embeds instead — simple, no key required, and it still updates instantly whenever you swap in new IDs. If you'd like, a lightweight serverless function could be added later to fetch the latest Shorts automatically, but that's a bigger change than this static page.

## Deploying to Netlify

This is ready to deploy as-is:

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project** → connect the repo.
3. Build command: none. Publish directory: `/` (repo root).
4. Deploy. Then add the custom domain `boomertechhelps.com` in Netlify's domain settings.

`netlify.toml` is already included and sets sensible security headers.

## What's still a placeholder

- **Shorts video IDs** — see above.
- **Stay Informed section** — no email service is connected yet, so it points to YouTube instead of a signup form (per the brief, no fake/non-functional form was built). When you pick a service (Mailchimp, Buttondown, etc.), that section is where a real form goes — there's a comment marking the spot in `index.html`.
