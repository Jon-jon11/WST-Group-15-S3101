/* Runs the automated tests with a simple, readable display. Works the same on
   Windows, macOS, and Linux (it only needs Node.js).

     node scripts/run-tests.js        or        npm run test:ui

   test.bat (Windows) and test.sh (macOS / Linux) just call this file. */

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

/* How many tests the project should have. Change this when tests are added or removed. */
const EXPECTED = 28

const root = path.join(__dirname, '..')
const testDir = path.join(root, 'test')

const useColor = process.stdout.isTTY && !process.env.NO_COLOR
const paint = function (code) {
  return function (text) {
    return useColor ? '\u001b[' + code + 'm' + text + '\u001b[0m' : text
  }
}
const green = paint(92)
const red = paint(91)
const yellow = paint(93)
const dim = paint(2)

const TITLES = {
  'server.test.js': 'API - messages, admin token, content editing, security',
}

function line(text) {
  console.log(text === undefined ? '' : text)
}

function stop(message, hint) {
  line('  ' + red(message))
  if (hint) line('  ' + hint)
  line()
  process.exit(1)
}

function banner() {
  line()
  line(' ========================================================')
  line('                 GovReady - Test Runner')
  line(' ========================================================')
  line()
}

/* Setup --------------------------------------------------------------------- */

function checkNode() {
  const [major, minor] = process.versions.node.split('.').map(Number)
  const { run } = require('node:test')

  if (major < 18 || typeof run !== 'function') {
    stop('Node ' + process.versions.node + ' is too old.', 'Install Node 18.9 or newer from https://nodejs.org')
  }

  line('  Node v' + process.versions.node + ' found')
}

function checkPackages() {
  if (fs.existsSync(path.join(root, 'node_modules', 'express'))) {
    line('  Packages are ready')
    return
  }

  line('  Installing packages, please wait...')
  const result = spawnSync('npm', ['install', '--no-fund', '--no-audit'], {
    cwd: root,
    shell: true,
    stdio: 'ignore',
  })

  if (result.status !== 0) {
    stop('Could not install the packages.', 'Check your internet connection, or run "npm install" yourself.')
  }

  line('  Packages are ready')
}

/* Running -------------------------------------------------------------------- */

async function runFile(file, counter) {
  const { run } = require('node:test')
  const results = { passed: 0, failed: 0 }

  line(' ' + (TITLES[path.basename(file)] || path.basename(file)))
  line(' ' + dim('(' + path.relative(root, file) + ')'))

  for await (const event of run({ files: [file] })) {
    if (event.type !== 'test:pass' && event.type !== 'test:fail') continue
    if (!isTopLevelTest(event.data, file)) continue

    counter.number += 1

    if (event.type === 'test:pass') {
      results.passed += 1
      line('   ' + green('[PASS]') + ' ' + counter.number + '. ' + event.data.name)
    } else {
      results.failed += 1
      line('   ' + red('[FAIL]') + ' ' + counter.number + '. ' + event.data.name)
      failureDetails(event.data).forEach(function (detail) {
        line('          ' + red(detail))
      })
    }
  }

  const total = results.passed + results.failed
  const summary = '   -- ' + results.passed + ' of ' + total + ' passed'
  line(results.failed === 0 ? green(summary) : red(summary))
  line()

  return results
}

/* Only the tests written in the file, not the file itself or nested steps. */
function isTopLevelTest(data, file) {
  if (data.nesting !== 0) return false
  if (data.details && data.details.type === 'suite') return false
  return data.name !== path.basename(file) && data.name !== file
}

function failureDetails(data) {
  const error = data.details && data.details.error
  const message = error && (error.cause && error.cause.message ? error.cause.message : error.message)

  return message ? String(message).split('\n').slice(0, 4) : []
}

async function main() {
  banner()
  checkNode()
  checkPackages()
  line()

  const files = fs
    .readdirSync(testDir)
    .filter(function (name) {
      return name.endsWith('.test.js')
    })
    .sort()
    .map(function (name) {
      return path.join(testDir, name)
    })

  const counter = { number: 0 }
  let passed = 0
  let failed = 0

  for (const file of files) {
    const results = await runFile(file, counter)
    passed += results.passed
    failed += results.failed
  }

  const total = passed + failed

  line(' ========================================================')
  line('   Tests run : ' + total)
  line('   Passed    : ' + passed)
  line('   Failed    : ' + failed)
  line(' ========================================================')
  line()

  let ok = failed === 0

  if (total === EXPECTED) {
    line('   ' + green('Count check: ' + total + ' of ' + EXPECTED + ' expected tests ran - OK'))
  } else {
    ok = false
    line('   ' + yellow('Count check: ' + total + ' tests ran but ' + EXPECTED + ' were expected'))
    line('   ' + yellow('A test file may be missing or failed to load.'))
  }

  line()
  line(ok ? '   ' + green('ALL ' + total + ' TESTS PASSED') : '   ' + red('SOMETHING NEEDS ATTENTION'))
  line()

  process.exit(ok ? 0 : 1)
}

main().catch(function (error) {
  stop('The test runner stopped unexpectedly: ' + (error && error.message ? error.message : error))
})
