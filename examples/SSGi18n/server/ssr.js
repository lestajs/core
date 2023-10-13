import serverApp from './index.js'

const publicFolder = serverApp.outDir

import express from 'express'
const server = express()


server.use(express.static(publicFolder))

server.use(async (req, res, next) => {
  const to = await serverApp.routerPush(req.url)
  res.end(to.html)
})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})