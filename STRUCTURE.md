# Toona Website Structure

## Domain
- Primary: `https://www.toona.yoga`
- Redirect: `toona.yoga` → `https://www.toona.yoga` (301)
- HTTP → HTTPS enforced via `.htaccess`

## Directory Structure

```
/
├── about/                  # About page (EN)
├── blog/                   # Blog page (EN)
├── download/               # Download page (EN)
├── privacy/                # Privacy Policy
│   ├── en/                 # App privacy policy (English) → PrivacyPolicy.html
│   └── zh/                 # App privacy policy (Chinese) → PrivacyPolicy.html
├── support/                # Support page
│   ├── en/                 # App support page (English)
│   └── zh/                 # App support page (Chinese)
├── terms/                  # Terms of Use
│   ├── en/                 # App terms (English) → TermsOfUse.html
│   └── zh/                 # App terms (Chinese) → TermsOfUse.html
├── zh/                     # Chinese version of website
│   ├── about/
│   ├── blog/
│   ├── download/
│   ├── privacy/
│   ├── support/
│   └── terms/
├── assets/
│   ├── css/                # Shared stylesheets
│   ├── js/                 # Shared scripts
│   ├── fonts/              # Web fonts
│   └── images/
│       ├── icons/          # UI icons
│       └── og/             # Open Graph images (1200×630px, one per page)
├── .htaccess               # Apache config
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # XML sitemap with hreflang
├── favicon.ico             # Site favicon (to be added)
└── index.html              # Homepage (EN, to be added)
```

## Language Strategy

- Root directory (`/`) = English (default)
- Chinese = `/zh/` prefix
- Future languages follow the same pattern: `/ja/`, `/ko/`, etc.
- Each language folder mirrors the root structure exactly
- App-specific legal pages (privacy/terms/support) use language subfolders inside their respective directories

## Page List

| Page | EN URL | ZH URL |
|------|--------|--------|
| Home | `/` | `/zh/` |
| About | `/about/` | `/zh/about/` |
| Download | `/download/` | `/zh/download/` |
| Blog | `/blog/` | `/zh/blog/` |
| Privacy (website) | `/privacy/` | `/zh/privacy/` |
| Support (website) | `/support/` | `/zh/support/` |
| Terms (website) | `/terms/` | `/zh/terms/` |
| Privacy (app) | `/privacy/en/PrivacyPolicy.html` | `/privacy/zh/PrivacyPolicy.html` |
| Terms (app) | `/terms/en/TermsOfUse.html` | `/terms/zh/TermsOfUse.html` |
| Support (app) | `/support/en/` | `/support/zh/` |

## Each Page Folder

Every page folder contains a single `index.html` file, allowing clean URLs without `.html` extension (handled by `.htaccess`).

Example:
```
about/
└── index.html   → accessible at https://www.toona.yoga/about/
```

## Assets Usage

All pages reference shared assets using absolute paths:
```html
<link rel="stylesheet" href="/assets/css/main.css">
<script src="/assets/js/main.js"></script>
```

## Adding a New Language

1. Create `/{lang}/` folder mirroring root page structure
2. Create `/privacy/{lang}/`, `/terms/{lang}/`, `/support/{lang}/` for app legal pages
3. Add `hreflang` entries to each `<url>` block in `sitemap.xml`

## Key Config Files

- `.htaccess` — HTTPS redirect, canonical domain, Gzip, browser caching, security headers, custom 404
- `robots.txt` — allows all crawlers, points to sitemap
- `sitemap.xml` — includes all pages with `hreflang` alternate links for multilingual SEO
