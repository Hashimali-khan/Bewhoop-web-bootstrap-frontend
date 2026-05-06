# Bewhoop — Frontend

**Bewhoop** is a dual-sided event platform that connects **event hosters** with **vendors** (photographers, caterers, musicians, and more). This repository contains the complete frontend implementation, built as a static multi-page application with Bootstrap 5, vanilla JavaScript (ES6), and custom CSS.

---

## Table of Contents

- [Overview](#overview)
- [Live Entry Points](#live-entry-points)
- [Project Structure](#project-structure)
- [User Flows](#user-flows)
  - [Hoster Flow](#hoster-flow)
  - [Vendor Flow](#vendor-flow)
- [Features & Implementation Highlights](#features--implementation-highlights)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Getting Started](#getting-started)
- [Architecture Notes](#architecture-notes)

---

## Overview

Bewhoop solves event planning friction by giving hosts a streamlined dashboard to create and manage events, track analytics, and browse a curated vendor marketplace — while vendors get their own onboarding and profile management flow to showcase their services.

The frontend is entirely client-side with no build tooling required, making it fast to set up and easy to integrate with any backend API.

---

## Live Entry Points

| Role   | Entry Page                                      |
|--------|-------------------------------------------------|
| Hoster | `hoster-flow/index.html`                        |
| Vendor | `vendor-flow/index.html`                        |

---

## Project Structure

```
Bewhoop-web-bootstrap-frontend/
│
├── hoster-flow/                    # All hoster-facing screens
│   ├── index.html                  # Landing / role-select screen
│   ├── style.css                   # Shared hoster stylesheet
│   │
│   ├── onboarding-screens/         # Hoster sign-up & onboarding
│   │   ├── signup.html             # Account creation form
│   │   ├── signup.js               # Signup logic
│   │   ├── onboarding-final.html   # Event preferences & tag input
│   │   ├── onboarding-tags.js      # Dynamic tag-input component
│   │   └── style-final.css         # Onboarding-specific styles
│   │
│   ├── pages/                      # Authenticated hoster app screens
│   │   ├── dashboard.html          # Analytics dashboard
│   │   ├── create-event-step1.html # Event wizard — details & photos
│   │   ├── create-event-step2.html # Event wizard — tickets
│   │   ├── create-event-step3.html # Event wizard — schedule & review
│   │   ├── vendor-list.html        # Vendor marketplace
│   │   └── vendor-profile.html     # Individual vendor profile view
│   │
│   ├── components/                 # Reusable HTML component snippets
│   │   ├── shared-sidebar.html     # Sidebar navigation markup
│   │   └── shared-header.html      # Top header bar markup
│   │
│   ├── js/
│   │   ├── core.js                 # Main BewhoopApp class (shared logic)
│   │   └── dashboard.js            # Dashboard-specific JS (Chart.js)
│   │
│   ├── create-event-step1.js       # Step 1 wizard logic (photo upload, toggle)
│   ├── create-event-step2.js       # Step 2 wizard logic (ticket CRUD)
│   └── create-event-step3.js       # Step 3 wizard logic
│
└── vendor-flow/                    # All vendor-facing screens
    ├── index.html                  # Vendor landing / role-select
    ├── signup.html                 # Vendor registration + OTP modal
    ├── signup.js                   # OTP modal trigger logic
    ├── Addprofilepage.html         # Profile setup step 1 (photo & bio)
    ├── Addprofilepage2.html        # Profile setup step 2
    ├── addprofilepage3.html        # Profile setup step 3
    ├── db1.html                    # Vendor dashboard
    ├── dbedit.html                 # Vendor profile editor
    └── index.css                   # Vendor-specific base styles
```

---

## User Flows

### Hoster Flow

```
index.html  ──►  onboarding-screens/signup.html
                        │
                        ▼
              onboarding-screens/onboarding-final.html   (event preferences + tag input)
                        │
                        ▼
              pages/dashboard.html    ◄──────────────────────────┐
                        │                                         │
              ┌─────────┼─────────────────┐                      │
              ▼         ▼                 ▼                       │
    create-event-    vendor-list.html  vendor-profile.html        │
    step1.html           (marketplace)                            │
         │                                                        │
         ▼                                                        │
    create-event-step2.html  ──►  create-event-step3.html ───────┘
```

**Key screens:**

| Screen | What it does |
|--------|-------------|
| **Landing** | Split-panel role selector — Create an Event or Sign In |
| **Sign Up / Onboarding** | Multi-step onboarding ending with event-type tag selection |
| **Dashboard** | Event analytics chart (Chart.js), KPI cards, filterable events table with date picker |
| **Create Event (3 steps)** | Wizard for event title/photos → ticket tiers → schedule/review |
| **Vendor Marketplace** | Searchable, tagged vendor card grid |
| **Vendor Profile** | Detailed individual vendor view |

---

### Vendor Flow

```
index.html  ──►  signup.html  ──►  [OTP Modal]
                                        │
                                        ▼
                              Addprofilepage.html   (photo upload + bio)
                                        │
                                        ▼
                              Addprofilepage2.html  (service details)
                                        │
                                        ▼
                              addprofilepage3.html  (final preferences)
                                        │
                                        ▼
                                   db1.html         (vendor dashboard)
```

---

## Features & Implementation Highlights

### OES6 Class-Based Application Core (`js/core.js`)

All shared logic is encapsulated in a single `BewhoopApp` class, instantiated once on `DOMContentLoaded`. This eliminates global variable pollution and provides a clean, predictable API across pages:

```js
class BewhoopApp {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }
    // initializeSidebar, initializeHeader, initializeSearch,
    // initializeFormValidation, initializePagination, initializeDashboardFilters …
}
window.bewhoopApp = new BewhoopApp();
```

**Modules managed by the core:**

- **Sidebar** — mobile toggle with overlay, click-outside-to-close
- **Navigation state** — auto-highlights the active nav link based on `window.location.pathname`
- **Notifications** — badge count decrements per read item; "View All" clears all at once
- **Language selector** — switches flag + label in the header; persists selection to `localStorage`
- **Search** — typed search filters event table rows (by name/location) or vendor cards (by name/role/location) without a page reload
- **Form validation** — real-time `blur`/`input` validation for required fields, email format, phone format, and numbers; renders Bootstrap `invalid-feedback` messages inline
- **Pagination** — wired up, ready to connect to an API
- **Dashboard filters** — festival dropdown, date dropdown, Flatpickr date picker, and reset button

### Multi-Step Event Creation Wizard

Three discrete HTML pages share one sidebar + header component and pass control sequentially via `window.location.href`. Each step is self-contained with its own JS file, keeping logic small and focused.

- **Step 1** — Event title input, drag-and-drop photo upload zone (with file preview and delete), ticketed toggle switch
- **Step 2** — Ticket tier CRUD (add/edit/delete VIP, General, etc. with quantity and price)
- **Step 3** — Schedule and final review before submission

### Dynamic Tag Input (Onboarding)

`onboarding-tags.js` powers the event-type tag input on the final onboarding screen. Users type and press `,` to add custom tags, or click quick-add suggestion chips. Tags render inline within the input container and can be individually removed.

### Vendor Marketplace

A CSS Grid (via Bootstrap's `col-lg-4 col-md-6`) of vendor cards featuring:
- Profile image, verified badge icon, role, location, and price range
- Skill tags (e.g. Videography, Photography, Catering)
- Entire card is a stretched `<a>` link to the vendor profile — accessible and touch-friendly

### OTP Verification Modal (Vendor Signup)

On form submit the page intercepts the default action and programmatically triggers a Bootstrap modal prompting OTP entry, keeping the user on the same page without a redirect until verification is complete.

### Profile Photo Upload (Vendor Onboarding)

A circular upload zone listens for a `<input type="file">` change event, reads the file with `FileReader`, and replaces the placeholder icon with the actual image preview — no libraries required.

### Analytics Dashboard

- **Chart.js** line chart for "Event Views Analytics" over the last 7 days
- KPI summary cards: CTR, Conversion Rate, Attendees, Tickets Sold
- **Flatpickr** date picker for custom date range selection
- Filterable events table with status badges (Reviewing / Published) and pagination

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| HTML5 | — | Semantic page structure |
| CSS3 | — | Custom styles, responsive layout |
| Bootstrap | 5.3.2 | Grid, components, utilities |
| Bootstrap Icons | 1.11.3 | Icon library |
| JavaScript (ES6) | — | Application logic (no framework) |
| Chart.js | 4.4.0 | Dashboard analytics chart |
| Flatpickr | latest | Date/time picker |
| Google Fonts | — | Bricolage Grotesque, Poppins, Inter |

All dependencies are loaded from CDN — no `npm install` required.

---

## Design System

### Brand Colour

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#BE0000` | Buttons, badges, accent elements |
| Primary Dark | `#a30000` | Hover/active states |
| Primary Gradient | `linear-gradient(to right, #a32920, #8e1e17)` | Landing CTA button |

### Typography

| Font | Weight(s) | Used in |
|------|-----------|---------|
| Bricolage Grotesque | 200–800 | Hoster app — headings, nav |
| Poppins | 400, 500, 600, 700 | Onboarding screens |
| Inter | 400, 500, 600, 700 | Vendor flow forms |
| Segoe UI | system | Vendor landing page fallback |

### Layout Patterns

- **Split panel** — 60/40 or 50/50 split for all auth/onboarding screens (left: illustration, right: form)
- **Sidebar + main** — fixed sidebar with `page-wrapper` / `main-content` pattern for the authenticated app
- **Card grid** — Bootstrap `g-4` gutter for vendor marketplace and dashboard KPIs
- **Responsive breakpoints** — sidebar collapses to overlay drawer below `lg`; buttons and panels stack below `md`

---

## Getting Started

No build step is required. Simply open any HTML file directly in a browser, or serve the repo root with any static file server:

```bash
# Clone the repository
git clone https://github.com/Hashimali-khan/Bewhoop-web-bootstrap-frontend.git
cd Bewhoop-web-bootstrap-frontend

# Serve with any static server, e.g. VS Code Live Server, Python, or npx
npx serve .
# or
python3 -m http.server 8080
```

Then navigate to:
- **Hoster flow:** `http://localhost:8080/hoster-flow/index.html`
- **Vendor flow:** `http://localhost:8080/vendor-flow/index.html`

> **Note:** Image assets (logos, vendor photos, background images) are referenced locally and must exist in the expected paths for the UI to render fully.

---

## Architecture Notes

- **No build tooling** — the project is intentionally zero-config to stay portable and backend-agnostic. Any bundler (Vite, Webpack) can be added on top without changes to the HTML/CSS/JS.
- **Shared components** — `components/shared-sidebar.html` and `components/shared-header.html` hold the canonical markup. Because there is no server-side include or bundler, the markup is currently duplicated across pages; a backend template engine (Jinja2, EJS, Blade) or a lightweight include solution would eliminate this.
- **API-ready hooks** — `core.js` methods like `filterDashboardData()`, `handlePagination()`, and `handleLogout()` are wired up with `console.log` placeholders, making it straightforward to swap in `fetch` calls to a REST or GraphQL API.
- **localStorage** — used for language preference persistence. Can be extended for auth tokens or draft event data.
