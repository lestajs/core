import fs from 'fs'
import pathModule from 'path'
import util from 'util'
import { generateHeaders } from './generateHeaders.js'
import minifyHTML from './minify.js'

const existsAsync = util.promisify(fs.exists)
const mkdirAsync = util.promisify(fs.mkdir)
const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
  
async function checkDir(path) {
  const pathObj = pathModule.parse(path)
  const dir = pathObj.dir
  if (!await existsAsync(dir)) {
    await mkdirAsync(dir, { recursive: true })
  }
}

function addExtension(path) {
  return /\.[^/.]+$/.test(path) ? '' : '.html'
}

async function saveStaticPage(path, res) {
  path += addExtension(path)
  await checkDir(path)
  writeFileAsync(path, res)
}

async function getStaticFile(path) {
  path += addExtension(path)
  try {
    return await readFileAsync(path, 'utf8') || ''
  } catch(error) {}
  return ''
}

async function generateStaticPage(app, to, html) {
  const minify = app.minify === true ? minifyHTML : app.minify
  const view = {...app.view || {}, ...(to.route.view ? await to.route.view(to) : {}) }
  const headers = [...app.meta || [], ...(to.route.meta ? await to.route.meta(to) : [])]
  let res = await getStaticFile(app.source)
  if (headers) {
    res = res.replace('<head>', '<head>\n' + generateHeaders(headers))
  }
  for (const v in view) {
    res = res.replace('view:' + v, view[v])
  }
  res = res.replace('<!--section:root-->', html)
  if (minify) res = await minify(res)
  return res
}

export { getStaticFile, generateStaticPage, saveStaticPage }


