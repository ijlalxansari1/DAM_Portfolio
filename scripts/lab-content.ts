export const terms = [
  {
    slug: 'landscape',
    name: 'Landscape',
    description:
      'Natural and occupied environments as represented in visual records.',
    synonyms: ['Scenery'],
  },
  {
    slug: 'mountain',
    name: 'Mountains',
    description: 'Elevated landforms and mountain ranges.',
    synonyms: ['Peaks', 'Highlands'],
    parent: 'landscape',
  },
  {
    slug: 'waterways',
    name: 'Waterways',
    description: 'Rivers, streams, channels and other flowing bodies of water.',
    synonyms: ['Rivers', 'Streams'],
    parent: 'landscape',
  },
  {
    slug: 'oral-history',
    name: 'Oral history',
    description:
      'Recorded recollections and interviews concerning past experiences.',
    synonyms: ['Spoken testimony'],
  },
  {
    slug: 'manuscripts',
    name: 'Manuscripts',
    description:
      'Documents produced by hand or preserved as unique written records.',
    synonyms: ['Handwritten records'],
  },
  {
    slug: 'textiles',
    name: 'Textiles',
    description: 'Woven and otherwise worked fabrics and their documentation.',
    synonyms: ['Cloth', 'Fabric'],
  },
  {
    slug: 'fieldwork',
    name: 'Fieldwork',
    description:
      'Documentation made during work in a community or in a physical environment.',
    synonyms: ['Field documentation'],
  },
]

export const labAssets = [
  {
    recordId: 'ARC-0014',
    slug: 'ridge-survey',
    title: 'Ridge survey photograph',
    archiveCollection: 'Environmental records',
    kind: 'Image',
    visual: 'ridge',
    state: 'Approved',
    subjects: ['mountain', 'fieldwork'],
    licence: 'Demo · editorial use',
    channels: ['Website', 'Internal'],
    description:
      'A survey photograph used to demonstrate subject indexing and approved distribution.',
  },
  {
    recordId: 'ARC-0019',
    slug: 'field-notebook',
    title: 'Field notebook excerpt',
    archiveCollection: 'Field collections',
    kind: 'Document',
    visual: 'folio',
    state: 'Review',
    subjects: ['fieldwork', 'manuscripts'],
    licence: 'Demo · review required',
    channels: [],
    description: 'A sample document awaiting completion of rights review.',
  },
  {
    recordId: 'ARC-0026',
    slug: 'community-interview',
    title: 'Community interview recording',
    archiveCollection: 'Oral histories',
    kind: 'Audio',
    visual: 'sound',
    state: 'Restricted',
    subjects: ['oral-history'],
    licence: 'Demo · restricted',
    channels: ['Internal'],
    description:
      'A restricted example record for material with access conditions.',
  },
  {
    recordId: 'ARC-0031',
    slug: 'woven-detail',
    title: 'Woven textile detail',
    archiveCollection: 'Material culture',
    kind: 'Image',
    visual: 'pattern',
    state: 'Approved',
    subjects: ['textiles'],
    licence: 'Demo · open use',
    channels: ['Website', 'Internal', 'Social'],
    description: 'A sample preservation record for a woven object.',
  },
  {
    recordId: 'ARC-0042',
    slug: 'river-survey',
    title: 'River corridor observation',
    archiveCollection: 'Environmental records',
    kind: 'Video',
    visual: 'water',
    state: 'Intake',
    subjects: ['waterways', 'fieldwork'],
    licence: 'Demo · unconfirmed',
    channels: [],
    description: 'A gathering-stage record with an unconfirmed licence.',
  },
  {
    recordId: 'ARC-0057',
    slug: 'landscape-overview',
    title: 'Landscape overview',
    archiveCollection: 'Environmental records',
    kind: 'Image',
    visual: 'field',
    state: 'Approved',
    subjects: ['landscape', 'waterways'],
    licence: 'Demo · editorial use',
    channels: ['Website', 'Internal'],
    expiry: '2025-12-31T00:00:00.000Z',
    description: 'An approved demonstration asset with an expired licence.',
  },
]

export const workflow = {
  name: 'Asset approval and distribution',
  slug: 'asset-approval',
  description:
    'Move a demonstration record through quality checks and open a distribution channel when its rights allow.',
  stages: [
    {
      name: 'Intake',
      description:
        'Register the record and propose at least one controlled subject.',
      requirements: ['Title', 'Collection', 'Controlled subject'],
      transitions: ['Review'],
    },
    {
      name: 'Review',
      description:
        'Check descriptive metadata, rights and distribution permissions.',
      requirements: ['Licence', 'Rights holder', 'Permitted channels'],
      transitions: ['Intake', 'Approved', 'Restricted'],
    },
    {
      name: 'Approved',
      description:
        'Make the record available to a channel if its licence is current and permits that use.',
      requirements: ['Current rights', 'Approved channel'],
      transitions: ['Review'],
    },
    {
      name: 'Restricted',
      description:
        'Hold the record while permission or access constraints are resolved.',
      requirements: ['Review before distribution'],
      transitions: ['Review'],
    },
  ],
}
