import esbuild from 'esbuild'
import { resolve } from 'path'
import zlib from 'zlib'
import fs from 'fs'

function outputSize(name) {
  const filePath = resolve(`dist/${name}.prod.js`)
  const fileContent = fs.readFileSync(filePath)
  const compressedSize = zlib.brotliCompressSync(fileContent)
  const size = bytesToSize(compressedSize.length)
  const fullSize = bytesToSize(fileContent.length)
  console.log(`\x1b[32m${name}: ${size} | ${fullSize} \x1b[0m`)
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

function build(config) {
  return esbuild.build({
    ...config
  }).catch(() => process.exit(1))
}

// global
function buildGlobal(name) {
  build({
    entryPoints: [resolve(`scripts/${name}.js`)],
    outfile: `dist/${name}.js`,
    bundle: true,
    platform: 'browser',
    define: { CDN: 'true' }
  })
  // minified version
  build({
    entryPoints: [resolve(`scripts/${name}.js`)],
    outfile: `dist/${name}.prod.js`,
    bundle: true,
    platform: 'browser',
    define: { CDN: 'true' },
    minify: true
  }).then(() => {
    outputSize(name)
  })
}

function buildEsm(name) {
  build({
    entryPoints: [resolve(`scripts/${name}.js`)],
    outfile: `dist/${name}.esm.js`,
    bundle: true,
    platform: 'neutral',
    mainFields: ['module', 'main'],
  })
}
function buildCjs(name) {
  build({
    entryPoints: [resolve(`scripts/${name}.js`)],
    outfile: `dist/${name}.cjs.js`,
    bundle: true,
    target: ['node10.4'],
    platform: 'node'
  })
}

buildGlobal('lesta.mountWidget.global')
buildGlobal('lesta.mountComponent.global')
buildGlobal('lesta.global')

buildEsm('lesta')
buildCjs('lesta')
