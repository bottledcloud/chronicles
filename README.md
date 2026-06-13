# The Stoned Chimp's Chronicles — Static Site

Twilight-themed Eleventy (11ty) rebuild of the WordPress.com blog. Builds to plain
HTML/CSS — no database, no server, free hosting on GitHub Pages.

## Local development

```bash
npm install
npm run dev        # live-reload server at http://localhost:8080
npm run build      # production build into _site/
```

## 1. Migrate your WordPress posts (one-time)

1. In WordPress.com admin: **Tools → Export → Export All** — downloads an XML file.
2. Convert it to markdown:
   ```bash
   npx wordpress-export-to-markdown --input export.xml --output src/posts \
     --year-folders false --post-folders false --prefix-date false
   ```
3. Each post becomes a `.md` file. Add to each file's frontmatter:
   ```yaml
   tags: [prose-poetry]        # or reflections / travel
   layout: layouts/post.njk
   ```
   (A quick `sed`/script can batch-add the layout line.)
4. Delete the placeholder posts in `src/posts/`, keep `whirling-birds.md` if you
   like the lightly edited version.
5. Downloaded images land in an assets folder — move them to `src/assets/img/`
   and fix paths in the markdown.

## 2. Deploy to GitHub Pages

1. Create a repo (e.g. `chronicles`) and push this project to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on
   every push. Site goes live at `https://<username>.github.io/chronicles/`.
4. Update `src/_data/site.json` → `url` to the real URL (used by canonical tags,
   RSS, sitemap, and Open Graph).

### Custom domain (optional, ~₹800/yr)

Buy a domain, add a `CNAME` file containing the domain to `src/` (and a
passthrough copy in `eleventy.config.js`), point DNS per GitHub Pages docs, enable
**Enforce HTTPS**. Then remove the `--pathprefix` flag from the workflow since
the site will live at the domain root.

## 3. Wire up the subscribe form

The footer form is static markup. Easiest options:

- **Buttondown** (free tier): create an account, replace the form with their
  embed snippet — it can also auto-email subscribers from your RSS feed.
- **follow.it**: pure RSS-to-email, paste your feed URL, drop in their form.

Your RSS feed is at `/feed.xml` — readers can subscribe directly with any
feed reader, no service needed.

## 4. Point people from the old blog

WordPress.com free plan can't do real 301 redirects. Options:

- Publish a final pinned post on WordPress linking to the new home.
- Or buy WordPress.com's **Site Redirect** upgrade (~$13/yr) for true redirects
  so old links and SEO juice carry over.
- Keep the WordPress export XML as your permanent backup either way.

## 5. Production checklist

- [ ] All posts imported, tags + layout added, images localized
- [ ] `site.json` URL updated (and `author`, `description` if desired)
- [ ] Pages deploy green in the Actions tab
- [ ] Subscribe form wired to Buttondown/follow.it
- [ ] Submit `sitemap.xml` in Google Search Console
- [ ] Final pointer post published on the old WordPress blog
- [ ] Lighthouse check (the site should score ~100 — it's static, one CSS file,
      one small JS file, system-cached Google Fonts)

## Structure

```
src/
  _data/site.json          # site name, tagline, URL — edit me
  _includes/layouts/       # base.njk (shell + SEO), post.njk (reading view)
  assets/                  # styles.css, fireflies.js
  posts/*.md               # your writing — one markdown file per post
  index.njk                # homepage (hero, featured, chronicle archive)
  feed.njk / sitemap.njk   # generated XML
.github/workflows/         # auto-deploy to GitHub Pages
```

Adding a new post = drop a markdown file in `src/posts/`, push. The featured
section, year archive, feed, and sitemap all update automatically.
