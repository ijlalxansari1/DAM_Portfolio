import { Workspace } from '@/components/lab-workspace'
import { Breadcrumbs } from '@/components/content-parts'
import { catalogue, global } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import type { AssetRecord, LabView, TermRecord, WorkflowStage } from '@/lib/lab'

const getID = (value: number | { id: number }) =>
  typeof value === 'number' ? value : value.id
const viewFrom = (
  value: string | string[] | null | undefined,
): LabView | undefined =>
  value === 'taxonomy' || value === 'workflow' || value === 'library'
    ? value
    : undefined

export async function generateMetadata() {
  const settings = await global('labSettings')
  return pageMetadata(
    '/lab',
    settings.title || 'The DAM Lab',
    settings.description || undefined,
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [assets, terms, workflows, settings, query] = await Promise.all([
    catalogue('labAssets', 'recordId'),
    catalogue('taxonomyTerms', 'name'),
    catalogue('labWorkflows', 'name'),
    global('labSettings'),
    searchParams,
  ])
  const workflow = workflows[0]
  const records: AssetRecord[] = assets.map((asset) => ({
    id: asset.id,
    recordId: asset.recordId,
    title: asset.title,
    collection: asset.archiveCollection,
    kind: asset.kind || 'Document',
    visual: asset.visual || 'folio',
    description: asset.description,
    state: asset.state || 'Intake',
    creator: asset.creator,
    rightsHolder: asset.rightsHolder,
    licence: asset.licence,
    language: asset.language,
    expiry: asset.expiry,
    subjects: asset.subjects?.map(getID) || [],
    channels: asset.channels?.map((item) => item.text) || [],
  }))
  const vocabulary: TermRecord[] = terms.map((term) => ({
    id: term.id,
    name: term.name,
    description: term.description,
    parent: term.parent ? getID(term.parent) : undefined,
    synonyms: term.synonyms?.map((item) => item.text) || [],
    related: term.relatedTerms?.map(getID) || [],
  }))
  const stages: WorkflowStage[] =
    workflow?.stages?.map((stage) => ({
      name: stage.name,
      description: stage.description,
      requirements: stage.requirements?.map((item) => item.text) || [],
      transitions: stage.transitions?.map((item) => item.target) || [],
    })) || []
  return (
    <section className="wrap archive-page lab-page">
      <div className="route-head">
        <Breadcrumbs links={[{ href: '/lab', label: 'DAM Lab' }]} />
        <p className="eyebrow">Interactive workspace</p>
        <h1>{settings.title || 'The DAM Lab'}</h1>
        <p>{settings.description}</p>
      </div>
      <Workspace
        assets={records}
        terms={vocabulary}
        stages={stages}
        initial={
          viewFrom(query.view) || viewFrom(settings.defaultView) || 'library'
        }
        notice={settings.datasetNotice || 'Illustrative dataset.'}
        workflowName={workflow?.name}
        workflowDescription={workflow?.description}
      />
    </section>
  )
}
