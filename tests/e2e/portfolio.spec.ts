import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage, case study and independently accessible URLs', async ({
  page,
  request,
  isMobile,
}) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Khalid Ansari',
    }),
  ).toBeVisible()
  if (isMobile) {
    await page.getByText('Menu', { exact: true }).click()
    await expect(
      page.getByRole('navigation', { name: 'Primary mobile' }),
    ).toBeVisible()
    await page.getByText('Menu', { exact: true }).click()
  }
  await page.getByRole('link', { name: 'Explore My Work' }).click()
  await expect(page).toHaveURL(/#work$/)
  await page.getByRole('link', { name: 'Read the case study' }).click()
  await expect(page).toHaveURL(/\/projects\/wateraid-dam-migration$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'WaterAid',
  )
  const raw = await request.get('/projects/wateraid-dam-migration')
  expect(raw.status()).toBe(200)
  expect(await raw.text()).toContain('Governed ingest')
  expect((await request.get('/projects/missing-case-study')).status()).toBe(404)
  expect((await request.get('/api/preview?kind=homepage')).status()).toBe(401)
  expect((await request.get('/preview/homepage')).status()).toBe(404)
  expect(
    (await request.get('/admin', { maxRedirects: 0 })).status(),
  ).toBeLessThan(400)
})

test('navigation highlights the section being read and follows anchor links', async ({
  page,
  isMobile,
}) => {
  const header = page.locator('.site-header')
  const menu = header.getByText('Menu', { exact: true })
  async function expectCurrent(label: string) {
    if (isMobile) {
      await expect(header.locator('.mobile-nav-current')).toHaveText(label)
    } else {
      await expect(
        header.getByRole('link', { name: label, exact: true }),
      ).toHaveAttribute('aria-current', 'location')
    }
  }
  async function scrollTo(section: string) {
    await page
      .locator('#' + section)
      .evaluate((target) => target.scrollIntoView({ block: 'start' }))
  }

  await page.goto('/')
  await expectCurrent(isMobile ? 'Home' : 'Khalid Ansari home')
  await scrollTo('projects')
  await expectCurrent('Work')
  await scrollTo('dam-lab')
  await expectCurrent('DAM Lab')
  if (isMobile) {
    const bounds = await menu.boundingBox()
    if (!bounds) throw new Error('The sticky mobile menu is not visible.')
    // Tap the menu in place so the test does not scroll the sticky header into view.
    await page.touchscreen.tap(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    )
  }
  const navigation = header.getByRole('navigation', {
    name: isMobile ? 'Primary mobile' : 'Primary',
    exact: true,
  })
  await expect(
    navigation.getByRole('link', { name: 'DAM Lab' }),
  ).toHaveAttribute('aria-current', 'location')
  await navigation.getByRole('link', { name: 'Insights' }).click()
  await expect(page).toHaveURL(/#insights$/)
  await expectCurrent('Insights')
  if (isMobile) await expect(navigation).toBeHidden()

  await page.goto('/#expertise')
  await expectCurrent('Expertise')
  await scrollTo('experience')
  await expectCurrent('About')
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  )
  await expectCurrent('Get in touch')
  await page.evaluate(() => window.scrollTo(0, 0))
  await expectCurrent(isMobile ? 'Home' : 'Khalid Ansari home')
  await page.goto('/projects')
  await expectCurrent('Work')
})

test('expertise expands by keyboard and experience reveals role details', async ({
  page,
}) => {
  await page.goto('/#expertise')
  const topics = page.locator('#expertise .capability')
  await expect(topics.first()).toHaveAttribute('open', '')
  const second = topics.nth(1)
  const summary = second.locator('summary')
  await summary.focus()
  await summary.press('Enter')
  await expect(second.locator('.capability-body')).toBeVisible()
  await expect(topics.first().locator('.capability-body')).toBeHidden()
  await expect(second.getByRole('link').first()).toBeVisible()

  const role = page.locator('#experience .timeline-details').first()
  await expect(role.getByRole('list')).toBeHidden()
  await role.locator('summary').click()
  await expect(role.getByRole('list')).toBeVisible()
})

test('search archives and apply an editorial topic filter', async ({
  page,
}) => {
  await page.goto('/projects')
  await page
    .getByRole('searchbox', { name: 'Search projects' })
    .fill('Orange Logic')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByText('1 project for')).toBeVisible()
  await expect(
    page.getByRole('link', {
      name: 'A more discoverable archive for WaterAid',
    }),
  ).toBeVisible()
  await page.goto('/insights')
  await page.getByRole('link', { name: 'AI & automation' }).click()
  await expect(
    page.getByRole('heading', { name: 'AI & automation', level: 1 }),
  ).toBeVisible()
  await page
    .getByRole('link', {
      name: 'AI metadata enrichment in cultural heritage',
      exact: true,
    })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Research scope' }),
  ).toBeVisible()
})

test('search for a synonym and simulate distribution rules', async ({
  page,
}) => {
  await page.goto('/lab')
  await page
    .getByRole('searchbox', { name: 'Search the catalogue' })
    .fill('Peaks')
  await expect(
    page.getByRole('button', { name: /Ridge survey photograph/ }),
  ).toBeVisible()
  await expect(page.getByText('1 record', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Rights & workflow' }).click()
  await expect(page.getByText('Distribution permitted.')).toBeVisible()
  await page.getByLabel('Distribution channel').selectOption('Social')
  await expect(
    page.getByText('The licence does not permit this channel.'),
  ).toBeVisible()
  await page
    .getByLabel('Demonstration asset')
    .selectOption('Landscape overview')
  await expect(page.getByText('The licence has expired.')).toBeVisible()
  await page.getByRole('button', { name: 'Taxonomy' }).click()
  await page.getByRole('button', { name: 'Mountains' }).click()
  await expect(page.getByText('Peaks, Highlands')).toBeVisible()
  await page.getByRole('button', { name: 'Find assets with this term' }).click()
  await expect(
    page.getByRole('searchbox', { name: 'Search the catalogue' }),
  ).toHaveValue('Mountains')
})

test('public homepage and Lab pass the automated accessibility scan', async ({
  page,
}) => {
  for (const path of ['/', '/lab']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(result.violations).toEqual([])
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
  }
})

test('enquiries reach the private inbox while the API stays private', async ({
  page,
  request,
  isMobile,
}) => {
  test.skip(isMobile, 'One write per browser test run is sufficient.')
  await page.goto('/#contact')
  await page.getByLabel('Your name').fill('Test Visitor')
  await page.getByLabel('Email address').fill('visitor@example.com')
  await page.getByLabel('Subject').fill('Portfolio browser test')
  await page.getByLabel('Message').fill('This is a Playwright test submission.')
  await page.getByRole('button', { name: 'Send enquiry' }).click()
  await expect(page.getByRole('status')).toHaveText(
    'Your enquiry has been sent.',
  )
  expect((await request.get('/api/enquiries')).status()).toBe(403)
})
