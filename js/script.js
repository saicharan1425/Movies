//show popular movies
async function showPopularMovies(){
    const popularMovies = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=d432ff1982d50a3d5277edd282d7dc1f')
    const response = await popularMovies.json()
    const data = await response.results
    data.forEach(movie => {

        let div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path ? `<img
              src="https://image.tmdb.org/t/p/original${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />` }
            
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>`;

            document.querySelector('#popular-movies').appendChild(div)

            console.log(movie);
        
    });
    
    
}
    
showPopularMovies()