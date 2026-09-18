# GovReady

GovReady is a Government Document Requirement Checker for common Philippine IDs. Users select the document they need, their age, employment status, and whether they are a first-time applicant to get a personalized checklist of required documents, estimated fees, and where to apply.

WST Group 15 – S3101

Built with plain HTML, CSS, and JavaScript. There is no framework, no build step, and no dependencies to install.

## Running the Site

**Option 1 – open the file.** Double-click `index.html`, or open it in your browser. Everything works this way, including the checker.

**Option 2 – use a local server (recommended in VS Code).** Install the *Live Server* extension, right-click `index.html`, and choose **Open with Live Server**. The page then reloads automatically when you save a file.

## Project Structure

```
index.html            Home page with the Requirement Checker
guides.html           Step-by-step guides for each document
about.html            Mission, values, team, and story
contact.html          Contact form and official agency links
privacy.html          Privacy Policy
terms.html            Terms of Use
404.html              Page not found

css/
  styles.css          Colors, base styles, header, footer, buttons, forms, cards
  pages.css           Page-specific styles (checker, guides, about, contact)

js/
  icons.js            Inline SVG icons, drawn into any [data-icon] element
  data.js             Document requirements, fees, and guide steps
  checklist.js        Builds the checklist from the user's answers
  site.js             Mobile menu, form helpers, footer year
  checker.js          Requirement Checker form and results
  message-form.js     Question and contact form validation
  guides.js           Renders the guides page from data.js
  contact.js          Renders the agency links from data.js

assets/               Logo used in the site header
branding/             Original GovReady logo files
```

## How the Pages Fit Together

Each page is a complete HTML file with its own header and footer. If you change a navigation link, update it in every page.

Scripts are loaded at the bottom of each page, and only the ones that page needs. `index.html`, for example, loads `data.js`, `checklist.js`, and `checker.js` because it runs the checker, while `privacy.html` only loads `icons.js` and `site.js`.

## Editing Content

**Requirements, fees, and guide steps** live in `js/data.js`. Each document has a `checklist` function that returns the requirements for a given age and applicant type, plus `steps` for its how-to guide and `statusNotes` for employment-specific tips. Both the checker and the guides page read from this file, so an edit there updates both.

**Colors and fonts** are CSS variables at the top of `css/styles.css`.

**Icons** come from `js/icons.js`. To use one, add an element like `<span class="icon" data-icon="check"></span>`; the script fills it in with the matching SVG.

> **Disclaimer:** This is an educational project. Always verify final requirements with the official government agency.
