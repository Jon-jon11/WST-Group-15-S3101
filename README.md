# GovReady

GovReady is a Government Document Requirement Checker for common Philippine IDs. Users select the document they need, their age, employment status, and whether they are a first-time applicant to get a personalized checklist of required documents, estimated fees, and where to apply.

WST Group 15 – S3101

## Tech Stack

- [React 19](https://react.dev) with JSX
- [Vite](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lucide](https://lucide.dev) icons

## Getting Started

This project is no longer plain HTML files, so opening `index.html` directly in the browser will show a blank page. You need to run it with Node.js. You only have to do steps 1–3 once.

### 1. Install Node.js

1. Go to [nodejs.org](https://nodejs.org) and download the **LTS** version.
2. Run the installer and keep clicking **Next** with the default options.
3. **Close and reopen** VS Code (or any terminal) after installing.

To check that it worked, open a terminal and run:

```bash
node -v
npm -v
```

Both commands should print a version number. `node -v` must be **v20.19.0 or higher**.

> **npm** comes with Node.js. It downloads the libraries this project needs (React, Vite, Tailwind CSS).

### 2. Get the project

If you already have the repository, pull the latest changes:

```bash
git pull
```

Otherwise, clone it:

```bash
git clone https://github.com/Jon-jon11/WST-Group-15-S3101.git
cd WST-Group-15-S3101
```

### 3. Install the project libraries

Open the project folder in VS Code, then open the terminal with **Terminal → New Terminal** (or <kbd>Ctrl</kbd> + <kbd>`</kbd>). Make sure the terminal is inside the project folder, then run:

```bash
npm install
```

This creates a `node_modules` folder. It can take a minute. Do not edit or commit this folder.

### 4. Run the website

```bash
npm run dev
```

The terminal will show a link like `http://localhost:5173`. Hold <kbd>Ctrl</kbd> and click it, or paste it into your browser.

- The page **updates automatically** when you save a file. No need to refresh or restart.
- Keep the terminal open while you work. Closing it stops the website.
- To stop the website, click the terminal and press <kbd>Ctrl</kbd> + <kbd>C</kbd>.

### Every time you work on the project

```bash
git pull
npm install
npm run dev
```

Running `npm install` again is only needed when someone added a new library, but it is safe to run every time.

### Troubleshooting

| Problem | Fix |
| ------- | --- |
| `'node'` or `'npm' is not recognized` | Node.js is not installed, or the terminal was opened before installing. Close VS Code completely and open it again. |
| `npm.ps1 cannot be loaded because running scripts is disabled` | Windows PowerShell is blocking npm. Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, type `Y`, then try again. Or switch the VS Code terminal to **Command Prompt** using the dropdown next to the **+** button. |
| `'vite' is not recognized` | You skipped `npm install`. Run it, then `npm run dev` again. |
| `ENOENT: no such file or directory, open ...package.json` | The terminal is in the wrong folder. Open the project folder in VS Code with **File → Open Folder**, then open a new terminal. |
| The page is blank after opening `index.html` | Don't open the file directly. Use `npm run dev` and open the `localhost` link. |
| Port 5173 is already in use | Another copy is already running. Use the link it shows, or close the other terminal. |

### Useful Commands

| Command           | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `npm install`     | Downloads the libraries the project needs                      |
| `npm run dev`     | Starts the website locally for development                     |
| `npm run build`   | Creates the final website files in the `dist/` folder          |
| `npm run preview` | Opens the `dist/` build locally to check it before deploying   |
| `npm run lint`    | Checks the code for mistakes                                   |

## Where to Edit Things

| To change...                                  | Edit                                   |
| --------------------------------------------- | -------------------------------------- |
| Document requirements, fees, and guide steps  | `src/data/documents.js`                |
| Navigation and footer links                   | `src/data/navigation.js`               |
| Page content (Home, About, Contact, etc.)     | `src/pages/`                           |
| Header and footer layout                      | `src/components/layout/`               |
| Brand colors and fonts                        | `src/index.css`                        |

Styling uses [Tailwind CSS](https://tailwindcss.com/docs) classes written directly in the `className` of each element, for example `className="text-primary font-bold"`.

## Project Structure

```
src/
  assets/              Header logo
  components/
    checker/           Requirement form, checklist results, quick tips
    layout/            Header, footer, page shell, scroll handling
    ui/                Shared class styles, page header, form controls
  data/                Document requirements, guides, and navigation
  hooks/               Shared React hooks
  lib/                 Checklist builder and helpers
  pages/               Route-level pages
public/                Favicons
branding/              Original GovReady logo files
```

## Pages

| Route      | Page                                        |
| ---------- | ------------------------------------------- |
| `/`        | Requirement Checker, results, and tips      |
| `/guides`  | Step-by-step guides for each document       |
| `/about`   | Mission, values, team, and story            |
| `/contact` | Contact form and official agency links      |
| `/privacy` | Privacy Policy                              |
| `/terms`   | Terms of Use                                |

## Updating Requirements

Document requirements, fees, guide steps, and agency links are defined in `src/data/documents.js`. Each document has a `checklist` function that returns the requirements for a given age and applicant type, plus optional notes per employment status.

## Deployment

The app uses client-side routing. When deploying to a static host, configure it to serve `index.html` for all routes so that pages like `/about` load correctly on refresh.

> **Disclaimer:** This is an educational project. Always verify final requirements with the official government agency.
