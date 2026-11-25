'use client'

import { useId, useMemo, useState } from 'react'
import {
  Archive,
  AudioLines,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Network,
  Search,
  ShieldCheck,
  Video,
  Workflow,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import {
  distribution,
  filterAssets,
  transitionProblem,
  type AssetRecord,
  type LabView,
  type TermRecord,
  type WorkflowStage,
} from '@/lib/lab'
import { Button } from './ui/button'

const tabs = [
  { id: 'library', name: 'Asset catalogue', Icon: Archive },
  { id: 'taxonomy', name: 'Taxonomy', Icon: Network },
  { id: 'workflow', name: 'Rights & workflow', Icon: Workflow },
] as const
const fileIcons = {
  Document: FileText,
  Audio: AudioLines,
  Image: ImageIcon,
  Video,
}
const channels = ['Website', 'Internal', 'Social']

function Thumb({ asset }: { asset: AssetRecord }) {
  const Icon = fileIcons[asset.kind as keyof typeof fileIcons] || Archive
  return (
    <div className={'asset-thumb thumb-' + asset.visual} aria-hidden="true">
      <svg viewBox="0 0 240 92" preserveAspectRatio="xMidYMid slice">
        {asset.visual === 'ridge' ||
        asset.visual === 'water' ||
        asset.visual === 'field' ? (
          <>
            <circle cx="171" cy="26" r="12" fill="currentColor" opacity=".65" />
            <path
              d="M0 92 59 45l35 22 45-52 102 77M0 92l54-25 33 11 54-27 99 41"
              fill="currentColor"
              opacity=".18"
            />
            <path
              d="M0 92 59 45l35 22 45-52 102 77"
              fill="none"
              stroke="currentColor"
              opacity=".6"
            />
          </>
        ) : (
          <>
            {Array.from({ length: 11 }, (_, index) => (
              <path
                key={index}
                d={'M' + index * 24 + ' 0l-70 92m70-92 70 92'}
                stroke="currentColor"
                opacity=".18"
              />
            ))}
          </>
        )}
      </svg>
      <span>
        <Icon size={22} strokeWidth={1.5} />
      </span>
    </div>
  )
}

function Select({
  title,
  value,
  options,
  onChange,
}: {
  title: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <label className="lab-select" htmlFor={id}>
      <span>{title}</span>
      <span className="select-wrap">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((item, i) => (
            <option
              key={item}
              value={i === 0 && item.startsWith('All ') ? '' : item}
            >
              {item}
            </option>
          ))}
        </select>
        <ChevronDown size={17} aria-hidden />
      </span>
    </label>
  )
}

