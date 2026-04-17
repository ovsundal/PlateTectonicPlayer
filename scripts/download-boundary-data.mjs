/**
 * Download Muller 2022 plate boundary data as static assets.
 *
 * Fetches GeoJSON for every 5 Ma from 0 to 750 Ma (151 files total) from the
 * GPlates Web Service topology API and saves them to
 * public/data/muller/boundaries_{Ma}Ma.json.
 *
 * To regenerate:
 *   node scripts/download-boundary-data.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'data', 'muller')
const BASE_URL = 'https://gws.gplates.org/topology/plate_boundaries'
const MODEL = 'MULLER2022'
const STEP = 5
const MIN_MA = 0
const MAX_MA = 750
const DELAY_MS = 200

await mkdir(OUT_DIR, { recursive: true })

const ages = []
for (let ma = MIN_MA; ma <= MAX_MA; ma += STEP) {
  ages.push(ma)
}

console.log(`Downloading ${ages.length} boundary files to ${OUT_DIR}`)
console.log(`Rate limit: ${DELAY_MS}ms between requests\n`)

let success = 0
let failed = 0

for (let i = 0; i < ages.length; i++) {
  const ma = ages[i]
  const url = `${BASE_URL}?time=${ma}&model=${MODEL}`
  const outPath = join(OUT_DIR, `boundaries_${ma}Ma.json`)

  process.stdout.write(`[${i + 1}/${ages.length}] ${ma} Ma ... `)

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    await writeFile(outPath, text, 'utf8')
    process.stdout.write('OK\n')
    success++
  } catch (err) {
    process.stdout.write(`FAILED (${err.message})\n`)
    failed++
  }

  if (i < ages.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
  }
}

console.log(`\nDone. ${success} succeeded, ${failed} failed.`)
if (failed > 0) {
  console.error('Some files failed to download. Re-run the script to retry.')
  process.exit(1)
}
