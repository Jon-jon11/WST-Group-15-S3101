/* API and static-file tests. Run with: npm test */

const test = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const os = require('os')
const path = require('path')

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'govready-'))
const dataFile = path.join(dataDir, 'messages.json')
const contentFile = path.join(dataDir, 'content.json')

process.env.MESSAGES_FILE = dataFile
process.env.CONTENT_FILE = contentFile
process.env.ADMIN_TOKEN = 'test-token'

const app = require('../server')

let server
let base

test.before(async function () {
  await new Promise(function (resolve) {
    server = app.listen(0, resolve)
  })
  base = 'http://127.0.0.1:' + server.address().port
})

test.beforeEach(function () {
  app.resetRateLimit()
})

test.after(function () {
  server.close()
  fs.rmSync(dataDir, { recursive: true, force: true })
})

function post(body, raw) {
  return fetch(base + '/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw === undefined ? JSON.stringify(body) : raw,
  })
}

function readStored() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
}

const authorized = { headers: { Authorization: 'Bearer test-token' } }

test('stores a valid home question and returns 201', async function () {
  const response = await post({ source: 'home', message: '  What do I need for a passport?  ' })
  assert.strictEqual(response.status, 201)

  const stored = readStored()
  assert.strictEqual(stored.length, 1)
  assert.strictEqual(stored[0].message, 'What do I need for a passport?')
  assert.strictEqual(stored[0].source, 'home')
  assert.ok(stored[0].id)
  assert.ok(stored[0].receivedAt)
})

test('stores name and email for contact messages', async function () {
  const response = await post({ source: 'contact', name: 'Juan', email: 'juan@example.com', message: 'Hello' })
  assert.strictEqual(response.status, 201)

  const last = readStored().pop()
  assert.strictEqual(last.name, 'Juan')
  assert.strictEqual(last.email, 'juan@example.com')
})

test('does not keep name or email sent with a home question', async function () {
  await post({ source: 'home', name: 'Sneaky', email: 'x@example.com', message: 'Hi' })
  const last = readStored().pop()
  assert.strictEqual(last.name, '')
  assert.strictEqual(last.email, '')
})

test('rejects an empty or whitespace-only message with a field error', async function () {
  const response = await post({ source: 'about', message: '   ' })
  assert.strictEqual(response.status, 400)
  assert.ok((await response.json()).errors.message)
})

test('contact requires a name and a valid email', async function () {
  const response = await post({ source: 'contact', name: '', email: 'not-an-email', message: 'Hi' })
  assert.strictEqual(response.status, 400)

  const { errors } = await response.json()
  assert.ok(errors.name)
  assert.ok(errors.email)
})

test('rejects an unknown source', async function () {
  const response = await post({ source: 'evil', message: 'Hi' })
  assert.strictEqual(response.status, 400)
})

test('rejects a message over the length limit', async function () {
  const response = await post({ source: 'home', message: 'a'.repeat(2001) })
  assert.strictEqual(response.status, 400)
})

test('rejects non-string fields without crashing', async function () {
  const response = await post({ source: 'home', message: { $gt: '' } })
  assert.strictEqual(response.status, 400)
})

test('rejects malformed JSON with 400', async function () {
  const response = await post(null, '{not json')
  assert.strictEqual(response.status, 400)
})

test('rejects an oversized body with 413', async function () {
  const response = await post({ source: 'home', message: 'a'.repeat(20000) })
  assert.strictEqual(response.status, 413)
})

test('keeps every message when submissions arrive at the same time', async function () {
  const before = readStored().length
  const responses = await Promise.all(
    [1, 2, 3, 4, 5].map(function (n) {
      return post({ source: 'home', message: 'parallel ' + n })
    }),
  )

  responses.forEach(function (response) {
    assert.strictEqual(response.status, 201)
  })
  assert.strictEqual(readStored().length, before + 5)
})

test('GET /api/messages needs the admin token', async function () {
  assert.strictEqual((await fetch(base + '/api/messages')).status, 401)
  assert.strictEqual(
    (await fetch(base + '/api/messages', { headers: { Authorization: 'Bearer wrong' } })).status,
    401,
  )

  const response = await fetch(base + '/api/messages', authorized)
  assert.strictEqual(response.status, 200)
  assert.ok(Array.isArray(await response.json()))
})

test('messages survive a restart because they are read back from the file', async function () {
  const stored = readStored().length
  const listed = await (await fetch(base + '/api/messages', authorized)).json()
  assert.strictEqual(listed.length, stored)
})

test('serves public pages and assets', async function () {
  assert.strictEqual((await fetch(base + '/')).status, 200)
  assert.strictEqual((await fetch(base + '/guides.html')).status, 200)
  assert.strictEqual((await fetch(base + '/js/data.js')).status, 200)
  assert.strictEqual((await fetch(base + '/css/styles.css')).status, 200)
})

test('does not expose server code, package files, or stored data', async function () {
  const hidden = [
    '/server.js',
    '/package.json',
    '/data/messages.json',
    '/.gitignore',
    '/.env',
    '/test/server.test.js',
    '/scripts/run-tests.js',
    '/partials/header.html',
    '/docs/TEST_REPORT.md',
    '/public/server.js',
  ]

  for (const url of hidden) {
    const response = await fetch(base + url)
    assert.strictEqual(response.status, 404, url)
    assert.ok((await response.text()).includes('<html'), url + ' should return the 404 page')
  }
})

