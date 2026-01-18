# Personal Website (Github Pages)

This repository contains the source for my personal site.

Live site: [jollymancan.github.io](https://jollymancan.github.io/)

## Pages
- `index.html` — Home
- `about.html` — About
- `projects.html` — Projects
- `resume.html` — Resume

## Structure
- `assets/css/` — styles
- `assets/js/` — scripts (theme toggle, headline typing)
- `assets/img/` — images (project thumbnails, profile photo, noise texture)

## Local preview
Open `index.html` directly, or run a simple local server:

Python:
python -m http.server 8000

Then visit:
http://localhost:8000

## Notes
- The Projects page uses compact side-by-side cards with small thumbnails.
- The homepage headline includes a typing effect and stops on “a learner.”
- The background grain uses `assets/img/noise.png`. If you remove that file, delete the related CSS block.
