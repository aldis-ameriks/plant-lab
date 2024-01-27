import { test, expect } from '@playwright/test'
import { config } from '../config'

test('renders devices on the home page', async ({ page }) => {
  await page.goto(`${config.baseUrl}/devices/6`)

  await expect(page.getByRole('heading', { name: 'Rubber tree' })).toBeVisible()
  await expect(page.getByText('Sensor id: 6')).toBeVisible()
})
