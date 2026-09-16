# Campus GPA

> A private, offline-first academic dashboard for calculating GPA, planning targets, and tracking semester progress.

<p align="center">
  <a href="https://itzgarg1603-dev.github.io/campus-gpa/"><strong>Open the live app →</strong></a>
</p>

Campus GPA is a no-build web app made with semantic HTML, modern CSS, and vanilla JavaScript. It runs entirely in the browser: there is no account, backend, framework, or server-side data collection.

## Live links

| Resource | Link |
| --- | --- |
| Live dashboard | [itzgarg1603-dev.github.io/campus-gpa](https://itzgarg1603-dev.github.io/campus-gpa/) |
| GitHub repository | [itzgarg1603-dev/campus-gpa](https://github.com/itzgarg1603-dev/campus-gpa) |

## What you can do

### Track semesters

- Add subjects with a name, credit value, and grade.
- Calculate each semester's SGPA using credit-weighted grade points.
- View, edit, expand, and delete semester records.
- See total credits, best semester, cumulative CGPA, and a semester performance chart.

### Plan your progress

- Switch between 10-point and 4-point grading scales.
- Use the target CGPA planner to calculate the average needed across remaining credits.
- Preview the effect of a hypothetical subject with the Grade Impact Simulator.
- Set an academic target, credit goal, and personal milestone.

### Keep your data yours

- Student name, university, roll number, semesters, goals, and preferences are saved locally in the browser.
- Export a complete JSON backup at any time.
- Import backups with structure and grade validation; invalid files are rejected without overwriting current data.
- Print a clean result summary for records or advising appointments.

## Calculation

Campus GPA uses credit-weighted averages:

```text
SGPA = Σ(subject credits × grade points) ÷ Σ(subject credits)
CGPA = Σ(semester credits × SGPA) ÷ Σ(semester credits)
```

The available grade points depend on the selected scale:

- **10-point scale:** A+ (10), A (9), B+ (8), B (7), C (6), D (5), F (0)
- **4-point scale:** A (4), B (3), C (2), D (1), F (0)

## Run locally

No package installation is required.

### Option 1: Open directly

Open `index.html` in a modern browser.

### Option 2: Use a local static server

```bash
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Project structure

```text
campus-gpa/
├── index.html    # Accessible application markup
├── styles.css    # Responsive layout, themes, and print styles
├── app.js        # GPA calculations, state, interactions, and validation
├── .nojekyll     # Keeps GitHub Pages serving files directly
└── README.md     # Project documentation
```

## Deployment

The production site is deployed with GitHub Pages from the `main` branch and the repository root (`/`).

To deploy your own fork:

1. Push the project to GitHub.
2. Open **Settings → Pages**.
3. Set the source to **Deploy from a branch**.
4. Select `main` and the `/ (root)` folder.
5. Save and wait for GitHub Pages to publish the site.

## Privacy and backups

Campus GPA stores data under the browser storage key `campus-gpa-v1`. Data is scoped to the current browser profile and device; a different person or device starts with an empty dashboard. Clearing browser storage removes saved records, so export a JSON backup before clearing data or switching devices.

## Accessibility and browser support

The interface includes semantic landmarks, skip navigation, visible keyboard focus states, accessible dialog controls, reduced-motion support, responsive mobile layouts, empty states, and a dark theme. Use a current version of Chrome, Edge, Firefox, or Safari for the best experience.

## License

No license has been specified yet. Add a license file before distributing or reusing the project outside its repository.
