import {
  Archive,
  Database,
  FileText,
  Network,
  ScanSearch,
  ShieldCheck,
  Workflow,
} from 'lucide-react'

const nodes = [
  { label: 'Assets', Icon: Archive, x: 107, y: 75 },
  { label: 'Taxonomy', Icon: Network, x: 397, y: 75 },
  { label: 'Governance', Icon: ShieldCheck, x: 107, y: 276 },
  { label: 'Discovery', Icon: ScanSearch, x: 397, y: 276 },
]

export function ArchiveDiagram() {
  return (
    <figure className="archive-diagram">
      <div className="diagram-bar">
        <span className="diagram-status" /> Asset information model{' '}
        <Database size={15} aria-hidden />
      </div>
      <svg
        viewBox="0 0 504 350"
        role="img"
        aria-label="Assets, taxonomy and governance are connected through metadata. Metadata supports discovery and distribution."
      >
        <path
          d="M107 118v25h87m203-25v25h-87M107 248v-41h87m203 41v-41h-87M252 204v72"
          stroke="#7091ef"
          strokeWidth="1.3"
          fill="none"
        />
        <path
          d="M252 32v65M45 175h149m116 0h149M252 306v17"
          stroke="#435889"
          strokeWidth="1"
          strokeDasharray="4 5"
          fill="none"
        />
        {nodes.map(({ label, Icon, x, y }) => (
          <g key={label} transform={'translate(' + x + ' ' + y + ')'}>
            <rect
              x="-59"
              y="-29"
              width="118"
              height="85"
              rx="6"
              fill="#15243f"
              stroke="#46608d"
            />
            <Icon x={-12} y={-16} size={24} color="#a6bafe" strokeWidth={1.5} />
            <text x="0" y="32" textAnchor="middle" fill="#e9efff" fontSize="14">
              {label}
            </text>
          </g>
        ))}
        <g transform="translate(252 175)">
          <rect
            x="-57"
            y="-51"
            width="114"
            height="102"
            rx="6"
            fill="#2855df"
            stroke="#98b0ff"
          />
          <Database x={-14} y={-32} size={28} color="#fff" strokeWidth={1.6} />
          <text
            x="0"
            y="26"
            textAnchor="middle"
            fill="white"
            fontSize="15"
            fontWeight="650"
          >
            Metadata
          </text>
        </g>
        <g transform="translate(252 302)">
          <rect
            x="-60"
            y="-26"
            width="120"
            height="38"
            rx="4"
            fill="#101a30"
            stroke="#46608d"
          />
          <text x="0" y="-2" textAnchor="middle" fill="#c8d5ff" fontSize="13">
            Distribution
          </text>
        </g>
        <g fill="#a7bbff">
          <circle cx="107" cy="143" r="3" />
          <circle cx="397" cy="143" r="3" />
          <circle cx="107" cy="207" r="3" />
          <circle cx="397" cy="207" r="3" />
        </g>
      </svg>
      <figcaption>
        <span>Intelligent Archive</span>
        <span>Asset relationships</span>
      </figcaption>
    </figure>
  )
}

export function ArchiveArtwork({
  kind,
  compact = false,
}: {
  kind?: string | null
  compact?: boolean
}) {
  const visual = kind || 'archive'
  const migration = visual === 'migration'
  const stages = migration
    ? ['Source assets', 'Governed ingest', 'Orange Logic']
    : visual === 'workflow'
      ? ['Brief', 'Review', 'Publish']
      : visual === 'rights'
        ? ['Record', 'Permission', 'Channel']
        : ['Accession', 'Description', 'Subject']
  return (
    <div
      className={'archive-art art-' + visual + (compact ? ' art-compact' : '')}
      aria-hidden="true"
    >
      <svg viewBox="0 0 560 270" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 10 }, (_, index) => (
          <ellipse
            key={index}
            cx="280"
            cy="135"
            rx={42 + index * 25}
            ry={21 + index * 12}
            fill="none"
            stroke="currentColor"
            strokeOpacity={index % 2 ? 0.18 : 0.32}
            transform="rotate(-20 280 135)"
          />
        ))}
        <path
          d="M90 135h380M280 37v196"
          stroke="currentColor"
          strokeOpacity=".5"
          strokeDasharray="5 7"
        />
        {[132, 280, 428].map((x, i) => (
          <g transform={'translate(' + x + ' 135)'} key={x}>
            <circle
              r={i === 1 ? 26 : 12}
              fill="var(--art-bg)"
              stroke="currentColor"
            />
            <circle r={i === 1 ? 5 : 3} fill="currentColor" />
            {i === 1 && (
              <circle
                r="35"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".5"
              />
            )}
            {!compact && (
              <text
                y={i === 1 ? 67 : 43}
                textAnchor="middle"
                fill="currentColor"
                fontSize="13"
                fontWeight="600"
              >
                {stages[i]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export function MigrationDiagram() {
  return (
    <figure className="migration-figure">
      <ol>
        <li>
          <Archive aria-hidden />
          <strong>Source library</strong>
          <span>Asset assessment and field mapping</span>
        </li>
        <li>
          <Workflow aria-hidden />
          <strong>Governed ingest</strong>
          <span>AWS S3, validation and exceptions</span>
        </li>
        <li>
          <Database aria-hidden />
          <strong>Orange Logic</strong>
          <span>Metadata and controlled taxonomy</span>
        </li>
        <li>
          <FileText aria-hidden />
          <strong>Publishing workflows</strong>
          <span>Discovery, brand and CMS use</span>
        </li>
      </ol>
      <figcaption>
        Conceptual migration diagram based on the work described in the CV.
      </figcaption>
    </figure>
  )
}
