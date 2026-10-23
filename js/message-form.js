/* Question and contact forms: validation, sending to the server, and the sent state. */

const MESSAGES_ENDPOINT = '/api/messages'
const SEND_TIMEOUT_MS = 8000

const SEND_FAILED_MESSAGE =
  "We couldn't send your message. Check your connection and try again. If you opened this page as a file, start the server with npm start."

function sendMessage(source, values) {
  const controller = new AbortController()
  const timeout = setTimeout(function () {
    controller.abort()
  }, SEND_TIMEOUT_MS)

  return fetch(MESSAGES_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ source: source }, values)),
    signal: controller.signal,
  })
    .then(function (response) {
      return response
        .json()
        .catch(function () {
          return {}
        })
        .then(function (body) {
          return { ok: response.ok, body: body }
        })
    })
    .finally(function () {
      clearTimeout(timeout)
    })
}

function setupMessageForm(container) {
  const form = container.querySelector('form')
  const success = container.querySelector('[data-message-success]')
  const resetButton = container.querySelector('[data-message-reset]')
  const alertBox = container.querySelector('[data-message-error]')
  const submitButton = form.querySelector('button[type="submit"]')
  const submitLabel = submitButton.lastChild
  const idleLabel = submitLabel.textContent
  const inputs = Array.from(form.querySelectorAll('input, textarea'))
  const source = container.dataset.messageSource

  function showAlert(message) {
    alertBox.querySelector('[data-error-text]').textContent = message || ''
    alertBox.hidden = !message
  }

  function setSending(isSending) {
    submitButton.disabled = isSending
    form.setAttribute('aria-busy', String(isSending))
    submitLabel.textContent = isSending ? ' Sending...' : idleLabel
  }

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      const field = input.closest('.field')
      if (field && !field.querySelector('.field__error').hidden) {
        setFieldError(field, '')
      }
    })
  })

  form.addEventListener('submit', function (event) {
    event.preventDefault()

    if (submitButton.disabled) return

    let firstInvalid = null

    showAlert('')

    const values = {}
    inputs.forEach(function (input) {
      values[input.name] = input.value.trim()
    })

    /* The same rules the server applies before saving (js/message-rules.js). */
    const errors = MessageRules.validateSubmission(Object.assign({ source: source }, values)).errors

    inputs.forEach(function (input) {
      const message = errors[input.name] || ''
      setFieldError(input.closest('.field'), message)
      if (message && !firstInvalid) firstInvalid = input
    })

    if (firstInvalid) {
      firstInvalid.focus()
      return
    }

    setSending(true)

    sendMessage(source, values)
      .then(function (result) {
        if (result.ok) {
          form.reset()
          form.hidden = true
          success.hidden = false
          return
        }

        const fieldErrors = result.body.errors || {}
        let firstServerInvalid = null

        inputs.forEach(function (input) {
          if (fieldErrors[input.name]) {
            setFieldError(input.closest('.field'), fieldErrors[input.name])
            if (!firstServerInvalid) firstServerInvalid = input
          }
        })

        if (firstServerInvalid) {
          firstServerInvalid.focus()
        } else {
          showAlert(result.body.error || SEND_FAILED_MESSAGE)
        }
      })
      .catch(function () {
        showAlert(SEND_FAILED_MESSAGE)
      })
      .then(function () {
        setSending(false)
      })
  })

  resetButton.addEventListener('click', function () {
    success.hidden = true
    form.hidden = false
    showAlert('')
    inputs.forEach(function (input) {
      setFieldError(input.closest('.field'), '')
    })
    inputs[0].focus()
  })
}

document.querySelectorAll('[data-message-form]').forEach(setupMessageForm)
