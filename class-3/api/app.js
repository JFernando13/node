import cors from 'cors'
import express from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { validateMovies, validatePartialMovie } from '../schema/moviesSchema.js'

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ALLOW_ACCESS_ORIGIN = [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:8021',
      'https://netflix.com'
    ]

    if (ALLOW_ACCESS_ORIGIN.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

const movies = JSON.parse(await fs.readFile('class-3/mocks/movies.json', 'utf-8'))

// MANUAL CORS

// Recuperar todas las peliculas
app.get('/movies', (req, res) => {
  const { genre } = req.query

  // MAUAL CORS
  // const origin = req.header('origin')
  // if (ALLOW_ACCESS_ORIGIN.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  if (genre) {
    const filterGenres = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filterGenres)
  }
  res.json(movies)
})

// Recuperar una pelicula en concreto
app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movie = movies.find(movie => movie.id === id)
  if (movie) res.json(movie)
  res.status(404).json({ err: 'No se encontro la pelicula' })
})

// Crear movie
app.post('/movies', (req, res) => {
  const { data: movie, error } = validateMovies(req.body)

  if (error) {
    return res.status(422).json({ error: error.errors })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    rate: req.body.rate ?? 0,
    ...movie
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// Actualizar una parte de las movies
app.patch('/movies/:id', (req, res) => {
  const { error, data, success } = validatePartialMovie(req.body)

  if (!success) {
    return res.status(422).json({ error: error.errors })
  }

  // Busca la pelicula a actualizar
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  // Si no la encuentra manda un error
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  // update movie
  const updateMovie = {
    ...movies[movieIndex],
    ...data
  }

  movies[movieIndex] = updateMovie

  res.json(updateMovie)
})

// Eliminar una pelicula
app.delete('/movies/:id', (req, res) => {
  // MANUAL CORS
  // const origin = req.header('origin')
  // if (ALLOW_ACCESS_ORIGIN.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ success: 'Movie deleted' })
})

// MANUAL CORS
// CORS - PRE-flight
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ALLOW_ACCESS_ORIGIN.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, PATCH')
//   }

//   res.send(200)
// })

app.listen(3000, () => console.log('You are listening'))
