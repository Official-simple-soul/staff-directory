import { test, expect } from '@playwright/test'

const levelData = {
  level_name: 'L3',
  level_abbreviation: 'Mid-Level Engineer',
}

const employeeData = {
  name: 'Test Employee',
  email: 'test.employee@example.com',
  role: 'Software Engineer',
  department: 'Engineering',
  address: '01, Test Avenue',
  state: 'California',
  country: 'United States',
}

test.describe('Grade Level CRUD', () => {
  test('Create Grade Level', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Manage Level' }).click()

    await page.getByLabel('Level Name').fill(levelData.level_name)
    await page
      .getByLabel('Level Abbreviation')
      .fill(levelData.level_abbreviation)
    await page.getByRole('button', { name: 'Add Level' }).click()

    const notification = page.getByText('L3 is created successfully')
    await notification.waitFor({ state: 'visible' })
    await notification.waitFor({ state: 'hidden' })

    await expect(page.getByText(levelData.level_name)).toBeVisible()
  })
})

test.describe('Employee CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure grade level exists first
    await page.goto('/')
    await page.getByRole('button', { name: 'Manage Level' }).click()

    if (!(await page.getByText(levelData.level_name).isVisible())) {
      await page.getByLabel('Level Name').fill(levelData.level_name)
      await page
        .getByLabel('Level Abbreviation')
        .fill(levelData.level_abbreviation)
      await page.getByRole('button', { name: 'Add Level' }).click()
    }
  })

  test('Create Employee with Grade Level', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Add Employee' }).first().click()

    // Fill basic info
    await page.getByLabel('Full Name').fill(employeeData.name)
    await page.getByLabel('Email').fill(employeeData.email)
    await page.getByLabel('Role').fill(employeeData.role)

    // Select department
    await page.getByLabel('Department').click()
    await page.getByRole('option', { name: employeeData.department }).click()

    // Select grade level
    await page.getByLabel('Grade Level').click()
    await page.getByRole('option', { name: levelData.level_name }).click()

    // Fill location
    await page.getByLabel('Country').click()
    await page.getByRole('option', { name: employeeData.country }).click()
    await page.waitForTimeout(300) // Wait for states to load
    await page.getByLabel('State/Province').click()
    await page.getByRole('option', { name: employeeData.state }).click()
    await page.getByLabel('Address').fill(employeeData.address)

    await page.getByRole('button', { name: 'Create Employee' }).click()

    // Verify
    await expect(page.getByText(employeeData.name)).toBeVisible()
    await expect(page.getByText(levelData.level_name)).toBeVisible()
  })
})
