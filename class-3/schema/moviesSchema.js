import zod from 'zod'

const movieSchema = zod.object({
  title: zod.string({ invalid_type_error: 'No se permite ese tipo', required_error: 'Si o si lo tienes que colocar' }),
  year: zod.number().int().min(1800).max(2024),
  duration: zod.number().int().min(60, 'Debe de ser mayor de 60 min para ser considerado como pelicula'),
  rate: zod.number().min(0).max(10),
  poster: zod.string().url({ message: 'Must be a url format' }),
  genre: zod.array(
    zod.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Crime'],
      { invalid_type_error: 'Se tiene que poner' }
    ))
})

export function validateMovies (object) {
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (shape) {
  return movieSchema.partial().safeParse(shape)
}
