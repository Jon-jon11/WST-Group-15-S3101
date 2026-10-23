/* GovReady server: serves the static site, stores submitted messages, and
   stores edits to the text in js/data.js (requirements, fees, guide steps). */

require('dotenv').config({ quiet: true })

const crypto = require('crypto')
const fs = require('fs/promises')
const path = require('path')
const express = require('express')

/* The same rules the forms use in the browser. */
const { validateSubmission } = require('./js/message-rules')

const PORT = process.env.PORT || 3000
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''
const MESSAGES_FILE = process.env.MESSAGES_FILE || path.join(__dirname, 'data', 'messages.json')
const CONTENT_FILE = process.env.CONTENT_FILE || path.join(__dirname, 'data', 'content.json')

const LIMITS = { contentText: 1000, contentEdits: 500 }

/* JSON file storage -------------------------------------------------------
   Each store is one JSON file. Writes are queued so two requests arriving
   together cannot overwrite each other, and each write goes to a temporary
   file first so a crash never leaves a half-written file. */

function createJsonStore(file, emptyValue) {
  let queue = Promise.resolve()

  async function read() {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8'))
    } catch (error) {
      if (error.code === 'ENOENT') return emptyValue()
      throw error
    }
  }

  function update(change) {
    const result = queue.then(async function () {
      const next = change(await read())

      await fs.mkdir(path.dirname(file), { recursive: true })
      const tempFile = file + '.tmp'
      await fs.writeFile(tempFile, JSON.stringify(next, null, 2))
      await fs.rename(tempFile, file)
    })

    queue = result.catch(function () {})
    return result
  }

  return { read: read, update: update }
}

const messageStore = createJsonStore(MESSAGES_FILE, function () {
  return []
})

const contentStore = createJsonStore(CONTENT_FILE, function () {
  return {}
})

/* Validation --------------------------------------------------------------- */

function validateContentEdit(body) {
  const original = body.original
  const replacement = typeof body.replacement === 'string' ? body.replacement.trim() : body.replacement

  if (typeof original !== 'string' || !original) {
    return { error: 'Missing the original text.' }
  }

  if (original.length > LIMITS.contentText) {
    return { error: 'The original text is too long.' }
  }

  if (typeof replacement !== 'string') {
    return { error: 'Enter the new text.' }
  }

  if (replacement.length > LIMITS.contentText) {
    return { error: 'The text is too long. Keep it under ' + LIMITS.contentText + ' characters.' }
  }

  return { original, replacement }
}

/* Rate limiting: a small in-memory limit per IP, enough to stop a form or the
   admin token from being hammered without adding a dependency. */

const limiters = []

function createRateLimiter(max, message) {
  const recent = new Map()
  limiters.push(recent)

  return function rateLimit(request, response, next) {
    const now = Date.now()
    const times = (recent.get(request.ip) || []).filter(function (time) {
      return now - time < 60 * 1000
    })

    if (times.length >= max) {
      response.status(429).json({ error: message })
      return
    }

    times.push(now)
    recent.set(request.ip, times)
    next()
  }
}

const messageLimit = createRateLimiter(10, 'Too many messages. Please wait a minute and try again.')
const adminLimit = createRateLimiter(60, 'Too many requests. Please wait a minute and try again.')

function isAuthorized(request) {
  if (!ADMIN_TOKEN) return false

  const header = request.get('authorization') || ''
  const supplied = Buffer.from(header.startsWith('Bearer ') ? header.slice(7) : '')
  const expected = Buffer.from(ADMIN_TOKEN)

  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected)
}

function requireAdmin(request, response, next) {
  if (!isAuthorized(request)) {
    response.status(401).json({ error: 'Unauthorized.' })
    return
  }

  next()
}

/* App ---------------------------------------------------------------------- */

const app = express()
app.disable('x-powered-by')

app.post('/api/messages', messageLimit, express.json({ limit: '10kb' }), async function (request, response, next) {
  try {
    const { errors, value } = validateSubmission(request.body || {})

    if (Object.keys(errors).length > 0) {
      response.status(400).json({ error: 'Please fix the highlighted fields.', errors })
      return
    }

    const saved = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      source: value.source,
      name: value.source === 'contact' ? value.name : '',
      email: value.source === 'contact' ? value.email : '',
      message: value.message,
    }

    await messageStore.update(function (messages) {
      messages.push(saved)
      return messages
    })
    response.status(201).json({ id: saved.id })
  } catch (error) {
    next(error)
  }
})

app.get('/api/messages', adminLimit, requireAdmin, async function (request, response, next) {
  try {
    response.json(await messageStore.read())
  } catch (error) {
    next(error)
  }
})

/* Editable content: a map of original text (as written in js/data.js) to the
   replacement text. Everything not in the map keeps the text from data.js. */

app.get('/api/content', async function (request, response, next) {
  try {
    response.set('Cache-Control', 'no-cache')
    response.json(await contentStore.read())
  } catch (error) {
    next(error)
  }
})

app.get('/api/admin/check', adminLimit, requireAdmin, function (request, response) {
  response.status(204).end()
})

app.put('/api/content', adminLimit, requireAdmin, express.json({ limit: '10kb' }), async function (request, response, next) {
  try {
    const edit = validateContentEdit(request.body || {})

    if (edit.error) {
      response.status(400).json({ error: edit.error })
      return
    }

    const isReset = edit.replacement === '' || edit.replacement === edit.original

    await contentStore.update(function (stored) {
      const edits = Object.assign(Object.create(null), stored)

      if (isReset) {
        delete edits[edit.original]
      } else {
        edits[edit.original] = edit.replacement

        if (Object.keys(edits).length > LIMITS.contentEdits) {
          const error = new Error('Too many edits. Reset some before adding more.')
          error.statusCode = 400
          throw error
        }
      }

      return edits
    })

    response.json({ original: edit.original, replacement: isReset ? null : edit.replacement })
  } catch (error) {
    next(error)
  }
})

/* Static files: only the public site is served, never server.js, data/, or
   package.json. */

app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.get(/^\/[\w-]+\.(html|ico|png)$/, function (request, response, next) {
  response.sendFile(path.join(__dirname, request.path), function (error) {
    if (error) next()
  })
})

app.use('/api', function (request, response) {
  response.status(404).json({ error: 'Not found.' })
})

app.use(function (request, response) {
  response.status(404).sendFile(path.join(__dirname, '404.html'))
})

app.use(function (error, request, response, next) {
  if (error.type === 'entity.too.large') {
    response.status(413).json({ error: 'Your message is too large.' })
    return
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json({ error: 'Invalid request.' })
    return
  }

  if (error.statusCode === 400) {
    response.status(400).json({ error: error.message })
    return
  }

  console.error(error)
  response.status(500).json({ error: 'Something went wrong on our end. Please try again.' })
})

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('GovReady running at http://localhost:' + PORT)
    if (!ADMIN_TOKEN) {
      console.log('ADMIN_TOKEN is not set, so reading messages and editing content are disabled.')
    }
  })
}

app.resetRateLimit = function () {
  limiters.forEach(function (recent) {
    recent.clear()
  })
}

module.exports = app
