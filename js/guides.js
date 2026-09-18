/* Renders the How-To Guides list from the shared document data. */

function guideTocMarkup(documentType) {
  return (
    '<li>' +
    '<a href="#' + documentType.id + '">' +
    '<span class="icon icon--sm" data-icon="' + documentType.iconKey + '"></span>' +
    documentType.name +
    '</a>' +
    '</li>'
  )
}

function guideCardMarkup(documentType) {
  const steps = documentType.steps
    .map(function (step, index) {
      return (
        '<li>' +
        '<span class="guide__step-number">' + (index + 1) + '</span>' +
        '<div class="guide__step-body">' +
        '<h3>' + step.title + '</h3>' +
        '<p>' + step.description + '</p>' +
        '</div>' +
        '</li>'
      )
    })
    .join('')

  return (
    '<section class="card" id="' + documentType.id + '" aria-labelledby="' + documentType.id + '-heading">' +
    '<div class="guide__header">' +
    '<span class="guide__icon"><span class="icon icon--lg" data-icon="' + documentType.iconKey + '"></span></span>' +
    '<div>' +
    '<h2 class="guide__title" id="' + documentType.id + '-heading">' + documentType.name + '</h2>' +
    '<p class="guide__agency">' + documentType.agency + '</p>' +
    '</div>' +
    '</div>' +
    '<p class="guide__summary">' + documentType.summary + '</p>' +
    '<ol class="guide__steps">' + steps + '</ol>' +
    '<div class="guide__actions">' +
    '<a class="btn btn--primary" href="index.html?document=' + documentType.id + '#checker">' +
    'Check My Requirements<span class="icon icon--sm" data-icon="arrow-right"></span></a>' +
    '<a class="btn btn--outline" href="' + documentType.website.url + '" target="_blank" rel="noreferrer">' +
    documentType.website.label +
    '<span class="icon icon--sm" data-icon="external-link"></span>' +
    '<span class="sr-only">(opens in a new tab)</span></a>' +
    '</div>' +
    '</section>'
  )
}

const guidesToc = document.getElementById('guides-toc')
const guidesList = document.getElementById('guides-list')

guidesToc.innerHTML = DOCUMENT_TYPES.map(guideTocMarkup).join('')
guidesList.innerHTML = DOCUMENT_TYPES.map(guideCardMarkup).join('')
renderIcons(guidesToc)
renderIcons(guidesList)
