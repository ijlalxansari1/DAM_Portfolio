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
