# Mustad Næringspark — Website Redesign Prototype
## Instructions for Claude Code

---

## 1. Project Overview

This is a **premium design-focused prototype** for the redesign of [mustadnaeringspark.no](https://www.mustadnaeringspark.no) — a business park in Gjøvik, Norway. The goal is not a functional CMS or backend. It is a high-fidelity, visually impressive static prototype that could be handed off to a developer or presented to a client.

Every page must feel **considered, modern, and premium**. No empty states. No placeholder text. No lorem ipsum. No broken layouts.

---

## 2. First Step — Folder Structure

Before writing any code, create the following folder structure exactly:

```
mustad-business-park/
├── src/
│   ├── index.html
│   ├── ledige-lokaler.html
│   ├── eiendommer.html
│   ├── eiendom-mustad-naeringspark.html
│   ├── eiendom-bright-house.html
│   ├── eiendom-aamodt.html
│   ├── eiendom-stoperiet.html
│   ├── eiendom-bygg-for-deg.html
│   ├── fasiliteter.html
│   ├── parkering.html
│   ├── om-oss.html
│   ├── nyheter.html
│   ├── kontakt.html
│   ├── styles.css
│   └── script.js
├── content/
│   └── (reference notes, scraped copy, image URLs)
├── claude.md
└── README.md
```

Do not deviate from this structure. All HTML files live flat inside `src/`. All shared styles go in `styles.css`. All shared JS goes in `script.js`.

---

## 3. Tech Stack

- **Vanilla HTML, CSS, JavaScript only.** No frameworks. No build tools. No npm.
- **Google Fonts:** Load via `<link>` tag in every HTML file.
  - Headers: `Poppins` weight 700 (Bold)
  - Body: `Questrial` (Regular 400)
- **Icons:** Use [Lucide Icons](https://unpkg.com/lucide@latest) via CDN script tag.
- **No external UI libraries** (no Bootstrap, no Tailwind, no jQuery).
- All pages must share the same `styles.css` and `script.js` via relative paths.

---

## 4. Design Language

This is a **premium Scandinavian business brand**. The design must reflect:

- Clean, airy layouts with generous whitespace
- Strong typographic hierarchy
- Subtle use of dark backgrounds for hero sections, light for content
- Smooth hover transitions and micro-interactions
- Cards with depth (box-shadow, slight lift on hover)
- No clip-art. No stock photo clichés. No gradient abuse.

### Color Palette
```
--color-dark:       #0f1117   /* Primary dark / hero backgrounds */
--color-charcoal:   #1e2128   /* Secondary dark */
--color-accent:     #c8a96e   /* Gold — used for highlights, CTAs, borders */
--color-light:      #f5f4f0   /* Off-white background for content sections */
--color-white:      #ffffff
--color-text:       #2e2e2e   /* Body text on light backgrounds */
--color-muted:      #7a7a7a   /* Secondary/meta text */
```

### Typography Scale
```css
h1: Poppins 700, 56–72px
h2: Poppins 700, 36–48px
h3: Poppins 700, 24px
body: Questrial, 16–18px, line-height 1.7
small/meta: Questrial, 13–14px
```

---

## 5. Global Components (reuse across all pages)

### Navigation
- Fixed top nav, dark background, logo left, links right
- Active state uses `--color-accent` underline
- Mobile: hamburger menu with slide-in drawer
- Links: Eiendommer | Ledige Lokaler | Fasiliteter | Parkering | Om Oss | Kontakt
- "Ledige Lokaler" is always a gold-accented CTA button in the nav

### Footer
- Dark background (`--color-dark`)
- 3 columns: Logo + tagline | Quick links | Contact info
- Bottom row: © Mustad Næringspark | Org.nr | Social icons
- Use real contact info from the existing site

---

## 6. Content Source

**All content must come from the existing site:** https://www.mustadnaeringspark.no

Scrape and reuse all Norwegian copy, headings, descriptions, and factual information across all pages. Do not invent content.

**Images:** Pull directly from Wix CDN URLs found in the existing site source. If a section requires an image not available from the site, source a high-quality relevant image from **Unsplash** (use direct `https://images.unsplash.com/` URLs). All images must be contextually relevant — Norwegian architecture, modern office interiors, business environments, Gjøvik landscape. Absolutely nothing generic or mismatched.

---

## 7. Page-by-Page Specifications

---

### 7.1 Homepage (`index.html`)

The homepage is a curated teaser for the entire site. It does not reproduce full page content — it previews it and sends users deeper.

**Sections in order:**

1. **Hero**
   - Full-viewport, dark overlay on a high-quality image of the park
   - Headline: "Gjøviks fremste næringspark" (Gjøvik's premier business park)
   - Subline: Short brand promise (pull from Om Oss copy)
   - Single primary CTA: "Se ledige lokaler →" linking to `ledige-lokaler.html`

2. **Park at a Glance** (Stats bar)
   - 4 stats in a horizontal row: total sqm, number of companies, year founded (Mustad heritage), number of buildings
   - Dark background, gold accent numbers, Questrial labels

3. **Our Properties** (preview strip)
   - Horizontal scrollable or grid of 5 property cards
   - Each card: property image, name, one-line description, "Les mer →"
   - Links to individual property pages

4. **Featured Available Spaces**
   - 3 listing cards pulled from current "Ledige lokaler" listings
   - Each card: image, sqm, building name, available-from date, key amenities as tags
   - CTA: "Se alle ledige lokaler →"

5. **Amenities Highlight**
   - 4-column visual grid: Kantine, Møterom, Treningssenter, Mustad Play
   - Icon + title + one-line description per tile
   - Links to `fasiliteter.html`

6. **Tenants / Social Proof**
   - Section heading: "Våre leietakere"
   - Logo wall of current tenant/sponsor logos (pull from Om Oss page)
   - Short trust line underneath

7. **Sustainability Teaser**
   - Split layout: image left, text right
   - Pull from Bærekraft page content
   - Link: "Les om vårt bærekraftsarbeid →"

8. **Latest News**
   - 3 blog post cards (pull from Siste nytt)
   - Image, date, headline, short excerpt
   - Link: "Se alle nyheter →"

9. **Footer CTA**
   - Full-width dark section before footer
   - "Ser du etter nye lokaler?" + contact button

---

### 7.2 Ledige Lokaler (`ledige-lokaler.html`)

This is the **primary conversion page**. It must be exceptional.

**Layout:**

- **Filter bar** (sticky below nav):
  - Filter by: Building (dropdown: Alle, Mustad Næringspark, Bright House, Åmodt, Støperiet)
  - Filter by: Size (dropdown: Alle, Under 100 kvm, 100–300 kvm, 300–600 kvm, 600+ kvm)
  - Filter by: Available from (dropdown: Nå, Innen 3 mnd, Innen 6 mnd)
  - Filters apply in real-time using JS (no page reload)

- **Listing Cards Grid** (2-column on desktop, 1 on mobile):
  Each card must include:
  - Property photo
  - Building name badge (color-coded per building)
  - Headline (e.g., "Trivelig og funksjonelle kontorlokaler")
  - Key specs as tags: sqm, available-from date, # of offices
  - Bullet list of 3–4 top amenity highlights
  - Two action buttons: "Les mer" (expands detail) + "Sammenlign" (adds to compare)

- **Compare Panel** (fixed bottom bar, hidden until 2 spaces are selected):
  - Shows 2–3 selected spaces side by side
  - Comparison rows: Størrelse, Bygg, Ledig fra, Pris/kvm (if available), Fasiliteter
  - "Nullstill sammenligning" button

- **Cost Estimator Widget** (sidebar or modal):
  - Input: Antall ansatte (number of employees)
  - Output: Anbefalt areal (recommended sqm, calculated at 10–15 kvm/person)
  - Output: Estimert månedskostnad (estimated monthly cost, calculated at approx. 1500 kr/kvm/year)
  - Disclaimer: "Dette er et estimat. Ta kontakt for eksakt prissetting."
  - Trigger: Sticky button "Beregn ditt behov 🧮" on the listings page

---

### 7.3 Individual Property Pages

One page per property. All follow the same template.

**Properties:**
- `eiendom-mustad-naeringspark.html` — Mustad Næringspark main building
- `eiendom-bright-house.html` — Bright House
- `eiendom-aamodt.html` — Åmodt
- `eiendom-stoperiet.html` — Støperiet
- `eiendom-bygg-for-deg.html` — Vi bygger for deg (build-to-suit)

**Template sections:**
1. Full-width hero image with property name overlay
2. Key stats bar: total sqm, floors, available units, year built
3. About this property (pull Norwegian copy from respective subpage)
4. Photo gallery (CSS grid masonry layout, lightbox on click)
5. Amenities included (icon list)
6. Current available spaces in this building (2–3 cards linking to ledige-lokaler.html filtered)
7. Contact CTA

---

### 7.4 Fasiliteter (`fasiliteter.html`)

Showcase all shared amenities. Consolidates: Kantine, Møterom, Treningssenter, Mustad Play.

**Sections:**
1. Page hero
2. Kantine — image, description, link to menu (pull from kantine page)
3. Møterom — image, room specs, booking info (pull from moterom page)
4. Treningssenter — image, membership info
5. Mustad Play — image, description (pull from mustadplay page)
6. Utendørsarealer — putting green, outdoor spaces

Each facility gets a full alternating-layout section (image + text), not just a card.

---

### 7.5 Parkering (`parkering.html`)

This page must be redesigned from the ground up. The current page is a static image with text.

**New layout:**

1. **Page hero** — short, dark, headline: "Parkering i Mustad Næringspark"

2. **Interactive Parking Map**
   - SVG-based map of the park with color-coded parking zones
   - Zone 2 (Leietakere/Tenants): Green
   - Zone 2 (Besøkende/Visitors): Yellow
   - Zone 5 (Premium/Paid): Blue
   - EV charging spots: highlighted separately
   - Click/hover on each zone reveals a tooltip with: zone name, rules, pricing, capacity
   - Use the existing overhead map image as reference/background for zone placement

3. **Zone Info Cards** (below map, 3 columns):
   - **Leietakere:** Gratis for registrerte leietakere. Ikke gyldig for studenter. Treningssenter-brukere: 2 timer gratis.
   - **Besøkende:** Man–fre 07:00–17:00: kr 15/time. Øvrig tid: Gratis.
   - **Sone 5 (Alle):** Man–fre 07:00–17:00: kr 37/time. Øvrig tid: Gratis.

4. **Payment Methods section**
   - Icons for: Vipps, EasyPark, Faktura
   - Parkly support info: Tel 70 30 99 88, support@parkly.no

5. **Guest Registration CTA**
   - Mocked UI for visitor plate registration (static form, no backend)
   - Heading: "Registrer besøkende"
   - Fields: Navn, Registreringsnummer, Dato, Varighet

6. **Støperiet parking note** — link/callout to Støperiet-specific parking rules

---

### 7.6 Om Oss (`om-oss.html`)

Consolidates: Bedriften, Ansatte, Bærekraft, Leietakere, Historien.

**Sections:**
1. Hero + brand statement ("Vi forvalter og utvikler spennende eiendommer...")
2. Timeline — Mustad industrial heritage from founding to today (pull from Historien page)
3. Team section — staff cards with photo, name, title (pull from Ansatte page)
4. Sustainability — key commitments, certifications (pull from Bærekraft page)
5. Tenants — logo wall + short description (pull from Leietakere page)
6. Sponsors — logos (pull from Om Oss page: Gjøvik Lyn, GT Golfklubb, Vardal IF, etc.)

---

### 7.7 Nyheter (`nyheter.html`)

- Masonry grid of blog post cards
- Each card: image, date, title, excerpt, "Les mer →"
- Pull all content from existing blog posts on the site

---

### 7.8 Kontakt (`kontakt.html`)

- Split layout: left = contact form (Navn, E-post, Telefon, Melding, Send), right = contact details + embedded Google Maps iframe for the park location in Gjøvik
- Below: team contact cards for key staff

---

## 8. Interaction & Animation Standards

- All page transitions: subtle fade-in on scroll using Intersection Observer API
- Card hover: translateY(-4px) + box-shadow increase, 200ms ease
- Nav: transparent on page top, solid dark on scroll
- Mobile: fully responsive, hamburger nav, stacked layouts
- Filters on Ledige Lokaler: instant JS filtering, no reload
- Compare panel: slides up from bottom on selection
- Cost estimator: appears as a modal or side panel, real-time calculation as user types
- Parking map tooltips: CSS + JS, no external library

---

## 9. Quality Standards

- **Zero placeholders.** Every image, every line of copy must be real or sourced.
- **Zero broken links.** All internal links must resolve to actual files in the project.
- **No lorem ipsum.** Ever.
- **Pixel-perfect spacing.** Use CSS custom properties for spacing scale (--space-xs through --space-xxl).
- **Consistent components.** Nav and footer must be visually identical across all pages.
- Before marking any page complete, verify: responsive on mobile width (375px), tablet (768px), desktop (1280px+).

---

## 10. Build Order

Build pages in this order. Do not skip ahead.

1. `styles.css` — full design system: variables, reset, typography, components
2. `script.js` — shared JS: nav scroll behavior, mobile menu, scroll animations
3. `index.html` — Homepage
4. `ledige-lokaler.html` — Available spaces with filters, compare, estimator
5. Individual property pages (all 5)
6. `fasiliteter.html`
7. `parkering.html`
8. `om-oss.html`
9. `nyheter.html`
10. `kontakt.html`

11. Design Skill — UI/UX Pro Max
This project uses the UI/UX Pro Max skill. All design decisions must operate at that level. Specifically:

Apply the full UI/UX Pro Max design methodology to every page and component
Before building any page, mentally run through: visual hierarchy, spacing rhythm, contrast ratios, interaction states, and responsive behavior
Use the skill's component patterns for cards, modals, filters, navigation, and forms
Apply the skill's motion and micro-interaction guidelines for all hover, focus, and transition states
Ensure all designs pass the skill's accessibility standards: minimum 4.5:1 contrast ratio, visible focus states, semantic HTML
When in doubt between two design approaches, always choose the one the skill would rate higher for clarity, usability, and visual polish