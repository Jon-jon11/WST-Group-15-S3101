/* Copies the shared header and footer from partials/ into every page.

   The header and footer used to be pasted into each HTML file by hand. Now they
   live once in partials/, and this script writes them between the
   <!-- partial:... --> markers in each page. The pages stay complete HTML files,
   so the site still works when a page is opened directly.

     npm run build          update every page
     npm run build:check    exit with an error if a page is out of date (also run by npm test)
*/

const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const PARTIALS = ['header', 'footer']

function readPartial(name) {
  return fs
    .readFileSync(path.join(root, 'partials', name + '.html'), 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/, '')
}

/* The link to the page you are on gets aria-current="page". The home page
   skips this: site.js marks Home or Requirement Checker depending on the hash. */
function markCurrentPage(markup, fileName) {
  if (fileName === 'index.html') return markup

  const link = new RegExp('(<a class="(?:primary-nav|mobile-menu)__link" href="' + fileName + '")', 'g')
  return markup.replace(link, '$1 aria-current="page"')
}

/* Pages keep whichever line endings they already use (Git on Windows may
   convert them), so the same result is produced on every machine. */
function render(html, fileName) {
  const lineEnding = html.includes('\r\n') ? '\r\n' : '\n'
  let result = html.replace(/\r\n/g, '\n')

  PARTIALS.forEach(function (name) {
    const start = '<!-- partial:' + name + ' -->'
    const end = '<!-- /partial:' + name + ' -->'
    const from = result.indexOf(start)
    const to = result.indexOf(end)

    if (from === -1 || to === -1 || to < from) {
      throw new Error(fileName + ' is missing the ' + start + ' ... ' + end + ' markers.')
    }

    const markup = name === 'header' ? markCurrentPage(readPartial(name), fileName) : readPartial(name)
    result = result.slice(0, from + start.length) + '\n' + markup + '\n    ' + result.slice(to)
  })

  return result.replace(/\n/g, lineEnding)
}

function pageFiles() {
  return fs.readdirSync(root).filter(function (file) {
    return file.endsWith('.html')
  })
}

/* Returns the pages whose header or footer does not match the partials. */
function outOfDatePages() {
  return pageFiles().filter(function (file) {
    const html = fs.readFileSync(path.join(root, file), 'utf8')
    return render(html, file) !== html
  })
}

function build() {
  const updated = []

  pageFiles().forEach(function (file) {
    const filePath = path.join(root, file)
    const html = fs.readFileSync(filePath, 'utf8')
    const next = render(html, file)

    if (next !== html) {
      fs.writeFileSync(filePath, next)
      updated.push(file)
    }
  })

  return updated
}

if (require.main === module) {
  if (process.argv.includes('--check')) {
    const stale = outOfDatePages()

    if (stale.length > 0) {
      console.error('These pages do not match partials/: ' + stale.join(', '))
      console.error('Run "npm run build" to update them.')
      process.exit(1)
    }

    console.log('All pages match the shared header and footer.')
  } else {
    const updated = build()
    console.log(updated.length > 0 ? 'Updated: ' + updated.join(', ') : 'Every page is already up to date.')
  }
}

module.exports = { outOfDatePages, build, render }
