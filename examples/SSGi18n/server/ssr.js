import app from './render.js'


const publicFolder = app.outDir

import express from 'express'
const server = express()


server.use(express.static(publicFolder))

server.use((req, res, next) => {
  app.ssr(req.url, (html, to) => res.end(html))
})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})