/* Requirement checker: builds and renders the personalized checklist. */

const checkerForm = document.getElementById('requirement-form')
const purposeSelect = document.getElementById('purpose')
const statusSelect = document.getElementById('status')
const ageInput = document.getElementById('age')
const choicesGroup = document.getElementById('applicant-type-choices')
const resultsBody = document.getElementById('results-body')
const resultsHeading = document.getElementById('results-heading')
const checkerHeading = document.getElementById('checker-heading')

const emptyStateMarkup = resultsBody.innerHTML

function fillSelectOptions() {
  purposeSelect.innerHTML = DOCUMENT_TYPES.map(function (documentType) {
    return '<option value="' + documentType.id + '">' + documentType.optionLabel + '</option>'
  }).join('')

  statusSelect.innerHTML = STATUS_OPTIONS.map(function (option) {
    return '<option value="' + option.value + '">' + option.label + '</option>'
  }).join('')

  const requested = new URLSearchParams(window.location.search).get('document')
  if (requested && isDocumentType(requested)) {
    purposeSelect.value = requested
  }
}

function getSelectedApplicantType() {
  const selected = checkerForm.querySelector('input[name="firstTime"]:checked')
  return selected ? selected.value : ''
}

function validateChecker() {
  const errors = {}
  const age = ageInput.value.trim()
  const ageNumber = Number(age)

  if (age === '') {
    errors.age = 'Enter your age.'
  } else if (!Number.isInteger(ageNumber) || ageNumber < 0 || ageNumber > 120) {
    errors.age = 'Enter a whole number between 0 and 120.'
  }

  if (!getSelectedApplicantType()) {
    errors.firstTime = 'Select whether you are a first-time applicant.'
  }

  return errors
}

function showCheckerErrors(errors) {
  setFieldError(ageInput.closest('.field'), errors.age || '')

  const applicantError = document.getElementById('applicant-type-error')
  applicantError.hidden = !errors.firstTime
  applicantError.querySelector('[data-error-text]').textContent = errors.firstTime || ''
  choicesGroup.classList.toggle('choices--invalid', Boolean(errors.firstTime))
}

function detailRow(iconName, term, value) {
  return (
    '<div class="detail-list__row">' +
    '<dt><span class="icon icon--sm" data-icon="' + iconName + '"></span>' + term + '</dt>' +
    '<dd>' + value + '</dd>' +
    '</div>'
  )
}

function noticeMarkup(notice) {
  const iconName = notice.tone === 'warning' ? 'triangle-alert' : 'info'

  return (
    '<div class="notice notice--' + notice.tone + '">' +
    '<span class="icon" data-icon="' + iconName + '"></span>' +
    '<p>' + notice.message + '</p>' +
    '</div>'
  )
}

function checklistMarkup(result) {
  const documentType = result.documentType
  const appointment = result.appointment
  let markup = ''

  markup +=
    '<ul class="results__chips" aria-label="Your answers">' +
    result.summary
      .map(function (item) {
        return '<li>' + item + '</li>'
      })
      .join('') +
    '</ul>'

  markup += result.notices.map(noticeMarkup).join('')

  if (result.eligible) {
    markup +=
      '<section class="results__section" aria-labelledby="required-documents-heading">' +
      '<h3 id="required-documents-heading">Required Documents</h3>' +
      '<ul class="requirement-list">' +
      result.requirements
        .map(function (item) {
          return (
            '<li>' +
            '<span class="requirement-list__marker"><span class="icon icon--sm" data-icon="check"></span></span>' +
            '<div>' +
            '<p class="requirement-list__label">' + item.label + '</p>' +
            '<p class="requirement-list__detail">' + item.detail + '</p>' +
            '</div>' +
            '</li>'
          )
        })
        .join('') +
      '</ul>' +
      '</section>'

    markup +=
      '<section class="results__section" aria-labelledby="appointment-fees-heading">' +
      '<h3 id="appointment-fees-heading">Appointment &amp; Fees</h3>' +
      '<dl class="detail-list">' +
      detailRow(
        'calendar-check',
        'Appointment required?',
        '<span class="' + (appointment.required ? 'detail-value--yes' : 'detail-value--no') + '">' +
          (appointment.required ? 'Yes' : 'No') +
          '</span>' +
          '<span class="detail-list__hint">' + appointment.detail + '</span>',
      ) +
      detailRow('wallet', 'Estimated Fees', result.fees) +
      detailRow('map-pin', 'Where to apply', result.location) +
      '</dl>' +
      '</section>'

    if (result.notes.length > 0) {
      markup +=
        '<section class="results__section" aria-labelledby="good-to-know-heading">' +
        '<h3 id="good-to-know-heading">Good to Know</h3>' +
        '<ul class="notes-list">' +
        result.notes
          .map(function (note) {
            return '<li><span class="icon icon--sm" data-icon="info"></span><span>' + note + '</span></li>'
          })
          .join('') +
        '</ul>' +
        '</section>'
    }
  }

  markup +=
    '<div class="results__actions">' +
    (result.eligible
      ? '<a class="btn btn--primary" href="guides.html#' + documentType.id + '">' +
        '<span class="icon icon--sm" data-icon="book-open"></span>View Step-by-Step Guide</a>'
      : '') +
    '<a class="btn btn--outline" href="' + documentType.website.url + '" target="_blank" rel="noreferrer">' +
    'Visit ' + documentType.agencyShort + ' Website' +
    '<span class="icon icon--sm" data-icon="external-link"></span>' +
    '<span class="sr-only">(opens in a new tab)</span></a>' +
    '<button class="btn btn--ghost" type="button" id="start-over">' +
    '<span class="icon icon--sm" data-icon="rotate-ccw"></span>Start Over</button>' +
    '</div>'

  markup +=
    '<p class="results__disclaimer">Requirements and fees are estimates based on publicly available ' +
    'information and may change. Always confirm with the ' + documentType.agency + ' before your visit.</p>'

  return markup
}

function startOver() {
  checkerForm.reset()
  showCheckerErrors({})
  resultsBody.innerHTML = emptyStateMarkup
  renderIcons(resultsBody)
  scrollToElement(checkerHeading)
  checkerHeading.focus({ preventScroll: true })
}

checkerForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const errors = validateChecker()
  showCheckerErrors(errors)

  if (errors.age) {
    ageInput.focus()
    return
  }

  if (errors.firstTime) {
    choicesGroup.querySelector('input').focus()
    return
  }

  const result = buildChecklist({
    purpose: purposeSelect.value,
    age: Number(ageInput.value),
    status: statusSelect.value,
    isFirstTime: getSelectedApplicantType() === 'yes',
  })

  resultsBody.innerHTML = checklistMarkup(result)
  renderIcons(resultsBody)
  document.getElementById('start-over').addEventListener('click', startOver)

  scrollToElement(resultsHeading)
  resultsHeading.focus({ preventScroll: true })
})

checkerForm.addEventListener('input', function (event) {
  if (event.target === ageInput) {
    setFieldError(ageInput.closest('.field'), '')
  }
})

checkerForm.addEventListener('change', function (event) {
  if (event.target.name === 'firstTime') {
    document.getElementById('applicant-type-error').hidden = true
    choicesGroup.classList.remove('choices--invalid')
  }
})

fillSelectOptions()
