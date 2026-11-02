# Pranit Reddy — minimal academic website

A lightweight, single-page academic homepage styled after the dark, isometric aesthetic of DavidJ's website and the spare structure of traditional research-group/faculty homepages.

## Deploy

Copy **everything inside this folder** to the root of the `jollymancan.github.io` GitHub repository (not the folder itself). GitHub Pages can serve the site without a build step. The `CNAME` file preserves the custom domain `jolly.fyi`.

To preview locally:

```bash
python3 -m http.server 8000
```

Then go to `http://localhost:8000`.

## Content

- `index.html`: intro, research, selected projects, and links.
- `assets/site.css`: design and responsive layout.
- `assets/site.js`: small decorative isometric illustration; no frameworks or dependencies.
- `Resume.pdf`: the more recently uploaded `Preddy_CResume(1).pdf`. The older CV is **not** included.

There is intentionally **no work experience section** and no discussion of continual learning, on-policy distillation, or LLMs. Research is described as ongoing work rather than publications. Update the short text in `index.html` directly as your work develops.
