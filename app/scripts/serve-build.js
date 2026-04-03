#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const http = require('http')

const buildDir = path.resolve(__dirname, '..', 'build')
const port = Number(process.env.PORT || process.argv[2] || 3000)

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const safePath = (urlPath) => {
  const cleaned = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '')
  const resolved = path.resolve(buildDir, cleaned)
  if (!resolved.startsWith(buildDir)) return null
  return resolved
}

const sendFile = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Internal Server Error')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    res.statusCode = 200
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
    res.end(data)
  })
}

if (!fs.existsSync(buildDir)) {
  process.stderr.write('Build folder not found. Run `yarn build` first.\n')
  process.exit(1)
}

const server = http.createServer((req, res) => {
  const requested = safePath(req.url || '/')
  if (!requested) {
    res.statusCode = 400
    res.end('Bad Request')
    return
  }

  fs.stat(requested, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(res, requested)
      return
    }

    if (!err && stat.isDirectory()) {
      const indexPath = path.join(requested, 'index.html')
      if (fs.existsSync(indexPath)) {
        sendFile(res, indexPath)
        return
      }
    }

    sendFile(res, path.join(buildDir, 'index.html'))
  })
})

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`App available at http://localhost:${port}\n`)
})
