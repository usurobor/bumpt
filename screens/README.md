# screens/ — bump screens (source of truth)

One folder per screen, two files — the **Tapestry/MVVM split**:

- **`view.html`** — the desired *look* (the View): pixel-perfect, self-contained, opens
  anywhere. Named parts carry `data-component="<name>"`; on the real screen some are
  substituted by live data.
- **`spec.md`** — the *meaning* (the ViewModel): the **Components** table (name · shows ·
  data source · required), **Behavior** (events → effects), and **Acceptance**. A top
  comment lists the machine-checked required set:
  `<!-- required-components: logo, headline, rule -->`.

The view says what it looks like; the spec says what it is and does. The gates check
both: **prod ≈ view** (pixel ≤ 1%) and **required components render** (non-zero box) on
the deployed/prod page — a missing required component fails the build.

```
screens/
  home/   view.html  spec.md
  card/   view.html  spec.md
  about/  view.html  spec.md
  thanks/ view.html  spec.md
```

`main` carries only these. The build action (`.github/workflows/design-deploy.yml`)
takes each `view.html` + `spec.md`, assembles the deployable site (index + common
scaffolding) onto the **`design`** branch, and deploys it to **design.bumpt.io**.
Add a screen = add a folder.
