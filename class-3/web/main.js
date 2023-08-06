const main = document.querySelector('main')

fetch('http://localhost:3000/movies')
  .then(res => res.json())
  .then(movies => {
    const html = movies.map(movie => {
      return `
      <article data-id="${movie.id}">
        <h2>${movie.title}</h2>
        <img src="${movie.poster}" alt="${movie.title}">
        <p>${movie.year}</p>
        <button>Delete</button>
      </article>`
    }).join('')

    main.innerHTML = html
  })
  .catch(err => {
    const html = `<h1>No encontre ninguna pelicula, ${err}</h1>`

    main.innerHTML = html
  })

document.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    const article = e.target.closest('article')
    const id = article.dataset.id

    fetch(`http://localhost:3000/movies/${id}`, { method: 'DELETE' }).then(res => {
      if (res.ok) {
        article.remove()
      }
    })
  }
})
