import { createHash } from 'node:crypto'
import { expect, test, type APIRequestContext } from '@playwright/test'
import sharp from 'sharp'

async function authenticateAdmin(api: APIRequestContext, baseURL: string) {
  const email = 'portfolio-browser-admin@example.test'
  const password = 'Local-portfolio-playwright-demo!'
  const headers = { Origin: new URL(baseURL).origin }
  const existing = await api.post('/api/users/login', {
    headers,
    data: { email, password },
  })
  if (!existing.ok()) {
    const first = await api.post('/api/users/first-register', {
      headers,
      data: { email, password, name: 'Browser Fixture' },
    })
    expect(first.ok(), await first.text()).toBe(true)
    const login = await api.post('/api/users/login', {
      headers,
      data: { email, password },
    })
    expect(login.ok(), await login.text()).toBe(true)
  }
  return headers
}

test('admin dashboard shortcuts and tool search open the correct workspace', async ({
  page,
  baseURL,
}) => {
  await authenticateAdmin(page.context().request, baseURL!)
  await page.goto('/admin')
  const dashboard = page.getByRole('region', {
    name: /Welcome|Content dashboard/,
  })
  await expect(
    dashboard.getByRole('heading', { name: 'Recent edits' }),
  ).toBeVisible()
  await expect(
    dashboard.getByRole('link', { name: 'New project' }),
  ).toHaveAttribute('href', '/admin/collections/projects/create')

  const tools = dashboard.getByRole('region', { name: 'Workspace tools' })
  await tools
    .getByRole('searchbox', { name: 'Find a workspace tool' })
    .fill('taxonomy terms')
  await expect(tools.getByRole('status')).toHaveText('1 matching tool')
  await tools.getByRole('link', { name: 'Taxonomy terms' }).click()
  await expect(page).toHaveURL(
    (url) => url.pathname === '/admin/collections/taxonomyTerms',
  )

  await page.goto('/admin')
  await dashboard.getByRole('link', { name: /Edit homepage/ }).click()
  await expect(page).toHaveURL(
    (url) => url.pathname === '/admin/globals/homepage',
  )
})

test('drafts, authenticated preview, publishing, redirects and unpublishing', async ({
  page,
  request,
  isMobile,
  baseURL,
}) => {
  test.skip(
    isMobile,
    'The publishing lifecycle runs once against the test database.',
  )
  const api = page.context().request
  const headers = await authenticateAdmin(api, baseURL!)

  await page.goto('/admin')
  await expect(
    page.getByText('Projects', { exact: true }).first(),
  ).toBeVisible()
  const slug = 'browser-lifecycle-' + Date.now()
  const destination = slug + '-published'
  const create = await api.post('/api/projects?draft=true', {
    headers,
    data: {
      title: 'Browser fixture draft',
      slug,
      excerpt: 'A synthetic fixture to verify the publishing lifecycle.',
      challenge: 'Check separation between draft and public content.',
      methodology: [{ text: 'Save, preview and publish the fixture.' }],
      outcomes: 'The public portfolio responds to each publishing change.',
      period: 'Test fixture',
      _status: 'draft',
    },
  })
  expect(create.ok(), await create.text()).toBe(true)
  const { doc } = await create.json()
  const publicPath = '/projects/' + slug
  try {
    expect((await request.get(publicPath)).status()).toBe(404)
    await page.goto('/api/preview?kind=projects&slug=' + slug)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Browser fixture draft' }),
    ).toBeVisible()
    await expect(page.getByText('Draft preview', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Exit preview' }).click()
    await expect(page).toHaveURL('/')
    const published = await api.patch('/api/projects/' + doc.id, {
      headers,
      data: { _status: 'published', title: 'Browser fixture published' },
    })
    expect(published.ok(), await published.text()).toBe(true)
    await expect
      .poll(async () => (await request.get(publicPath)).status())
      .toBe(200)

    const drafted = await api.patch('/api/projects/' + doc.id + '?draft=true', {
      headers,
      data: { _status: 'draft', title: 'Working draft title' },
    })
    expect(drafted.ok(), await drafted.text()).toBe(true)
    const publicHTML = await (await request.get(publicPath)).text()
    expect(publicHTML).toContain('Browser fixture published')
    expect(publicHTML).not.toContain('Working draft title')
    const publicAPI = await request.get(
      '/api/projects/' + doc.id + '?draft=true',
    )
    expect(await publicAPI.text()).not.toContain('Working draft title')

    const renamed = await api.patch('/api/projects/' + doc.id, {
      headers,
      data: {
        _status: 'published',
        slug: destination,
        title: 'Browser fixture published',
      },
    })
    expect(renamed.ok(), await renamed.text()).toBe(true)
    await expect
      .poll(async () =>
        (await request.get(publicPath, { maxRedirects: 0 })).status(),
      )
      .toBe(308)
    expect((await request.get('/projects/' + destination)).status()).toBe(200)
    const unpublished = await api.patch('/api/projects/' + doc.id, {
      headers,
      data: { _status: 'draft' },
    })
    expect(unpublished.ok(), await unpublished.text()).toBe(true)
    await expect
      .poll(async () =>
        (await request.get('/projects/' + destination)).status(),
      )
      .toBe(404)
  } finally {
    await api.delete('/api/projects/' + doc.id, { headers })
  }
})

test('media stays private until approved and the file is blocked after expiry', async ({
  page,
  request,
  isMobile,
  baseURL,
}) => {
  test.skip(
    isMobile,
    'The media lifecycle runs once against the test database.',
  )
  const api = page.context().request
  const headers = await authenticateAdmin(api, baseURL!)
  const image = await sharp({
    create: { width: 4, height: 4, channels: 3, background: '#244fdb' },
  })
    .png()
    .toBuffer()
  const uploaded = await api.post('/api/media', {
    headers,
    multipart: {
      _payload: JSON.stringify({
        title: 'Synthetic rights fixture',
        licence: 'Test fixture',
        alt: 'A blue square',
      }),
      file: {
        name: 'test-rights-' + Date.now() + '.png',
        mimeType: 'image/png',
        buffer: image,
      },
    },
  })
  expect(uploaded.ok(), await uploaded.text()).toBe(true)
  const { doc } = await uploaded.json()
  try {
    expect(doc.checksum).toBe(createHash('sha256').update(image).digest('hex'))
    expect([403, 404]).toContain((await request.get(doc.url)).status())
    const published = await api.patch('/api/media/' + doc.id, {
      headers,
      data: {
        approval: 'approved',
        visibility: 'public',
        confidentiality: 'public',
      },
    })
    expect(published.ok(), await published.text()).toBe(true)
    const publicFile = await request.get(doc.url)
    expect(publicFile.status()).toBe(200)
    expect(publicFile.headers()['cache-control']).toContain('no-store')
    const expired = await api.patch('/api/media/' + doc.id, {
      headers,
      data: { expiry: '2024-01-01' },
    })
    expect(expired.ok(), await expired.text()).toBe(true)
    expect([403, 404]).toContain((await request.get(doc.url)).status())
  } finally {
    await api.delete('/api/media/' + doc.id, { headers })
  }
})
