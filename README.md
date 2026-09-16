# Campus GPA

Campus GPA is a mobile-first, offline-first GPA dashboard built with semantic HTML, responsive CSS, and vanilla JavaScript. It has no framework, bundler, backend, or install step.

[**Open the live Campus GPA dashboard →**](https://itzgarg1603-dev.github.io/campus-gpa/)

## Features

- Add, edit, expand, and delete semester records with subject name, credits, and grade.
- Accurate credit-weighted SGPA and cumulative CGPA calculations.
- Configurable 10-point and 4-point grading scales.
- Semester performance chart, best semester, credit totals, and goal progress.
- Target CGPA planner for remaining-credit scenarios.
- Academic goals for target CGPA, credit completion, and a personal milestone.
- Browser `localStorage` persistence, safe JSON export/import validation, and printable summaries.
- Responsive mobile layout, semantic landmarks, keyboard focus states, reduced-motion support, empty states, and dark mode.

## Run locally

Open `index.html` directly in a browser. For a local static server, use any static server, for example:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Data and grading

Data is stored only in the current browser under `campus-gpa-v1`. Export a JSON backup before clearing browser data. Imported backups must contain a valid semester and subject structure; invalid files are rejected without changing current data.

CGPA is calculated as:

`sum(subject credits × grade points) / sum(subject credits)`

## Deploy

The production app is published from the `main` branch using GitHub Pages:

- **Live app:** https://itzgarg1603-dev.github.io/campus-gpa/
- **Repository:** https://github.com/itzgarg1603-dev/campus-gpa
- **Source branch:** `main`

The app is static and GitHub Pages-ready. Publish the repository root from the `main` branch in **Settings → Pages**, or use the GitHub Pages workflow in your own deployment setup.
