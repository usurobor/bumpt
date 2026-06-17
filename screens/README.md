# screens/ — bump screens (design source of truth)

One folder per screen. Each holds the **mock** (what it should look like) and a
short **spec** (route, copy, acceptance). The experiment app is built to match.

```
screens/
  app.css, bump.js        # shared design system
  reference/              # original look & feel (html + pdf)
  index.html              # link board (served at design.bumpt.io)
  home/   mock.html  spec.md
  card/   mock.html  spec.md
  about/  mock.html  spec.md
  thanks/ mock.html  spec.md
```

- `design.bumpt.io` serves `index.html`; each link opens that screen's `mock.html`
  full-bleed. Flow: **card → about → thanks**.
- Any change under `screens/` on `main` auto-redeploys.
- A cell builds a screen from its `mock.html` + `spec.md` into the app on `dev`
  (with the test); the screen folder is the contract.
