export type LabView = 'library' | 'taxonomy' | 'workflow'

export type AssetRecord = {
  id: number
  recordId: string
  title: string
  collection: string
  description: string
  kind: string
  visual: string
  state: string
  creator?: string | null
  rightsHolder?: string | null
  licence?: string | null
  expiry?: string | null
  language?: string | null
  subjects: number[]
  channels: string[]
}

export type TermRecord = {
  id: number
  name: string
  description?: string | null
  parent?: number
  synonyms: string[]
  related: number[]
}
export type WorkflowStage = {
  name: string
  description?: string | null
  requirements: string[]
  transitions: string[]
}

export function filterAssets(
  assets: AssetRecord[],
  terms: TermRecord[],
  { query, kind, status }: { query: string; kind: string; status: string },
) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const byID = new Map(
    terms.map((term) => [term.id, [term.name, ...term.synonyms]]),
  )
  return assets.filter((asset) => {
    if (kind && asset.kind !== kind) return false
    if (status && asset.state !== status) return false
    const text = [
      asset.title,
      asset.recordId,
      asset.collection,
      asset.description,
      ...asset.subjects.flatMap((id) => byID.get(id) || []),
    ]
      .join(' ')
      .toLowerCase()
    return words.every((word) => text.includes(word))
  })
}

export function distribution(
  asset: AssetRecord,
  state: string,
  channel: string,
  now = Date.now(),
) {
  if (state !== 'Approved')
    return 'The record must be approved before distribution.'
  if (!asset.licence || !asset.rightsHolder)
    return 'The licence and rights holder must be recorded.'
  if (asset.expiry && Date.parse(asset.expiry) <= now)
    return 'The licence has expired.'
  if (!asset.channels.includes(channel))
    return 'The licence does not permit this channel.'
  return null
}

export function transitionProblem(
  asset: AssetRecord,
  stage: WorkflowStage | undefined,
  next: string,
) {
  if (!stage?.transitions.includes(next))
    return 'This transition is unavailable from the current stage.'
  if (
    next === 'Review' &&
    (!asset.title || !asset.collection || !asset.subjects.length)
  )
    return 'Record a title, collection and controlled subject before review.'
  if (
    next === 'Approved' &&
    (!asset.licence || !asset.rightsHolder || !asset.channels.length)
  )
    return 'Record a licence, rights holder and permitted channel before approval.'
  return null
}
