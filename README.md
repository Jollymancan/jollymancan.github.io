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


## Courses page

`courses.html` lists technical coursework in two columns: Mathematics & Statistics (left), Computer Science (right). It is linked from the main navigation. Descriptions are paraphrased from the UW–Madison Course Guide, with course-specific materials used for CS 639, CS 760, CS 544, and CS 564. See their course links and the UW Guide pages at https://guide.wisc.edu/courses/ .

**Keeping it updated:** To add your opinion to any course, replace the HTML comment beneath its description with `<p class="course-opinion">My thoughts...</p>`. Add a new `<article class="course-item">` to extend either column. Do not list a course as completed until it is finished; CS 566 is marked 'in progress'.

(H) is shown on MATH 421 based on your earlier description of the course as honors; your supplied unofficial transcript does **not** explicitly designate MATH 421 as honors. Verify this before publishing if you want (H) to indicate transcript-certified honors credit. (G) identifies graduate-level content for CS 760 and MATH 632, not a claim that the latter was restricted to graduate students. Transfer credit is identified for introductory courses; the transcript doesn't list MATC Calculus III yet.
