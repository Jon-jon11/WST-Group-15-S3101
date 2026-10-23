# GovReady

GovReady is a Government Document Requirement Checker for common Philippine IDs. Users select the document they need, their age, employment status, and whether they are a first-time applicant to get a personalized checklist of required documents, estimated fees, and where to apply.

WST Group 15 – S3101

## Features

- **Requirement Checker** – personalized checklist for the Driver's License, Passport, PhilHealth ID, National ID, and Postal ID, with fees, appointment info, and where to apply.
- **Step-by-step guides** for each document, linked from the checker results.
- **Message forms with a backend** (Milestone 2) – the home, About, and Contact forms send messages to an Express server, which saves them so the team can read them later. See [Messages (Backend Feature)](#messages-backend-feature).
- **Editable requirements and fees** (Milestone 2) – an admin page lets the team change the wording, fees, and guide steps without editing code. See [Editing Requirements and Fees](#editing-requirements-and-fees-backend-feature).

**Built with:** HTML, CSS, and JavaScript on the front end (no framework, no build step), and Node.js with Express on the back end. Messages and content edits are stored in JSON files, not a database.

## Getting Started

You need [Node.js](https://nodejs.org) 18 or newer. Check with `node -v`.

1. Install the dependencies (once):

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open <http://localhost:3000> in your browser. Stop the server with `Ctrl+C`.

If port 3000 is already in use, set a different one, for example `PORT=3001 npm start` (macOS/Linux/Git Bash) or `$env:PORT = "3001"; npm start` (PowerShell).

The Requirement Checker and guides are plain browser code, so they also work if you open `index.html` directly. The message forms need the server running; without it they show a "couldn't send" error.

## Messages (Backend Feature)

The question form on the home page, the "Have Questions?" form on the About page, and the Contact form all send their message to the server. The server validates it again, adds an ID and timestamp, and saves it to `data/messages.json`. That file is created on the first message and survives server restarts. It is ignored by git because it holds people's names and emails.

While a message is sending, the form shows "Sending..." and disables the button. On success it shows a thank-you message. If something is wrong, errors appear under the matching field, or a red alert appears if the server cannot be reached.

### Try it

1. Start the server (`npm start`) and open <http://localhost:3000/contact.html>.
2. Submit the form once empty to see the validation errors, then fill it in and send it.
3. Open `data/messages.json` in your editor to see the saved message, or read it through the API as described below.
4. Stop and restart the server. The message is still there.

### Reading saved messages through the API

Reading messages is protected by a token so the list is not public:

1. Copy `.env.example` to `.env` (`copy .env.example .env` in Windows, `cp .env.example .env` elsewhere).
2. Open `.env` and set `ADMIN_TOKEN` to any secret you like. `.env` is ignored by git.
3. Restart the server, then request the list.

PowerShell:

```powershell
$token = (Select-String -Path .env -Pattern '^ADMIN_TOKEN=').Line.Split('=')[1]
Invoke-RestMethod -Uri http://localhost:3000/api/messages -Headers @{ Authorization = "Bearer $token" }
```

macOS, Linux, or Git Bash:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/messages
```

If `ADMIN_TOKEN` is not set, the list stays disabled (the request returns `401`), but the forms still work and still save messages.

### API

| Route | What it does |
| --- | --- |
| `POST /api/messages` | Saves a message. Body: `{ source, message }`, plus `name` and `email` when `source` is `contact`. `source` is `home`, `about`, or `contact`. Returns `201`, or `400` with per-field errors. |
| `GET /api/messages` | Lists saved messages. Requires the header `Authorization: Bearer <ADMIN_TOKEN>`. |

Limits: 2000 characters per message, 10 submissions per minute per address.

## Editing Requirements and Fees (Backend Feature)

The requirements, fees, locations, notes, and guide steps still start out in `js/data.js`. The admin page lets the team change that wording without touching code:

1. Make sure `ADMIN_TOKEN` is set in `.env` (see above) and the server is running.
2. Open <http://localhost:3000/admin.html> and enter the token.
3. Open a document, change any text, and press **Save**. Visitors see the new text on the Requirement Checker and the How-To Guides straight away. **Reset** puts back the original wording.

How it works: the server keeps a list of edits in `data/content.json`, as *original text → new text*. The checker and guides load that list from `GET /api/content` and swap in the new wording when they render. Anything without an edit keeps the text from `data.js`, so `data.js` stays the single source of defaults. If the server cannot be reached (for example when `index.html` is opened as a file), the site simply shows the `data.js` text.

Notes:
- An edit replaces that exact wording everywhere it appears (for example a requirement used by two documents).
- Edits change **text only**. Who qualifies for what (ages, first-time vs renewal, appointment rules) is logic in `data.js` and still needs a code change. Fees for a different age group are separate pieces of text and can be edited one by one.
- If a developer later changes a sentence in `data.js`, an old edit for the previous wording no longer matches and is ignored. Reset it from the admin page, or delete `data/content.json` to remove all edits.
- Edited text is escaped before it is shown, so it cannot add HTML to a page.

| Route | What it does |
| --- | --- |
| `GET /api/content` | Public. Returns the edits as `{ "original text": "new text" }`. |
| `PUT /api/content` | Needs the admin token. Body: `{ original, replacement }`. An empty replacement, or one equal to the original, removes the edit. Up to 1000 characters per text and 500 edits. |
| `GET /api/admin/check` | Needs the admin token. Returns `204` if it is correct (used by the admin page to unlock). |

## Testing

```bash
npm test
```

The 51 automated tests cover:
- **Messages:** valid and invalid submissions, malformed and oversized requests, simultaneous submissions, the token check, and the rate limit.
- **Shared form rules:** the browser and the server give the same answer for the same input.
- **Shared header and footer:** every page matches `partials/` and marks only its own link as the current page.
- **Content editing:** the token requirement, saving and resetting edits, persistence, invalid input, the edit cap, and the edited text being applied (and escaped) in the checklist code.
- **Security:** server files (`server.js`, `package.json`, `data/`) are not downloadable.

They use temporary files, so they never touch your real `data/` folder.

## Scope and limitations

This is a lightweight backend by design. There are no user accounts, no database, and no email delivery: messages and edits are only stored in files for the team. The token is the only access control, so keep it private.

## Project Structure

```
server.js             Express server: static files, /api/messages, and /api/content
package.json          Dependencies and scripts
scripts/              build-pages.js: copies the shared header and footer into every page
partials/             header.html and footer.html: the one copy of the header and footer
.env.example          Template for the optional .env file (ADMIN_TOKEN)
test/                 API tests (npm test)
data/                 messages.json and content.json (created at runtime, not committed)

index.html            Home page with the Requirement Checker
guides.html           Step-by-step guides for each document
about.html            Mission, values, team, and story
contact.html          Contact form and official agency links
privacy.html          Privacy Policy
terms.html            Terms of Use
404.html              Page not found
admin.html            Admin page for editing requirements, fees, and guide text (needs ADMIN_TOKEN)

css/
  styles.css          Colors, base styles, header, footer, buttons, forms, cards
  pages.css           Page-specific styles (checker, guides, about, contact)

js/
  icons.js            Inline SVG icons, drawn into any [data-icon] element
  data.js             Document requirements, fees, and guide steps (the defaults)
  content.js          Loads admin edits from the server and applies them to data.js text
  checklist.js        Builds the checklist from the user's answers
  admin.js            Admin page: unlock, list the text, save and reset edits
  site.js             Mobile menu, form helpers, footer year
  message-rules.js    Form validation rules, shared by the browser and the server
  checker.js          Requirement Checker form and results
  message-form.js     Question and contact forms: sending to the server, sent/error states
  guides.js           Renders the guides page from data.js
  contact.js          Renders the agency links from data.js

assets/               Logo used in the site header
```

## How the Pages Fit Together

Each page is a complete HTML file, so it also works when opened directly. The header and footer are the same on every page, so they are written once, in `partials/header.html` and `partials/footer.html`, and copied into each page between the `<!-- partial:... -->` markers.

To change a navigation link or anything else in the header or footer, edit the file in `partials/` and run:

```bash
npm run build
```

Do not edit the part between the markers in a page by hand; the next build overwrites it, and `npm test` fails if a page does not match the partials. (`npm run build:check` runs the same check on its own.) The build also adds `aria-current="page"` to the link for the page you are on.

Scripts are loaded at the bottom of each page, and only the ones that page needs. `index.html`, for example, loads `data.js`, `checklist.js`, and `checker.js` because it runs the checker, while `privacy.html` only loads `icons.js` and `site.js`.

## Editing Content

**Requirements, fees, and guide steps** start out in `js/data.js`. Wording changes can also be made from the admin page without editing code (see above); use `data.js` for new documents or for changing the rules. Each document has a `checklist` function that returns the requirements for a given age and applicant type, plus `steps` for its how-to guide and `statusNotes` for employment-specific tips (a note can be a string, or a function of the profile that returns a string or `null` to hide it). Both the checker and the guides page read from this file, so an edit there updates both.

**Colors and fonts** are CSS variables at the top of `css/styles.css`.

**Icons** come from `js/icons.js`. To use one, add an element like `<span class="icon" data-icon="check"></span>`; the script fills it in with the matching SVG.

> **Disclaimer:** This is an educational project. Always verify final requirements with the official government agency.
