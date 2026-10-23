/* Admin page: edit the text from data.js (requirements, fees, guide steps).
   Edits are saved on the server as original text -> new text. */

const TOKEN_STORAGE_KEY = 'govready-admin-token'

const unlockSection = document.getElementById('unlock-section')
const unlockForm = document.getElementById('unlock-form')
const unlockButton = document.getElementById('unlock-button')
const tokenInput = document.getElementById('admin-token')
const editorSection = document.getElementById('editor-section')
const editorList = document.getElementById('editor-list')
const filterInput = document.getElementById('admin-filter')
const summary = document.getElementById('admin-summary')
const lockButton = document.getElementById('lock-button')

let adminToken = ''

/* What can be edited, in the order it is shown on the page. */
const KINDS = [
  { id: 'fees', label: 'Fees' },
  { id: 'location', label: 'Where to apply' },
  { id: 'appointment', label: 'Appointment' },
  { id: 'requirement', label: 'Required document name' },
  { id: 'requirementDetail', label: 'Required document detail' },
  { id: 'notice', label: 'Notice' },
  { id: 'note', label: 'Good to know' },
  { id: 'guideSummary', label: 'Guide summary' },
  { id: 'guideStepTitle', label: 'Guide step title' },
  { id: 'guideStepDescription', label: 'Guide step' },
]

function kindLabel(kindId) {
  return KINDS.find(function (kind) {
    return kind.id === kindId
  }).label
}

/* Every piece of text a visitor can see for each document, found by running the
   checklist for every age, status, and applicant type. A piece of text that is
   used by more than one document is listed once, under the first. */
function collectEditableText() {
  const seen = new Set()

  return DOCUMENT_TYPES.map(function (documentType) {
    const items = []

    function add(text, kindId) {
      if (!text || seen.has(text)) return
      seen.add(text)
      items.push({ text: text, kind: kindId })
    }

    STATUS_OPTIONS.forEach(function (status) {
      ;[true, false].forEach(function (isFirstTime) {
        for (let age = 0; age <= 120; age++) {
          const result = buildDefaultChecklist({
            purpose: documentType.id,
            age: age,
            status: status.value,
            isFirstTime: isFirstTime,
          })

          add(result.fees, 'fees')
          add(result.location, 'location')
          if (result.appointment) add(result.appointment.detail, 'appointment')
          result.requirements.forEach(function (item) {
            add(item.label, 'requirement')
            add(item.detail, 'requirementDetail')
          })
          result.notices.forEach(function (notice) {
            add(notice.message, 'notice')
          })
          result.notes.forEach(function (note) {
            add(note, 'note')
          })
        }
      })
    })

    add(documentType.summary, 'guideSummary')
    documentType.steps.forEach(function (step) {
      add(step.title, 'guideStepTitle')
      add(step.description, 'guideStepDescription')
    })

    items.sort(function (a, b) {
      return KINDS.findIndex(isKind(a)) - KINDS.findIndex(isKind(b))
    })

    return { documentType: documentType, items: items }
  })
}

function isKind(item) {
  return function (kind) {
    return kind.id === item.kind
  }
}

function hasEdit(text) {
  return Object.prototype.hasOwnProperty.call(contentEdits, text)
}

function currentText(text) {
  return hasEdit(text) ? contentEdits[text] : text
}

/* Talking to the server --------------------------------------------------- */

function saveEdit(original, replacement) {
  return fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + adminToken },
    body: JSON.stringify({ original: original, replacement: replacement }),
  }).then(function (response) {
    return response
      .json()
      .catch(function () {
        return {}
      })
      .then(function (body) {
        if (!response.ok) {
          const error = new Error(body.error || 'Could not save.')
          error.status = response.status
          throw error
        }

        return body
      })
  })
}

function checkToken(token) {
  return fetch('/api/admin/check', { headers: { Authorization: 'Bearer ' + token } }).then(function (response) {
    if (response.status === 204) return
    if (response.status === 429) throw new Error('Too many attempts. Please wait a minute and try again.')
    throw new Error('That token was not accepted. Check the ADMIN_TOKEN in your .env file.')
  })
}

/* Editor ------------------------------------------------------------------- */

let itemCounter = 0

