# Toona Website Structure

## Domain
- Primary: `https://www.toona.yoga`
- Redirect: `toona.yoga` → `https://www.toona.yoga` (301)
- HTTP → HTTPS enforced via `.htaccess`

## Directory Structure

```
/
├── about/                  # About page (EN)
├── devlog/                 # Dev Log page (EN)
├── download/               # Download page (EN)
├── support/                # Support page (EN)
│   ├── en/                 # App support page (English)
│   └── zh/                 # App support page (Chinese)
├── privacy/                # Privacy Policy
│   ├── en/                 # App privacy policy (English) → PrivacyPolicy.html
│   └── zh/                 # App privacy policy (Chinese) → PrivacyPolicy.html
├── terms/                  # Terms of Use
│   ├── en/                 # App terms (English) → TermsOfUse.html
│   └── zh/                 # App terms (Chinese) → TermsOfUse.html
├── zh/                     # Chinese version of website
│   ├── about/
│   ├── devlog/
│   ├── download/
│   ├── support/
│   ├── privacy/
│   └── terms/
├── assets/
│   ├── css/
│   │   ├── variables.css   # Design tokens (colors, fonts, spacing)
│   │   ├── base.css        # Reset, typography, nav, footer, buttons
│   │   ├── 404.css         # 404 page specific styles (gradient text)
│   │   ├── home.css        # Homepage styles
│   │   ├── about.css       # About page styles
│   │   ├── devlog.css      # Dev Log page styles
│   │   ├── download.css    # Download page styles
│   │   └── support.css     # Support page styles
│   ├── js/
│   │   └── components.js   # Auto-injects nav + footer based on language
│   ├── fonts/
│   └── images/
│       ├── icons/          # UI icons (logo.png, logo.webp, icon.png)
│       └── og/             # Open Graph images (1200×630px, one per page)
├── .gitignore
├── .htaccess               # Apache config
├── favicon.ico             # Site favicon
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── site.webmanifest
├── robots.txt
├── sitemap.xml             # XML sitemap with hreflang
├── index.html              # Homepage (EN)
├── 404.html                # Custom Error 404 page (Bilingual)
├── STRUCTURE.md            # This file
├── PRODUCT.md              # Product introduction (EN + ZH)
└── webhookDEPLOY.md        # GitHub + 宝塔 WebHook deployment guide
```

## Navigation Structure

### Desktop Nav (all pages)
Logo → About | Dev Log | Support | Language Switcher | Download button

### Mobile Nav
Logo + Hamburger menu (☰) → expands to full nav links

### Language Switcher
Dropdown: English / 中文 (auto-detects current page, switches to equivalent page in other language)

## Language Strategy

- Root directory (`/`) = English (default)
- Chinese = `/zh/` prefix
- Future languages follow the same pattern: `/ja/`, `/ko/`, etc.
- App-specific legal pages (privacy/terms/support) use language subfolders inside their respective directories
- Nav and footer are auto-injected by `assets/js/components.js` based on URL

## Page List

| Page | EN URL | ZH URL |
|------|--------|--------|
| Home | `/` | `/zh/` |
| About | `/about/` | `/zh/about/` |
| Dev Log | `/devlog/` | `/zh/devlog/` |
| Download | `/download/` | `/zh/download/` |
| Support | `/support/` | `/zh/support/` |
| Privacy (app) | `/privacy/en/PrivacyPolicy.html` | `/privacy/zh/PrivacyPolicy.html` |
| Terms (app) | `/terms/en/TermsOfUse.html` | `/terms/zh/TermsOfUse.html` |
| Support (app) | `/support/en/` | `/support/zh/` |

## CSS Architecture

All pages load CSS in this order:
```html
<link rel="stylesheet" href="/assets/css/variables.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/[page].css">
```

### variables.css — Design Tokens
- Brand colors: Primary `#7B4FA6`, Accent Teal `#4ECDC4`, Orange `#FF6B35`
- Dark bg: `#1A1A1A`, Light bg: `#EEF2F0`
- Full spacing scale, font sizes, border radius, shadows
- Dark mode auto-switch via `@media (prefers-color-scheme: dark)`

### base.css — Shared Components
- CSS reset
- Typography (h1–h4, p)
- Layout (.container, .section)
- Buttons (.btn, .btn-primary, .btn-dark, .btn-download)
- Cards (.card)
- Navigation (.nav, .nav-logo, .nav-links, .hamburger)
- Language dropdown (.lang-switcher, .lang-dropdown)
- Footer (.footer, .footer-inner, .footer-col)
- Responsive breakpoints: 768px (mobile nav), 480px (footer)

## Components System

Nav and footer are NOT hardcoded in HTML pages. They are dynamically injected by:
```html
<script src="/assets/js/components.js"></script>
```

`components.js` auto-detects language from URL and injects the correct nav/footer.

### To add a new page:
1. Create `[page]/index.html`
2. Add CSS link for page-specific styles
3. Add `<script src="/assets/js/components.js"></script>` before `</body>`
4. No need to write nav or footer HTML

## Download Button

All App Store download buttons use the unified `.btn-download` class with SVG icon:
```html
<a href="[APP_STORE_URL]" class="btn-download">
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
    <path d="M8 1v11M4 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="2" y1="16" x2="14" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  Download on App Store
</a>
```

## Adding a New Language

1. Create `/{lang}/` folder mirroring root page structure
2. Create `/privacy/{lang}/`, `/terms/{lang}/`, `/support/{lang}/` for app legal pages
3. Add language entry to `assets/js/components.js` translation object `t`
4. Add `hreflang` entries to each `<url>` block in `sitemap.xml`

## Key Config Files

- Nginx Config — (In Baota Panel) HTTPS redirect, canonical domain, Gzip, browser caching, security headers, and `error_page 404 /404.html;`
- robots.txt — allows all crawlers, points to sitemap
- sitemap.xml — all pages with `hreflang` alternate links
- assets/js/components.js — nav/footer injection, language detection
- webhookDEPLOY.md — GitHub + 宝塔 WebHook auto-deploy guide
