import { describe, expect, it } from 'vitest'
import {
  distribution,
  filterAssets,
  transitionProblem,
  type AssetRecord,
  type TermRecord,
} from '../../src/lib/lab'

const photo: AssetRecord = {
  id: 1,
  recordId: 'ARC-0014',
  title: 'Ridge survey photograph',
  collection: 'Field records',
  description: 'An illustrative asset.',
  kind: 'Image',
  visual: 'ridge',
  state: 'Approved',
  rightsHolder: 'Demo archive',
  licence: 'Editorial',
  channels: ['Website'],
  subjects: [2],
}
const terms: TermRecord[] = [
  { id: 2, name: 'Mountains', synonyms: ['Peaks'], related: [] },
]

describe('DAM lab rules', () => {
  it('matches preferred terms and synonyms alongside filters', () => {
    expect(
      filterAssets([photo], terms, {
        query: 'peaks survey',
        kind: 'Image',
        status: 'Approved',
      }),
    ).toEqual([photo])
    expect(
      filterAssets([photo], terms, {
        query: 'Mountains',
        kind: 'Document',
        status: '',
      }),
    ).toEqual([])
  })
  it('checks approval, expiry and the selected channel', () => {
    expect(distribution(photo, 'Approved', 'Website')).toBeNull()
    expect(distribution(photo, 'Review', 'Website')).toContain(
      'must be approved',
    )
    expect(distribution(photo, 'Approved', 'Social')).toContain('channel')
    expect(
      distribution(
        { ...photo, expiry: '2025-12-01' },
        'Approved',
        'Website',
        Date.parse('2025-12-02'),
      ),
    ).toContain('expired')
  })
  it('requires documented rights to approve an asset', () => {
    const review = {
      name: 'Review',
      requirements: [],
      transitions: ['Approved'],
    }
    expect(transitionProblem(photo, review, 'Approved')).toBeNull()
    expect(
      transitionProblem({ ...photo, channels: [] }, review, 'Approved'),
    ).toContain('permitted channel')
    expect(transitionProblem(photo, review, 'Intake')).toContain('unavailable')
  })
})
