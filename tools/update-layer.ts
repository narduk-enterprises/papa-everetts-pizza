import fs from 'node:fs/promises'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * UPDATE-LAYER.TS
 * Pulls the latest layers/narduk-nuxt-layer from the template repository.
 * Usage: pnpm run update-layer
 * Options: --no-rewrite-repo  Skip rewriting layer package.json repository.url
 */

const args = process.argv.slice(2)
const skipRewrite = args.includes('--no-rewrite-repo')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const LAYER_PKG_PATH = path.join(ROOT_DIR, 'layers', 'narduk-nuxt-layer', 'package.json')

const TEMPLATE_URL = 'https://github.com/loganrenz/narduk-nuxt-template.git'

function run(cmd: string) {
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR })
}

function getOutput(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe', cwd: ROOT_DIR }).trim()
  } catch {
    return ''
  }
}

async function main() {
  console.log('🔄 Updating Layer from Template...')

  const remotes = getOutput('git remote -v')
  const hasTemplate = remotes.split('\n').some(line => line.startsWith('template\t') && line.includes(TEMPLATE_URL))

  if (!hasTemplate) {
    if (remotes.includes('template\t')) {
      console.log('  Updating "template" remote URL...')
      run(`git remote set-url template ${TEMPLATE_URL}`)
    } else {
      console.log('  Adding "template" remote...')
      run(`git remote add template ${TEMPLATE_URL}`)
    }
  }

  console.log('\n📥 Fetching latest layer code...')
  run('git fetch template main')

  console.log('\n📂 Checking out layers/narduk-nuxt-layer...')
  run('git checkout template/main -- layers/narduk-nuxt-layer')

  if (!skipRewrite) {
    console.log('\n📝 Ensuring layer package.json repository matches current project...')
    try {
      const originUrl = getOutput('git remote get-url origin')
      if (originUrl) {
        const pkgContent = await fs.readFile(LAYER_PKG_PATH, 'utf-8')
        const pkg = JSON.parse(pkgContent)
        if (pkg.repository?.url !== originUrl) {
          pkg.repository = pkg.repository || {}
          pkg.repository.type = 'git'
          pkg.repository.url = originUrl
          pkg.repository.directory = 'layers/narduk-nuxt-layer'
          await fs.writeFile(LAYER_PKG_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
          run('git add layers/narduk-nuxt-layer/package.json')
          console.log(`  ✅ Updated repository.url to ${originUrl} and staged the change`)
        } else {
          console.log('  ⏭ repository.url already matches origin.')
        }
      } else {
        console.warn('  ⚠️ No origin remote found. Skipping repository rewrite.')
      }
    } catch (e: unknown) {
      console.warn(`  ⚠️ Failed to rewrite repository.url: ${e instanceof Error ? e.message : String(e)}`)
    }
  } else {
    console.log('\n⏭ Skipping repository rewrite (--no-rewrite-repo flag provided).')
  }

  console.log('\n📦 Running pnpm install to sync dependencies...')
  run('pnpm install')

  console.log('\n🎉 Layer update complete!')
  console.log('⚠️  Note: Local layer customizations (if any) have been overwritten.')
  console.log('    Layer changes are staged. Run `git diff --cached` to review, then `git commit` when ready.')
}

main().catch(e => {
  console.error('\n❌ Update failed:', e instanceof Error ? e.message : String(e))
  process.exit(1)
})
