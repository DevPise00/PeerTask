# PeerTask

A zero-middleman, hyper-local skill exchange and direct-hiring platform.
Two modes: **Barter** (skill-for-skill) and **Direct Pay** (0% platform cut).

## Run locally

Just open `index.html` in any browser, or serve the folder:

```bash
# Python
python -m http.server 5500
# Node (if installed)
npx serve .
```

Then visit http://localhost:5500

## Files

- `index.html` — semantic HTML with hero, tabs, modals
- `style.css` — design system (CSS variables, responsive)
- `app.js` — state, validation, search, modals, dynamic SVG chart
- `backend/` — Spring Boot REST outline to swap for `localStorage`

## Deploy

Easiest: **Netlify Drop** — drag this folder onto https://app.netlify.com/drop
