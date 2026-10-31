/* Builds a personalized checklist from the document data and the user's answers. */

function isDocumentType(id) {
  return DOCUMENT_TYPES.some(function (documentType) {
    return documentType.id === id
  })
}

/* The checklist exactly as data.js defines it, before any admin edits. */
function buildDefaultChecklist(profile) {
  const documentType = DOCUMENT_TYPES.find(function (item) {
    return item.id === profile.purpose
  })
  const status = STATUS_OPTIONS.find(function (item) {
    return item.value === profile.status
  })
  const details = documentType.checklist(profile)
  const rawStatusNote = documentType.statusNotes[profile.status]
  const statusNote = typeof rawStatusNote === 'function' ? rawStatusNote(profile) : rawStatusNote

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

/* The checklist shown to users: the default one with admin edits applied. */
function buildChecklist(profile) {
  const result = buildDefaultChecklist(profile)

  return Object.assign({}, result, {
    notices: result.notices.map(function (notice) {
      return Object.assign({}, notice, { message: editableText(notice.message) })
    }),
    requirements: result.requirements.map(function (item) {
      return { label: editableText(item.label), detail: editableText(item.detail) }
    }),
    appointment: result.appointment && {
      required: result.appointment.required,
      detail: editableText(result.appointment.detail),
    },
    fees: editableText(result.fees),
    location: editableText(result.location),
    notes: result.notes.map(editableText),
  })
}
