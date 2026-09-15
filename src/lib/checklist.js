import { DOCUMENT_TYPES, STATUS_OPTIONS } from '../data/documents.js'

export function isDocumentType(id) {
  return DOCUMENT_TYPES.some((documentType) => documentType.id === id)
}

export function buildChecklist(profile) {
  const documentType = DOCUMENT_TYPES.find((item) => item.id === profile.purpose)
  const status = STATUS_OPTIONS.find((item) => item.value === profile.status)
  const details = documentType.checklist(profile)
  const statusNote = documentType.statusNotes[profile.status]

  return {
    documentType,
    summary: [
      documentType.name,
      `Age ${profile.age}`,
      status.label,
      profile.isFirstTime ? 'First-time applicant' : 'Renewal',
    ],
    eligible: details.eligible ?? true,
    notices: details.notices ?? [],
    requirements: details.requirements ?? [],
    appointment: details.appointment,
    fees: details.fees,
    location: details.location,
    notes: [...(details.notes ?? []), ...(statusNote ? [statusNote] : [])],
  }
}
