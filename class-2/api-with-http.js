import fs from 'node:fs/promises'
import http from 'node:http'

const PORT = process.env.PORT ?? 3001

const request = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET': {
      switch (url) {
        case '/': {
          res.setHeader('Content-Type', 'text/html')
          return res.end('<h1>Estoy en la Home Page</h1>')
        }
        case '/pokemon/ditto': {
          fs.readFile('class-2/mocks/poke-ditto.json', 'utf-8')
            .then(data => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.parse(JSON.stringify(data)))
            })
            .catch(err => {
              res.writeHead(500, { 'Content-Type': 'text/plain' })
              res.end(err)
            })
          break
        }
        default: {
          res.writeHead(404, { 'Content-Type': 'text/html' })
          res.end('<h1>404 page not found</h1>')
        }
      }

      break
    }

    case 'POST': {
      switch (url) {
        case '/pokemon': {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.parse(JSON.stringify(body)))
          })
        }
      }

      break
    }
  }
}

const server = http.createServer(request)

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
