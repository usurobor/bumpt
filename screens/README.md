# screens/ — bump screens (source of truth)

One folder per screen. Each holds two files:

- **`view.html`** — the screen, pixel-perfect and **self-contained** (inline CSS/JS, opens anywhere).
- **`spec.md`** — route, copy, acceptance.

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
