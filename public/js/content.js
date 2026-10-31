/* Editable text. The defaults live in data.js. An admin can replace any of that
   text from admin.html; the server keeps the replacements as a map of original
   text to new text, and the checker and guides apply them when they render.
   If the server cannot be reached (for example when index.html is opened as a
   file), the defaults from data.js are used. */

let contentEdits = {}

function setContentEdits(edits) {
  contentEdits = edits && typeof edits === 'object' ? edits : {}
}

function loadContentEdits() {
  const controller = new AbortController()
  const timeout = setTimeout(function () {
    controller.abort()
  }, 3000)

  return fetch('/api/content', { signal: controller.signal })
    .then(function (response) {
      return response.ok ? response.json() : {}
    })
    .then(setContentEdits)
    .catch(function () {
      setContentEdits({})
    })
    .finally(function () {
      clearTimeout(timeout)
    })
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* The text from data.js is trusted markup-free text; an edit is escaped because
   it is typed by a person and inserted into the page as HTML. */
function editableText(text) {
  if (typeof text === 'string' && Object.prototype.hasOwnProperty.call(contentEdits, text)) {
    const edit = contentEdits[text]
    if (typeof edit === 'string') return escapeHtml(edit)
  }

  return text
}
