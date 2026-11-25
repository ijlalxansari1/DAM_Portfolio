export const organisations = [
  {
    name: 'WaterAid UK',
    slug: 'wateraid',
    website: 'https://www.wateraid.org/uk',
  },
  {
    name: 'The Institute of Ismaili Studies',
    slug: 'iis',
    website: 'https://www.iis.ac.uk',
  },
  { name: 'Hunza Folk', slug: 'hunza-folk' },
  { name: 'King’s College London', slug: 'kcl' },
  { name: 'SOAS, University of London', slug: 'soas' },
]

export const categories = [
  {
    name: 'Enterprise DAM',
    slug: 'enterprise-dam',
    description:
      'Digital asset migration, implementation and adoption across teams.',
  },
  {
    name: 'Metadata & taxonomy',
    slug: 'metadata-taxonomy',
    description:
      'The schemas and controlled vocabularies that make an archive easy to search and navigate.',
  },
  {
    name: 'Governance & rights',
    slug: 'governance-rights',
    description:
      'Approvals, permissions and the conditions that determine how material can be used.',
  },
  {
    name: 'AI & automation',
    slug: 'ai-automation',
    description:
      'Metadata enrichment and the human judgements that automated workflows depend on.',
  },
  {
    name: 'Content operations',
    slug: 'content-operations',
    description: 'How teams organise production, review and publishing.',
  },
]

export const metrics = [
  [
    'assets-migrated',
    'Digital assets migrated',
    1500000,
    'assets',
    '1.5M+',
    'Migrated into Orange Logic via AWS S3 at WaterAid.',
  ],
  [
    'ingest-success',
    'Successful ingestion',
    98,
    '%',
    '98%',
    'Success rate under the WaterAid ingest governance process.',
  ],
  [
    'retrieval-time',
    'Faster asset retrieval',
    38,
    '%',
    '38%',
    'Reduction in average retrieval time after the schema and taxonomy redesign.',
  ],
  [
    'staff-trained',
    'Staff trained',
    40,
    'people',
    '40+',
    'People trained on WaterAid’s DAM and taxonomy.',
  ],
  [
    'adoption',
    'Increase in adoption',
    70,
    '%',
    '70%',
    'Increase within three months of training.',
  ],
  [
    'rollout',
    'Faster rollout',
    20,
    '%',
    '20%',
    'Acceleration through cross-functional agile delivery.',
  ],
  [
    'efficiency',
    'Increase in team efficiency',
    23,
    '%',
    '23%',
    'Reported against the previous email-based approvals process.',
  ],
  [
    'monthly-visitors',
    'Monthly website visitors',
    3000,
    'visitors',
    '3,000+',
    'Monthly audience for the Institute’s website.',
  ],
  [
    'archival-images',
    'Archival images catalogued',
    7500,
    'assets',
    '7,500+',
    'Images digitised and catalogued in Axiell Collections.',
  ],
  [
    'collections',
    'Collections covered',
    14,
    'collections',
    '14',
    'Collections connected by the extended taxonomy.',
  ],
  [
    'audience',
    'Cumulative platform views',
    1600000,
    'views',
    '1.6M+',
    'Cumulative views across Hunza Folk’s platforms.',
  ],
  [
    'followers',
    'Platform followers',
    47000,
    'people',
    '47K+',
    'Followers across Hunza Folk’s platforms.',
  ],
] as const

