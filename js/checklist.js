/* Builds a personalized checklist from the document data and the user's answers. */

function isDocumentType(id) {
  return DOCUMENT_TYPES.some(function (documentType) {
    return documentType.id === id
  })
}

function buildChecklist(profile) {
  const documentType = DOCUMENT_TYPES.find(function (item) {
    return item.id === profile.purpose
  })
  const status = STATUS_OPTIONS.find(function (item) {
    return item.value === profile.status
  })
  const details = documentType.checklist(profile)
  const statusNote = documentType.statusNotes[profile.status]

  return {
    documentType: documentType,
    summary: [
      documentType.name,
      'Age ' + profile.age,
      status.label,
      profile.isFirstTime ? 'First-time applicant' : 'Renewal',
    ],
    eligible: details.eligible ?? true,
    notices: details.notices ?? [],
    requirements: details.requirements ?? [],
    appointment: details.appointment,
    fees: details.fees,
    location: details.location,
    notes: (details.notes ?? []).concat(statusNote ? [statusNote] : []),
  }
}
