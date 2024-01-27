import { test, expect } from '@playwright/test'
import { config } from '../config'

test('renders devices on the home page', async ({ page }) => {
  await page.goto(config.baseUrl)

  let elements = page.getByText('temp.')
  for (const element of await elements.all()) {
    await expect(element).toBeVisible()
  }
})