export const projects = [
  {
    slug: 'wateraid-dam-migration',
    organisation: 'wateraid',
    period: '2025',
    visual: 'migration',
    title: 'A more discoverable archive for WaterAid',
    excerpt:
      'Moving a global asset library into Orange Logic and redesigning how teams find and use it.',
    challenge:
      'WaterAid’s country offices needed a dependable way to find, share and publish assets. The move to Orange Logic had to bring a large library across while supporting the different needs of creative, marketing, legal and IT teams.',
    methodology: [
      'Ran discovery sessions with creative, marketing, legal and IT to translate business requirements into platform decisions.',
      'Defined ingest governance for the migration via AWS S3 and designed the metadata model and controlled taxonomy.',
      'Integrated the DAM with CMS and brand production workflows and established quality checks for campaign assets.',
      'Trained staff on the new platform and taxonomy and coordinated delivery across IT, design and communications.',
    ],
    outcomes:
      'Ingest governance gave the project a consistent way to handle exceptions. The new taxonomy reduced retrieval times, staff training helped teams adopt the DAM, and agile coordination accelerated the rollout.',
    metricKeys: [
      'assets-migrated',
      'ingest-success',
      'retrieval-time',
      'staff-trained',
      'adoption',
      'rollout',
    ],
    categories: ['enterprise-dam', 'metadata-taxonomy', 'governance-rights'],
    platforms: ['orange-logic', 'aws-s3'],
  },
  {
    slug: 'iis-content-supply-chain',
    organisation: 'iis',
    period: '2025–present',
    visual: 'workflow',
    title: 'Bringing the content supply chain into view',
    excerpt:
      'Giving editorial and multimedia work a visible owner, approval stage and deadline at the Institute of Ismaili Studies.',
    challenge:
      'The Institute publishes academic news, a magazine, newsletters, podcasts and films. Email-based approvals made ownership and deadlines difficult to track across formats and contributors.',
    methodology: [
      'Introduced Wrike to track projects and approvals, with ownership, stages and deadlines for each content package.',
      'Managed the WordPress CMS and tagging structure and refreshed the website’s imagery and multimedia.',
      'Led redesign and production of the annual magazine and worked with researchers on podcasts and author films.',
      'Segmented the Institute’s Mailchimp newsletters for academic, alumni and community readers.',
    ],
    outcomes:
      'The department reported an efficiency gain compared with email-based approvals. Its WordPress tagging structure now supports website discovery across the Institute’s editorial formats.',
    metricKeys: ['efficiency', 'monthly-visitors'],
    categories: ['content-operations', 'governance-rights'],
    platforms: ['wrike', 'wordpress'],
  },
  {
    slug: 'iis-special-collections',
    organisation: 'iis',
    period: '2024',
    visual: 'archive',
    title: 'Making special collections discoverable',
    excerpt:
      'Cataloguing archival photographs and transcripts in Axiell Collections with a subject-led taxonomy and access controls.',
    challenge:
      'Accession numbers served as reference points for cataloguers, while researchers needed to find material by subject. Culturally sensitive material also required consideration of institutional policy, rights and community constraints.',
    methodology: [
      'Digitised and catalogued more than 7,500 images and 150 transcripts in Axiell Collections.',
      'Ingested a further 3,500 assets using institutionally aligned controlled vocabularies.',
      'Extended the taxonomy across 14 collections, documented the workflow and tested it with technical colleagues.',
    ],
    outcomes:
      'Researchers could find holdings by subject as well as by accession number. The documented process provided a basis for cataloguing subsequent collections.',
    metricKeys: ['archival-images', 'collections'],
    categories: ['metadata-taxonomy', 'governance-rights'],
    platforms: ['axiell-collections'],
  },
  {
    slug: 'hunza-folk-media-archive',
    organisation: 'hunza-folk',
    period: '2018–present',
    visual: 'rights',
    title: 'Governing a community media library',
    excerpt:
      'Building tagging, version control and contributor rights workflows alongside a growing multimedia platform.',
    challenge:
      'A community media project needed a consistent way to track versions, reduce duplicate material and clear contributor rights across social channels.',
    methodology: [
      'Developed a tagging and version control system across more than ten media projects.',
      'Managed the asset library and contributor copyright clearances for community-sourced material.',
    ],
    outcomes:
      'The tagging system reduced duplication across contributors and supported distribution across Hunza Folk’s social channels.',
    metricKeys: ['audience', 'followers'],
    categories: ['content-operations', 'governance-rights'],
    platforms: [],
  },
]

export const capabilities = [
  {
    name: 'Enterprise DAM',
    icon: 'enterprise-dam',
    description:
      'Discovery, ingest design, migration governance and platform adoption for complex collections.',
    relatedProjects: ['wateraid-dam-migration'],
  },
  {
    name: 'Metadata & taxonomy',
    icon: 'metadata-taxonomy',
    description:
      'Metadata schemas and controlled vocabularies built around how teams search, interpret and reuse material.',
    relatedProjects: ['wateraid-dam-migration', 'iis-special-collections'],
  },
  {
    name: 'Governance & rights',
    icon: 'governance-rights',
    description:
      'Approval, access and rights rules that make ownership and permitted use clear across the asset lifecycle.',
    relatedProjects: ['iis-special-collections', 'hunza-folk-media-archive'],
  },
  {
    name: 'Content operations',
    icon: 'content-operations',
    description:
      'Content supply chains that connect briefs, production, approvals and publishing across teams.',
    relatedProjects: ['iis-content-supply-chain'],
  },
]

