/* The rules for the question and contact forms, shared by the browser and the
   server so they cannot drift apart. The forms use it for quick feedback and
   the server runs it again before saving, because it cannot trust the browser. */

;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.MessageRules = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const SOURCES = ['home', 'about', 'contact']
  const LIMITS = { name: 100, email: 254, message: 2000 }

  function cleanText(value) {
    return typeof value === 'string' ? value.trim() : ''
  }

  /* Takes { source, name, email, message } and returns the cleaned values plus
     an errors object keyed by field name. Name and email only matter for the
     contact form. */
  function validateSubmission(body) {
    const source = cleanText(body.source)
    const name = cleanText(body.name)
    const email = cleanText(body.email)
    const message = cleanText(body.message)
    const errors = {}

    if (!SOURCES.includes(source)) {
      errors.source = 'Unknown form.'
    }

    if (!message) {
      errors.message = 'Enter your message before sending.'
    } else if (message.length > LIMITS.message) {
      errors.message = 'Your message is too long. Keep it under ' + LIMITS.message + ' characters.'
    }

    if (source === 'contact') {
      if (!name) {
        errors.name = 'Enter your name.'
      } else if (name.length > LIMITS.name) {
        errors.name = 'Your name is too long. Keep it under ' + LIMITS.name + ' characters.'
      }

      if (!email) {
        errors.email = 'Enter your email address.'
      } else if (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email) {
        errors.email = 'Enter a valid email address, like juan@example.com.'
      }
    }

    return { errors: errors, value: { source: source, name: name, email: email, message: message } }
  }

  return { SOURCES: SOURCES, LIMITS: LIMITS, validateSubmission: validateSubmission }
})