export function Workspace({
  assets,
  terms,
  stages,
  initial,
  notice,
  workflowName,
  workflowDescription,
}: {
  assets: AssetRecord[]
  terms: TermRecord[]
  stages: WorkflowStage[]
  initial: LabView
  notice: string
  workflowName?: string | null
  workflowDescription?: string | null
}) {
  const [view, setView] = useState(initial)
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<number | undefined>(assets[0]?.id)
  const [termID, setTermID] = useState(terms[0]?.id)
  const [simulation, setSimulation] = useState<Record<number, string>>({})
  const [channel, setChannel] = useState(channels[0])
  const [feedback, setFeedback] = useState('')
  const reduce = useReducedMotion()
  const filtered = useMemo(
    () => filterAssets(assets, terms, { query, kind, status }),
    [assets, terms, query, kind, status],
  )
  const record = assets.find((item) => item.id === selected)
  const visibleRecord = filtered.find((item) => item.id === selected)
  const term = terms.find((item) => item.id === termID)
  const kinds = [...new Set(assets.map((item) => item.kind))].sort()
  const states = [...new Set(assets.map((item) => item.state))].sort()
  const currentState = record ? simulation[record.id] || record.state : ''
  const stage = stages.find((item) => item.name === currentState)
  const eligibility = record
    ? distribution(record, currentState, channel)
    : null

  function openTab(next: LabView) {
    setView(next)
    setFeedback('')
  }

  function transition(next: string) {
    if (!record) return
    const issue = transitionProblem(record, stage, next)
    if (!issue) setSimulation((current) => ({ ...current, [record.id]: next }))
    setFeedback(issue || 'Moved to ' + next.toLowerCase() + '.')
  }

  function searchByTerm(value: TermRecord) {
    setQuery(value.name)
    setKind('')
    setStatus('')
    openTab('library')
  }

  return (
    <div className="workspace">
      <div className="workspace-bar">
        <div
          className="workspace-tabs"
          role="group"
          aria-label="Lab workspace views"
        >
          {tabs.map(({ id, name, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => openTab(id)}
            >
              <Icon size={18} aria-hidden />
              {name}
            </button>
          ))}
        </div>
        <p>{notice}</p>
      </div>
      <motion.div
        key={view}
        className="workspace-panel"
        initial={reduce || view === initial ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
      >
        {view === 'library' && (
          <>
            <div className="lab-filters">
              <label className="lab-search">
                <span>Search the catalogue</span>
                <span>
                  <Search size={18} aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Title, subject or record ID"
                  />
                </span>
              </label>
              <Select
                title="File type"
                value={kind}
                options={['All types', ...kinds]}
                onChange={setKind}
              />
              <Select
                title="Status"
                value={status}
                options={['All statuses', ...states]}
                onChange={setStatus}
              />
            </div>
            <p className="result-count" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
            </p>
            <div className="library-grid">
              <div className="asset-grid">
                {filtered.map((item) => (
                  <button
                    className="asset"
                    aria-pressed={visibleRecord?.id === item.id}
                    type="button"
                    onClick={() => setSelected(item.id)}
                    key={item.id}
                  >
                    <Thumb asset={item} />
                    <span className="asset-copy">
                      <span className="asset-meta">
                        {item.recordId} · {item.kind}
                      </span>
                      <strong>{item.title}</strong>
                      <span className="state-label">{item.state}</span>
                    </span>
                  </button>
                ))}
                {!filtered.length && (
                  <div className="empty-state">
                    <h2>No matching assets</h2>
                    <p>Try a subject synonym or clear the filters.</p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setQuery('')
                        setKind('')
                        setStatus('')
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
              {visibleRecord && (
                <aside className="asset-details" aria-label="Selected asset">
                  <p className="eyebrow">{visibleRecord.recordId}</p>
                  <h2>{visibleRecord.title}</h2>
                  <p>{visibleRecord.description}</p>
                  <dl>
                    <div>
                      <dt>Collection</dt>
                      <dd>{visibleRecord.collection}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{visibleRecord.state}</dd>
                    </div>
                    <div>
                      <dt>Creator</dt>
                      <dd>{visibleRecord.creator || 'Unrecorded'}</dd>
                    </div>
                    <div>
                      <dt>Language</dt>
                      <dd>{visibleRecord.language || 'Unrecorded'}</dd>
                    </div>
                    <div>
                      <dt>Licence</dt>
                      <dd>{visibleRecord.licence || 'Unrecorded'}</dd>
                    </div>
                    <div>
                      <dt>Subjects</dt>
                      <dd>
                        {visibleRecord.subjects
                          .map(
                            (id) => terms.find((item) => item.id === id)?.name,
                          )
                          .filter(Boolean)
                          .join(', ') || 'Unrecorded'}
                      </dd>
                    </div>
                  </dl>
                  <Button
                    variant="secondary"
                    onClick={() => openTab('workflow')}
                  >
                    <ShieldCheck size={17} aria-hidden /> Test usage rights
                  </Button>
                </aside>
              )}
            </div>
          </>
        )}
        {view === 'taxonomy' && (
          <div className="taxonomy-grid">
            <nav aria-label="Controlled terms">
              <h2>Controlled vocabulary</h2>
              {terms.map((item) => (
                <button
                  type="button"
                  aria-pressed={item.id === termID}
                  key={item.id}
                  onClick={() => setTermID(item.id)}
                >
                  <Network size={16} aria-hidden />
                  {item.name}
                </button>
              ))}
            </nav>
            {term && (
              <div className="asset-details">
                <p className="eyebrow">Preferred term</p>
                <h2>{term.name}</h2>
                <p>{term.description}</p>
                <dl>
                  <div>
                    <dt>Synonyms</dt>
                    <dd>{term.synonyms.join(', ') || 'None recorded'}</dd>
                  </div>
                  <div>
                    <dt>Broader term</dt>
                    <dd>
                      {terms.find((item) => item.id === term.parent)?.name ||
                        'Top-level term'}
                    </dd>
                  </div>
                  <div>
                    <dt>Narrower terms</dt>
                    <dd>
                      {terms
                        .filter((item) => item.parent === term.id)
                        .map((item) => item.name)
                        .join(', ') || 'None recorded'}
                    </dd>
                  </div>
                  <div>
                    <dt>Related terms</dt>
                    <dd>
                      {terms
                        .filter((item) => term.related.includes(item.id))
                        .map((item) => item.name)
                        .join(', ') || 'None recorded'}
                    </dd>
                  </div>
                </dl>
                <Button variant="secondary" onClick={() => searchByTerm(term)}>
                  Find assets with this term
                </Button>
              </div>
            )}
          </div>
        )}
        {view === 'workflow' && (
          <div className="workflow-panel">
            <h2>{workflowName || 'Rights and approval'}</h2>
            {workflowDescription && <p>{workflowDescription}</p>}
            {assets.length > 0 && (
              <Select
                title="Demonstration asset"
                value={record?.title || assets[0].title}
                options={assets.map((item) => item.title)}
                onChange={(name) => {
                  setSelected(assets.find((item) => item.title === name)?.id)
                  setFeedback('')
                }}
              />
            )}
            {!stages.length && <p>No demonstration workflow is published.</p>}
            {record && (
              <>
                <ol className="stage-grid">
                  {stages.map((item) => (
                    <li
                      key={item.name}
                      aria-current={
                        item.name === currentState ? 'step' : undefined
                      }
                    >
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </li>
                  ))}
                </ol>
                <div className="workflow-detail">
                  <div className="asset-details">
                    <p className="eyebrow">Current stage</p>
                    <h3>{currentState}</h3>
                    {stage?.requirements.length ? (
                      <ul>
                        {stage.requirements.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="transition-list">
                      {stage?.transitions.map((next) => (
                        <Button
                          type="button"
                          variant="secondary"
                          key={next}
                          onClick={() => transition(next)}
                        >
                          Move to {next.toLowerCase()}
                        </Button>
                      ))}
                    </div>
                    <p role="status">{feedback}</p>
                  </div>
                  <div className="asset-details">
                    <p className="eyebrow">Distribution check</p>
                    <h3>Can I use this asset?</h3>
                    <Select
                      title="Distribution channel"
                      value={channel}
                      options={channels}
                      onChange={setChannel}
                    />
                    <p role="status">
                      <strong>
                        {eligibility
                          ? 'Distribution blocked. '
                          : 'Distribution permitted. '}
                      </strong>
                      {eligibility}
                    </p>
                    <p>
                      {record.licence || 'Unrecorded licence'}
                      {record.expiry &&
                        ' · Expiry ' + record.expiry.slice(0, 10)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
