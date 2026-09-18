/* Question and contact forms: validation, error messages, and the sent state. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateMessageField(input) {
  const value = input.value.trim()

  if (!value) return input.dataset.requiredMessage
  if (input.type === 'email' && !EMAIL_PATTERN.test(value)) return input.dataset.invalidMessage

  return ''
}

function setupMessageForm(container) {
  const form = container.querySelector('form')
  const success = container.querySelector('[data-message-success]')
  const resetButton = container.querySelector('[data-message-reset]')
  const inputs = Array.from(form.querySelectorAll('input, textarea'))

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

    let firstInvalid = null

    inputs.forEach(function (input) {
      const message = validateMessageField(input)
      setFieldError(input.closest('.field'), message)
      if (message && !firstInvalid) firstInvalid = input
    })

    if (firstInvalid) {
      firstInvalid.focus()
      return
    }

    form.reset()
    form.hidden = true
    success.hidden = false
  })

  resetButton.addEventListener('click', function () {
    success.hidden = true
    form.hidden = false
    inputs.forEach(function (input) {
      setFieldError(input.closest('.field'), '')
    })
  })
}

document.querySelectorAll('[data-message-form]').forEach(setupMessageForm)
