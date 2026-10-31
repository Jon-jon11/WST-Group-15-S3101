# GovReady Test Report

Automated API tests run with Node v20.20.2, on 2026-10-31.

## How to reproduce

```bash
npm install
npm test
```

`npm test` runs every file in `test/` with Node's built-in test runner. For a clearer, colored list, run `npm run test:ui` (any system), `test.bat` (Windows) or `sh test.sh` (macOS and Linux). There is nothing else to install, and the tests use a temporary folder, so they never touch the real `data/` files. To see each test by name, run `node --test --test-reporter=spec`.

## Result

| Total | Passed | Failed |
| --- | --- | --- |
| 28 | 28 | 0 |

| Test file | Tests | Covers |
| --- | --- | --- |
| `test/server.test.js` | 28 | The API against a running server: message saving and validation, bad and oversized requests, simultaneous submissions, admin token checks, rate limits, content editing, files that must not be downloadable |

## Every test that passed

1. stores a valid home question and returns 201
2. stores name and email for contact messages
3. does not keep name or email sent with a home question
4. rejects an empty or whitespace-only message with a field error
5. contact requires a name and a valid email
6. rejects an unknown source
7. rejects a message over the length limit
8. rejects non-string fields without crashing
9. rejects malformed JSON with 400
10. rejects an oversized body with 413
11. keeps every message when submissions arrive at the same time
12. GET /api/messages needs the admin token
13. messages survive a restart because they are read back from the file
14. serves public pages and assets
15. does not expose server code, package files, or stored data
16. unknown API routes return JSON 404
17. rate limit stops a flood from one address
18. content starts empty and is public
19. editing content needs the admin token
20. admin check accepts only the right token
21. saves an edit and returns it to every visitor
22. edits survive a restart because they are read back from the file
23. sending the original text or nothing resets an edit
24. rejects invalid content edits
25. a text of __proto__ is stored as plain text and does not change other objects
26. caps the number of stored edits
27. wrong admin tokens are rate limited
28. serves the admin page

## Manual checks in a browser

These were done by hand against a running server, on a desktop-size and a phone-size (375 px wide) screen.

| Check | Result |
| --- | --- |
| Admin page: wrong token entered with the keyboard | Error shown and read out by a screen reader, field marked invalid, focus stays in the token field |
| Admin page: correct token | Editor opens and focus moves to its heading; Tab order is Lock, search box, then the document groups |
| Admin page: edit, Save and Reset using only the keyboard | Saved and reset correctly; focus stays on Save (or moves to Save when Reset disappears) |
| Admin page: saved edit after the server was stopped and started again | The edit was still there |
| Admin page: server unreachable | Plain message "Could not reach the server...", typed text kept, button usable again; saving works once the server is back |
| Contact form: phone-size screen, keyboard only | No sideways scrolling; invalid email shows its error and moves focus to the email field |
| Contact form: valid message | Saved; focus moves to the confirmation message; "Send another message" returns to the first field |
| Contact form: server unreachable | Error alert, typed text kept, focus returns to the Send button |
| Home and About forms | Empty submit shows an error; a valid message is saved |
| Edited text containing HTML | Shown as plain text on the checker, never run as code |

## What is not covered

- No automated browser tests: the checks above were done by hand.
- The checklist logic, the shared form rules, and the shared header and footer are not covered by automated tests. Run `npm run build:check` to confirm every page still matches the shared header and footer.
- The server has only been run on a local computer, not on a hosting service.
