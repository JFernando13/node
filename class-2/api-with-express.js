import express from 'express'
import fs from 'node:fs/promises'
const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')

/* FORMA 1
app.use((req, res, next) => {
  const { method, headers } = req
  if (method !== 'POST' || headers['Content-Type'] !== 'application/json') return next()
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    req.body = JSON.parse(body)
    next()
  })
}) */

// FORMA 2
app.use(express.json())

app.get('/', (_, res) => {
  res.send('<h1>Hello World with express framework</h1>')
})

app.get('/pokemon/ditto', (_, res) => {
  fs.readFile('class-2/mocks/poke-ditto.json', 'utf-8')
    .then(data => res.json(JSON.parse(data)))
    .catch(err => res.send(err))
})

app.post('/pokemon', (req, res) => {
  res.send(req.body)
})

app.use((_, res) => res.send('<h1>404 NOT FOUND</h1>'))

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
