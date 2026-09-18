/* Renders the official agency links from the shared document data. */

const agencyList = document.getElementById('agency-list')

agencyList.innerHTML = DOCUMENT_TYPES.map(function (documentType) {
  return (
    '<li>' +
    '<a href="' + documentType.website.url + '" target="_blank" rel="noreferrer">' +
    '<span>' +
    '<span class="agency-list__name">' + documentType.agencyShort + '</span>' +
    '<span class="agency-list__doc">' + documentType.name + '</span>' +
    '</span>' +
    '<span class="icon icon--sm" data-icon="external-link"></span>' +
    '<span class="sr-only">(opens in a new tab)</span>' +
    '</a>' +
    '</li>'
  )
}).join('')

renderIcons(agencyList)
