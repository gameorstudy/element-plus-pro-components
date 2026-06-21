import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const esRoot = join(root, 'es')
const styledComponents = ['pro-table', 'editable-pro-table']

function collectCssFiles(dir, styleDir) {
  const cssFiles = []

  for (const name of readdirSync(dir)) {
    const filePath = join(dir, name)
    if (statSync(filePath).isDirectory()) {
      if (filePath === styleDir) {
        continue
      }
      cssFiles.push(...collectCssFiles(filePath, styleDir))
      continue
    }

    if (name.endsWith('.css')) {
      cssFiles.push(filePath)
    }
  }

  return cssFiles.sort()
}

const fullCssParts = []

for (const component of styledComponents) {
  const componentDir = join(esRoot, 'components', component)
  const styleDir = join(componentDir, 'style')
  const cssFiles = collectCssFiles(componentDir, styleDir)

  if (!cssFiles.length) {
    console.warn(`[bundle-component-styles] No CSS found for ${component}`)
    continue
  }

  const output = cssFiles
    .map(file => readFileSync(file, 'utf8'))
    .join('\n')

  writeFileSync(join(styleDir, 'index.css'), output)
  writeFileSync(join(styleDir, 'css.mjs'), "import './index.css'\n")
  fullCssParts.push(output)
  console.log(`[bundle-component-styles] ${component}: ${cssFiles.length} file(s) -> style/index.css`)
}

if (fullCssParts.length) {
  const fullCss = fullCssParts.join('\n')
  writeFileSync(join(esRoot, 'index.css'), fullCss)

  mkdirSync(join(esRoot, 'style'), { recursive: true })
  writeFileSync(join(esRoot, 'style/css.mjs'), "import '../index.css'\n")
  writeFileSync(join(esRoot, 'style/css.d.ts'), '')
  console.log('[bundle-component-styles] full bundle -> es/index.css')
}
