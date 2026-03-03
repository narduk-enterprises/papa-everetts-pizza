import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * VALIDATE.TS — Setup validation for the project.
 * Usage: pnpm run validate
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')

function checkCommand(command: string, successMessage: string, errorMessage: string): boolean {
  try {
    execSync(command, { encoding: 'utf-8', stdio: 'pipe', cwd: ROOT_DIR })
    console.log(`  ✅ ${successMessage}`)
    return true
  } catch (error: unknown) {
    const stderr = error instanceof Error ? (error as { stderr?: string }).stderr ?? error.message : String(error)
    console.error(`  ❌ ${errorMessage}: ${stderr}`)
    return false
  }
}

async function main() {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
  const APP_NAME = packageJson.name

  let allGood = true
  if (!APP_NAME) {
    console.error('  ❌ No project name in package.json')
    allGood = false
  }

  console.log(`\n🔍 Validating Setup for: ${APP_NAME}`)

  console.log('\nStep 1/4: Validating D1 Databases...')
  try {
    const appsDir = path.join(ROOT_DIR, 'apps')
    const entries = await fs.readdir(appsDir, { withFileTypes: true })
    const appDirs = entries.filter(e => e.isDirectory()).map(e => e.name)
    let checkedAny = false

    for (const appDir of appDirs) {
      const wranglerPath = path.join(appsDir, appDir, 'wrangler.json')
      try {
        const wranglerContent = await fs.readFile(wranglerPath, 'utf-8')
        const parsedWrangler = JSON.parse(wranglerContent)
        if (parsedWrangler.d1_databases?.length > 0) {
          const dbName = parsedWrangler.d1_databases[0].database_name
          if (dbName) {
            checkedAny = true
            allGood = checkCommand(
              `npx wrangler d1 info ${dbName}`,
              `Database ${dbName} exists (apps/${appDir}).`,
              `Database ${dbName} not found (apps/${appDir})`
            ) && allGood
          }
        }
      } catch {
        // skip
      }
    }
    if (!checkedAny) {
      console.log('  ⏭ No apps with D1 databases to validate.')
    }
  } catch (e: unknown) {
    console.error(`  ❌ Failed to scan apps: ${e instanceof Error ? e.message : String(e)}`)
    allGood = false
  }

  console.log('\nStep 2/4: Validating wrangler.json database IDs...')
  try {
    const wranglerPath = path.join(ROOT_DIR, 'apps', 'web', 'wrangler.json')
    const wranglerContent = await fs.readFile(wranglerPath, 'utf-8')
    const parsed = JSON.parse(wranglerContent)
    if (parsed.d1_databases?.[0]?.database_id) {
      console.log(`  ✅ apps/web/wrangler.json — database_id present`)
    } else {
      console.error('  ❌ apps/web/wrangler.json — database_id missing.')
      allGood = false
    }
  } catch {
    console.error('  ❌ apps/web/wrangler.json not found or invalid.')
    allGood = false
  }

  console.log('\nStep 3/4: Doppler (optional)...')
  try {
    execSync('doppler --version', { encoding: 'utf-8', stdio: 'pipe' })
    allGood = checkCommand(
      `doppler projects get ${APP_NAME}`,
      `Doppler project ${APP_NAME} exists.`,
      `Doppler project ${APP_NAME} not found`
    ) && allGood
  } catch {
    console.log('  ⏭ Doppler not configured or not installed — skip.')
  }

  console.log('\nStep 4/4: GitHub (optional)...')
  try {
    execSync('gh secret list', { encoding: 'utf-8', stdio: 'pipe', cwd: ROOT_DIR })
    console.log('  ✅ gh CLI available.')
  } catch {
    console.log('  ⏭ GitHub CLI not available or not authenticated — skip.')
  }

  console.log('\n--- Validation Result ---')
  if (allGood) {
    console.log('🎉 Checks passed.')
  } else {
    console.error('⚠️ Some checks failed.')
    process.exit(1)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
