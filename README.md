# Bewhoop Frontend

Bewhoop is a dual-sided event platform that connects event hosters with vendors such as photographers, caterers, musicians, and other service providers. This repository contains the complete frontend as a static multi-page application built with Bootstrap 5, vanilla JavaScript, and custom CSS.

The project is intentionally framework-free and build-free. You can open the HTML files directly in a browser or serve the repository with any static file server.

## Entry Points

| Area | Entry |
|---|---|
| Public landing | [index.html](index.html) |
| Hoster flow | [hoster-flow/index.html](hoster-flow/index.html) |
| Vendor flow | [vendor-flow/index.html](vendor-flow/index.html) |

## What Lives Where

```text
Bewhoop-web-bootstrap-frontend/
├── index.html                     # Root landing page with links into both flows
├── hoster-flow/                   # Hoster-facing app and onboarding
│   ├── index.html                 # Hoster landing page
│   ├── components/                # Shared sidebar/header fragments
│   ├── js/
│   │   ├── core.js                # App bootstrap and shared controller
│   │   └── modules/               # Small feature modules loaded by core.js
│   ├── onboarding-screens/        # Hoster signup and onboarding screens
│   ├── pages/                     # Dashboard, event wizard, vendor marketplace
│   └── create-event-step*.js      # Step-specific event wizard logic
└── vendor-flow/                   # Vendor-facing signup and profile flow
    ├── index.html                 # Vendor landing page
    ├── signup.html / signup.js    # Signup and OTP modal behavior
    ├── Addprofilepage*.html       # Profile setup steps
    └── db*.html                   # Vendor dashboard and editor screens
```

## Hoster Flow

The hoster flow starts at [hoster-flow/index.html](hoster-flow/index.html), moves through onboarding, and then opens the dashboard and event management pages.

Typical path:

```text
index.html -> onboarding-screens/signup.html -> onboarding-screens/onboarding-final.html
            -> pages/dashboard.html -> pages/create-event-step1.html
            -> pages/create-event-step2.html -> pages/create-event-step3.html
```

Key hoster screens:

| Screen | Purpose |
|---|---|
| Landing | Role selection and entry into the hoster experience |
| Signup / onboarding | Account creation and event preference setup |
| Dashboard | Analytics, event summary cards, and filters |
| Event wizard | Three-step event creation flow |
| Vendor marketplace | Browse vendor cards and profiles |

## Vendor Flow

The vendor flow starts at [vendor-flow/index.html](vendor-flow/index.html) and guides a vendor through signup, profile creation, and their dashboard.

Typical path:

```text
index.html -> signup.html -> Addprofilepage.html -> Addprofilepage2.html
            -> addprofilepage3.html -> db1.html -> dbedit.html
```

Key vendor screens:

| Screen | Purpose |
|---|---|
| Landing | Vendor entry point |
| Signup | Registration with OTP modal flow |
| Profile setup | Multi-step service and bio setup |
| Dashboard | Vendor summary and management page |
| Profile editor | Update vendor profile details |

## Implementation Highlights

### Shared Hoster Shell

Hoster pages reuse the same sidebar and header fragments from [hoster-flow/components/shared-sidebar.html](hoster-flow/components/shared-sidebar.html) and [hoster-flow/components/shared-header.html](hoster-flow/components/shared-header.html). The shell module loads those fragments at runtime so the markup stays centralized.

### Modular Core Script

[hoster-flow/js/core.js](hoster-flow/js/core.js) now acts as a coordinator instead of a monolith. It loads small feature modules from [hoster-flow/js/modules/](hoster-flow/js/modules/) for:

- sidebar behavior
- header behavior
- search bindings
- form validation
- pagination controls
- dashboard filters
- shell hydration

### User-Facing Behaviors

- Sidebar toggles on smaller screens and keeps the active section highlighted.
- Search updates vendor and event views without a page reload.
- Form validation shows inline Bootstrap feedback.
- Logout clears local state and returns the user to the public landing page.
- Dashboard filters and pagination now surface real UI feedback instead of placeholder logging.

### Static Validation

A GitHub Actions workflow checks deployable HTML pages for broken local references so regressions like missing assets or incorrect relative paths are caught early.

## Tech Stack

| Technology | Role |
|---|---|
| HTML5 | Page structure |
| CSS3 | Custom styling and responsive layout |
| Bootstrap 5.3.2 | Grid, utilities, and components |
| Bootstrap Icons | Iconography |
| JavaScript (ES6) | Client-side behavior |
| Chart.js | Hoster dashboard chart |
| Flatpickr | Date picking |
| Google Fonts | Typography |

All dependencies are loaded from CDN or local files. No install step is required.

## Design Notes

- The hoster flow uses a bold red brand palette with a dashboard-first layout.
- The vendor flow keeps a lighter, form-oriented structure for signup and profile setup.
- Layouts are based on split panels, card grids, and a fixed sidebar pattern on larger screens.

## Getting Started

Run the project with any static server:

```bash
git clone https://github.com/Hashimali-khan/Bewhoop-web-bootstrap-frontend.git
cd Bewhoop-web-bootstrap-frontend

python3 -m http.server 8080
```

Then open:

- [http://localhost:8080/index.html](http://localhost:8080/index.html)
- [http://localhost:8080/hoster-flow/index.html](http://localhost:8080/hoster-flow/index.html)
- [http://localhost:8080/vendor-flow/index.html](http://localhost:8080/vendor-flow/index.html)

## Deploying To Vercel

This repository is ready for a static Vercel deployment.

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Keep the framework preset as `Other`.
4. Leave the build command empty.
5. Use the repository root as the output directory.

The root [index.html](index.html) is the public landing page and links to both flows.

## Architecture Notes

- The project stays zero-config so it remains portable and easy to deploy.
- Hoster pages now use a modular client-side shell instead of duplicating all shared behavior in one file.
- Shared fragments are kept in the `components/` directory and hydrated at runtime.
- The refactored core is safer on pages with partial DOM because it now uses guard checks before attaching behavior.
- The static validation workflow protects against broken relative links and missing local assets.
