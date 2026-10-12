# Clone and Chrome investigation

Date: 2026-10-12  
Project: Nyaralo holiday booking application  
Commit tested: `dfb2a66`

## Result

A fresh local clone installed, started, loaded in Chrome, and successfully saved a booking. There is no evidence from these tests that Chrome itself prevents this project from working. The friend's exact failure is still unconfirmed because their error message, launch URL, and Node version were not provided.

Git cloning, dependency installation, server startup, and browser use are separate stages. If `git clone` itself fails in the terminal, changing Firefox to Chrome will not fix that failure.

## Tests performed

Tests used a separate temporary clone, its own new database, and an isolated Chrome browser context. The original application's code and database were not changed.

| Test | Result |
| --- | --- |
| Local `git clone --no-hardlinks` of the checked-out repository | Passed |
| Root `npm ci --no-audit --no-fund` | Passed: 140 packages installed |
| `npm start` without a copied `.env`, with test port 3187 | Passed; schema and seed data created automatically |
| Chrome 155 on Windows, Node 26.3.0, npm 11.16.0 | Home page loaded; six calendar months rendered |
| GET `/api/bookings?status=elfogadva` | HTTP 200; two seeded accepted bookings returned |
| Chrome booking form: March 10–12, 2027, two guests | Passed; 56,000 Ft calculated and booking persisted as ID 7 in the test database |
| Static frontend served separately on port 5501 | Reproduced incorrect API URL and HTTP 404 |
| Calendar arrival/departure highlighting in Asia/Bangkok | Reproduced incorrect boundary dates |

The local clone test does not test the friend's GitHub access, credentials, network, or machine. Firefox was not independently tested. Successful installation here does not guarantee native dependencies install on every OS or Node version.

## Findings

### 1. Wrong API address when using another frontend port — confirmed

Location: `frontend/js/config.js:33–35`.

Only frontend port `5500` has a special fallback to `http://localhost:3000/api`. On other HTTP ports the frontend assumes the API is on the same origin.

At `http://localhost:5501`, Chrome requested `http://localhost:5501/api/bookings?status=elfogadva`, which returned 404 from the static server. A friend whose Live Server uses 5501 can therefore see failures while another person's setup works.

Workaround: start the Node server and open the URL it prints, normally `http://localhost:3000`. Use that same URL in both browsers. A permanent fix should make the API address explicit when frontend and backend are served separately, or provide a development proxy.

### 2. Failed calendar requests silently display fake availability — confirmed

Location: `frontend/js/calendar.js:4–15`.

When fetching or parsing bookings fails, the calendar silently switches to hard-coded July/August 2025 bookings. This happened during the port-5501 test. The page can look functional even though it has no connection to the real booking API.

Recommended fix: check `res.ok` and the response shape, display a clear loading error, and prevent users from interpreting fallback data as real availability.

### 3. Calendar mixes UTC dates and local dates — confirmed

Location: `frontend/js/calendar.js:18–22,49`.

Booking strings are parsed with `new Date('YYYY-MM-DD')`, while calendar cells use local midnight via `new Date(year, month, day)`.

In the tested Asia/Bangkok time zone, the accepted October 16–18, 2026 booking produced:

| Day | Expected occupied | Actual occupied |
| --- | --- | --- |
| October 16, arrival | true | false |
| October 18, departure | false | true |

Recommended fix: compare consistently formatted calendar-date strings or construct all compared dates consistently in local time. This is a time-zone bug demonstrated in Chrome, not evidence of a Chrome-only bug.

### 4. Setup instructions omit Node requirements — installation risk

Locations: root and backend `package.json`, `package-lock.json`, `README.md:195`.

The README only provides `npm install` and `npm start`; neither package manifest declares a Node engine. The locked `sqlite3@6.0.1` requires Node `>=20.17.0`; some locked dependencies require `^20.17.0 || >=22.9.0`.

A different Node version or native-addon installation environment could explain a friend's installation failure. Installation succeeded here; this remains a candidate cause until their terminal output is available. The installation also printed native install-script warnings, but startup and SQLite operations subsequently succeeded in this environment.

Recommended fix: document and pin a tested Node version, and use `npm ci` for reproducible installs.

### 5. Local files are intentionally absent from clones — setup difference

Locations: `.gitignore`, `backend/.env.example`, `backend/app.js:8–18,173–175`.

`.env`, `node_modules`, and `nyaralo.db*` are ignored by Git. A friend does not inherit the developer's local configuration, dependencies, or bookings. A fresh database was correctly generated during this test.

Guest booking works without `.env` in the tested setup. The `/users/login` route uses `TOKEN_SECRET` with no default, so authentication needs that environment variable configured. The current admin page does not implement a login flow; this is not a demonstrated cause of the guest-page failure.

### 6. Calendar initialization depends on an external icon script — code-review finding

Location: `frontend/index.html:8,183–184`.

`lucide.createIcons()` runs before `initCalendar()`. If the external Lucide script is unavailable, the resulting exception prevents calendar initialization. Tailwind and images also depend on external hosts. These resources loaded during the Chrome test; blocking them on the friend's machine was not tested.

Recommended fix: make icon initialization optional and independent from calendar initialization, and pin or serve required assets locally.

## Steps to share with your friend

From the cloned project's root folder:

```powershell
node --version
npm --version
git rev-parse --short HEAD
npm ci
npm start
```

Keep the server terminal running and open the printed server URL, normally `http://localhost:3000`, in Chrome. Test Firefox at exactly the same URL for comparison. Do not use a separate Live Server port for this initial comparison.

If authentication is needed, copy `backend/.env.example` to `backend/.env` only if it does not already exist, then set a unique `TOKEN_SECRET` and restart the server.

Do not use `npm run init-db` as a general troubleshooting step on an existing database: `database/tesztadatok.sql` deletes existing bookings and admin records before inserting demo data.

If the problem persists, collect the exact failed command and error, the browser address, OS, Node/npm versions, commit ID, and the failed request's URL/status in Chrome DevTools. Remove secrets before sharing. Those details will establish which finding, if any, explains the friend's issue.

## Suggested fix order

1. Document the supported Node version and the single-server launch URL.
2. Correct API routing for separate frontend servers and replace fake calendar fallback data with an error state.
3. Fix calendar date comparisons.
4. Remove calendar initialization's dependency on the icon CDN.

This investigation adds this report only; application fixes have not been applied.
