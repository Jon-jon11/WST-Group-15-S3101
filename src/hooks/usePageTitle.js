import { useEffect } from 'react'

const DEFAULT_TITLE = 'GovReady - Government Document Requirement Checker'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} - GovReady` : DEFAULT_TITLE
  }, [title])
}
