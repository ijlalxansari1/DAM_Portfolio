import { Box } from 'lucide-react'

export function ArchiveIcon() {
  return (
    <span className="archive-admin-brand-mark">
      <Box size={23} strokeWidth={1.7} aria-hidden />
    </span>
  )
}

export function ArchiveLogo() {
  return (
    <span className="archive-admin-brand">
      <ArchiveIcon />
      <span>
        The Intelligent Archive<small>Content workspace</small>
      </span>
    </span>
  )
}