export const platforms = [
  ['Orange Logic', 'orange-logic', 'expert', 'DAM platforms'],
  ['Axiell Collections', 'axiell-collections', 'expert', 'DAM platforms'],
  ['Asset Bank', 'asset-bank', 'expert', 'DAM platforms'],
  ['Celum', 'celum', 'expert', 'DAM platforms'],
  ['Dash', 'dash', 'expert', 'DAM platforms'],
  ['AEM Assets', 'aem-assets', 'working knowledge', 'DAM platforms'],
  ['Aprimo', 'aprimo', 'working knowledge', 'DAM platforms'],
  ['Bynder', 'bynder', 'working knowledge', 'DAM platforms'],
  ['Dublin Core', 'dublin-core', 'standard', 'Metadata standards'],
  ['IPTC', 'iptc', 'standard', 'Metadata standards'],
  ['Schema.org', 'schema-org', 'standard', 'Metadata standards'],
  ['LCSH', 'lcsh', 'standard', 'Metadata standards'],
  ['Wrike', 'wrike', 'tool', 'Content operations'],
  ['WordPress', 'wordpress', 'tool', 'Content operations'],
  ['SharePoint', 'sharepoint', 'tool', 'Content operations'],
  ['AWS S3', 'aws-s3', 'tool', 'Content operations'],
  ['Python', 'python', 'tool', 'Content operations'],
  ['SQL', 'sql', 'tool', 'Content operations'],
] as const

export const essays = [
  {
    slug: 'metadata-before-migration',
    kind: 'article',
    category: 'enterprise-dam',
    title: 'What to decide before moving a DAM library',
    excerpt:
      'A practical set of questions for planning field mappings, ingest rules and validation before a migration.',
    sections: [
      [
        'Decide what a record must carry',
        'List the information needed for discovery, rights and administration. Trace each requirement to a source field, an agreed default or a named owner. Preserve the original source identifier so records can be reconciled after ingest.',
      ],
      [
        'Make exceptions explicit',
        'Decide how to handle unknown rights, incomplete dates, duplicate files and records without a usable identifier. Give exceptions a queue and an owner. Measure how many records enter that queue during the pilot.',
      ],
      [
        'Test the journeys that matter',
        'Run a representative subset through mapping, import and retrieval. Ask people to find and assess real examples, then compare the result against the baseline. Confirm that a successful upload also means a usable asset.',
      ],
    ],
  },
  {
    slug: 'ai-metadata-enrichment',
    kind: 'research',
    category: 'ai-automation',
    title: 'AI metadata enrichment in cultural heritage',
    excerpt:
      'A research overview from Khalid’s King’s College London dissertation on machine-assisted cataloguing.',
    sections: [
      [
        'Research scope',
        'The dissertation examined AI-driven metadata enrichment for cultural heritage cataloguing with Google Vision, AWS Rekognition and Microsoft Azure. The dissertation received a distinction.',
      ],
      [
        'Where enrichment fits',
        'An enrichment workflow can propose candidate descriptions and subject terms for review. A catalogue can record the source of a candidate term, a reviewer’s decision and the preferred term ultimately applied.',
      ],
      [
        'Questions for a pilot',
        'Compare suggestions against known records, examine missing and misleading labels, and decide which terms require specialist review. Assess whether the process improves discovery and whether the review cost is manageable.',
      ],
    ],
  },
  {
    slug: 'making-rights-searchable',
    kind: 'article',
    category: 'governance-rights',
    title: 'Making usage rights part of asset discovery',
    excerpt:
      'How rights fields, approval states and distribution rules can help teams decide what they can publish.',
    sections: [
      [
        'Capture the decision fields',
        'Record the rights holder, licence, permitted channels and any expiry date as distinct fields. Keep the underlying rights source or agreement attached to the record where reviewers can find it.',
      ],
      [
        'Separate approval and permission',
        'An approved record still needs a licence that covers the proposed channel and date. Check both at distribution time, and route missing or expired permissions to the responsible person.',
      ],
      [
        'Make the rule visible',
        'Show people why an asset is unavailable for a selected use. Give reviewers a clear path to update the record when the terms are renewed or corrected.',
      ],
    ],
  },
]