function itemMarkup(item) {
  itemCounter += 1
  const id = 'edit-' + itemCounter

  const wrapper = document.createElement('div')
  wrapper.className = 'admin-item'

  const label = document.createElement('label')
  label.className = 'admin-item__label'
  label.htmlFor = id
  label.textContent = kindLabel(item.kind)

  const badge = document.createElement('span')
  badge.className = 'admin-item__badge'
  badge.textContent = 'Edited'
  badge.hidden = !hasEdit(item.text)
  label.appendChild(badge)

  const textarea = document.createElement('textarea')
  textarea.className = 'textarea'
  textarea.id = id
  textarea.rows = Math.min(6, Math.max(2, Math.ceil(item.text.length / 70)))
  textarea.maxLength = 1000
  textarea.value = currentText(item.text)

  const actions = document.createElement('div')
  actions.className = 'admin-item__actions'

  const saveButton = document.createElement('button')
  saveButton.type = 'button'
  saveButton.className = 'btn btn--primary'
  saveButton.textContent = 'Save'

  const resetButton = document.createElement('button')
  resetButton.type = 'button'
  resetButton.className = 'btn btn--outline'
  resetButton.textContent = 'Reset'
  resetButton.hidden = !hasEdit(item.text)

  const status = document.createElement('span')
  status.className = 'admin-item__status'
  status.setAttribute('role', 'status')

  function setBusy(isBusy) {
    saveButton.disabled = isBusy
    resetButton.disabled = isBusy
  }

  function finish(replacement) {
    if (replacement === null) {
      delete contentEdits[item.text]
      textarea.value = item.text
    } else {
      contentEdits[item.text] = replacement
      textarea.value = replacement
    }

    badge.hidden = replacement === null
    resetButton.hidden = replacement === null
    status.textContent = replacement === null ? 'Reset to the original.' : 'Saved.'
    wrapper.dataset.search = (item.text + ' ' + textarea.value).toLowerCase()
    updateSummary()
  }

  function submit(replacement) {
    status.textContent = 'Saving...'
    setBusy(true)

    saveEdit(item.text, replacement)
      .then(function (result) {
        finish(result.replacement)
      })
      .catch(function (error) {
        status.textContent = error.message || 'Could not save. Check your connection and try again.'

        if (error.status === 401) lock('Your token is no longer accepted. Enter it again.')
      })
      .then(function () {
        setBusy(false)
      })
  }

  saveButton.addEventListener('click', function () {
    submit(textarea.value)
  })

  resetButton.addEventListener('click', function () {
    submit(item.text)
  })

  actions.appendChild(saveButton)
  actions.appendChild(resetButton)
  actions.appendChild(status)

  wrapper.dataset.search = (item.text + ' ' + textarea.value).toLowerCase()
  wrapper.appendChild(label)
  wrapper.appendChild(textarea)
  wrapper.appendChild(actions)

  return wrapper
}

function renderEditor() {
  editorList.textContent = ''
  itemCounter = 0

  collectEditableText().forEach(function (group) {
    const details = document.createElement('details')
    details.className = 'card admin-group'

    const heading = document.createElement('summary')
    heading.className = 'admin-group__title'
    heading.textContent = group.documentType.name

    const count = document.createElement('span')
    count.className = 'admin-group__count'
    heading.appendChild(count)

    details.appendChild(heading)
    group.items.forEach(function (item) {
      details.appendChild(itemMarkup(item))
    })

    editorList.appendChild(details)
  })

  applyFilter()
}

function applyFilter() {
  const query = filterInput.value.trim().toLowerCase()

  editorList.querySelectorAll('.admin-group').forEach(function (details) {
    let visible = 0

    details.querySelectorAll('.admin-item').forEach(function (item) {
      const matches = !query || item.dataset.search.includes(query)
      item.hidden = !matches
      if (matches) visible += 1
    })

    details.hidden = visible === 0
    if (query) details.open = visible > 0
    details.querySelector('.admin-group__count').textContent = ' (' + visible + ')'
  })

  updateSummary()
}

function updateSummary() {
  const total = editorList.querySelectorAll('.admin-item').length
  const edited = Object.keys(contentEdits).length
  summary.textContent = total + ' pieces of text, ' + edited + ' edited.'
}

/* Lock and unlock ---------------------------------------------------------- */

function setTokenError(message) {
  setFieldError(tokenInput.closest('.field'), message)
}

function showEditor() {
  unlockSection.hidden = true
  editorSection.hidden = false
  renderEditor()
}

function lock(message) {
  adminToken = ''
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch (error) {
    /* Storage can be blocked; locking still works. */
  }

  editorSection.hidden = true
  unlockSection.hidden = false
  tokenInput.value = ''
  setTokenError(message || '')
  tokenInput.focus()
}

function unlock(token, isAutomatic) {
  unlockButton.disabled = true
  setTokenError('')

  return checkToken(token)
    .then(function () {
      return loadContentEdits()
    })
    .then(function () {
      adminToken = token
      try {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
      } catch (error) {
        /* The token just won't be remembered for this tab. */
      }
      showEditor()
    })
    .catch(function (error) {
      if (!isAutomatic) {
        setTokenError(error.message || 'Could not reach the server. Make sure it is running.')
        tokenInput.focus()
      }
    })
    .then(function () {
      unlockButton.disabled = false
    })
}

unlockForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const token = tokenInput.value.trim()
  if (!token) {
    setTokenError('Enter the admin token.')
    tokenInput.focus()
    return
  }

  unlock(token, false)
})

tokenInput.addEventListener('input', function () {
  setTokenError('')
})

filterInput.addEventListener('input', applyFilter)

lockButton.addEventListener('click', function () {
  lock('')
})

try {
  const remembered = sessionStorage.getItem(TOKEN_STORAGE_KEY)
  if (remembered) unlock(remembered, true)
} catch (error) {
  /* Storage can be blocked; the person just types the token. */
}