test('unknown API routes return JSON 404', async function () {
  const response = await fetch(base + '/api/nothing')
  assert.strictEqual(response.status, 404)
  assert.ok((await response.json()).error)
})

test('rate limit stops a flood from one address', async function () {
  const statuses = []
  for (let i = 0; i < 15; i++) {
    statuses.push((await post({ source: 'home', message: 'flood ' + i })).status)
  }
  assert.ok(statuses.includes(429))
})

/* Editable content ------------------------------------------------------- */

function putContent(body, token) {
  return fetch(base + '/api/content', {
    method: 'PUT',
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      token === undefined ? authorized.headers : token ? { Authorization: 'Bearer ' + token } : {},
    ),
    body: JSON.stringify(body),
  })
}

async function getContent() {
  return (await fetch(base + '/api/content')).json()
}

test('content starts empty and is public', async function () {
  const response = await fetch(base + '/api/content')
  assert.strictEqual(response.status, 200)
  assert.deepStrictEqual(await response.json(), {})
})

test('editing content needs the admin token', async function () {
  assert.strictEqual((await putContent({ original: 'a', replacement: 'b' }, '')).status, 401)
  assert.strictEqual((await putContent({ original: 'a', replacement: 'b' }, 'wrong')).status, 401)
  assert.deepStrictEqual(await getContent(), {})
})

test('admin check accepts only the right token', async function () {
  assert.strictEqual((await fetch(base + '/api/admin/check')).status, 401)
  assert.strictEqual((await fetch(base + '/api/admin/check', authorized)).status, 204)
})

test('saves an edit and returns it to every visitor', async function () {
  const response = await putContent({
    original: '₱950.00 (regular processing)',
    replacement: '  ₱1,000.00 (regular)  ',
  })
  assert.strictEqual(response.status, 200)
  assert.deepStrictEqual(await response.json(), {
    original: '₱950.00 (regular processing)',
    replacement: '₱1,000.00 (regular)',
  })
  assert.strictEqual((await getContent())['₱950.00 (regular processing)'], '₱1,000.00 (regular)')
})

test('edits survive a restart because they are read back from the file', async function () {
  const stored = JSON.parse(fs.readFileSync(contentFile, 'utf8'))
  assert.strictEqual(stored['₱950.00 (regular processing)'], '₱1,000.00 (regular)')
})

test('sending the original text or nothing resets an edit', async function () {
  await putContent({ original: 'one', replacement: 'uno' })
  await putContent({ original: 'two', replacement: 'dos' })

  const back = await putContent({ original: 'one', replacement: 'one' })
  assert.strictEqual((await back.json()).replacement, null)

  await putContent({ original: 'two', replacement: '   ' })

  const content = await getContent()
  assert.strictEqual('one' in content, false)
  assert.strictEqual('two' in content, false)
})

test('rejects invalid content edits', async function () {
  assert.strictEqual((await putContent({ replacement: 'x' })).status, 400)
  assert.strictEqual((await putContent({ original: '', replacement: 'x' })).status, 400)
  assert.strictEqual((await putContent({ original: 'x', replacement: 5 })).status, 400)
  assert.strictEqual((await putContent({ original: 'x' })).status, 400)
  assert.strictEqual((await putContent({ original: 'x', replacement: 'a'.repeat(1001) })).status, 400)
  assert.strictEqual((await putContent({ original: ['x'], replacement: 'y' })).status, 400)
})

test('a text of __proto__ is stored as plain text and does not change other objects', async function () {
  const response = await putContent({ original: '__proto__', replacement: 'polluted' })
  assert.strictEqual(response.status, 200)
  assert.strictEqual({}.polluted, undefined)
  await putContent({ original: '__proto__', replacement: '' })
})

test('caps the number of stored edits', async function () {
  const before = await getContent()
  const room = 500 - Object.keys(before).length

  for (let i = 0; i < room; i++) {
    app.resetRateLimit()
    const saved = await putContent({ original: 'cap-' + i, replacement: 'edited ' + i })
    assert.strictEqual(saved.status, 200)
  }

  app.resetRateLimit()
  assert.strictEqual((await putContent({ original: 'cap-extra', replacement: 'one too many' })).status, 400)

  for (let i = 0; i < room; i++) {
    app.resetRateLimit()
    await putContent({ original: 'cap-' + i, replacement: '' })
  }
  assert.deepStrictEqual(await getContent(), before)
})

test('wrong admin tokens are rate limited', async function () {
  const statuses = []
  for (let i = 0; i < 70; i++) {
    statuses.push((await fetch(base + '/api/admin/check', { headers: { Authorization: 'Bearer nope' } })).status)
  }
  assert.ok(statuses.includes(429))
})

test('serves the admin page', async function () {
  assert.strictEqual((await fetch(base + '/admin.html')).status, 200)
  assert.strictEqual((await fetch(base + '/js/content.js')).status, 200)
})
