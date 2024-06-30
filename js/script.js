const global = {
  currentPage : window.location.pathname
};

//Hilight Active Link
function hilightActivelink(){
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') == global.currentPage){
      link.classList.add('active')
    }
  })
}



//show popular movies
async function fetchAPIData(endpoint) {

  showSpinner()

  const API_URL = 'https://api.themoviedb.org/3/'
  const api_key = 'd432ff1982d50a3d5277edd282d7dc1f'

  const response = await fetch(`${API_URL}${endpoint}?api_key=${api_key}&language=en-US`)

  
  const data = await response.json();

  hideSpinner()
  
  return data;
  
}

//display popular 20 movies

async function showPopularMovies() { 
  
  const { results } = await fetchAPIData('movie/popular');

  results.forEach(movie => {

    let div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        ${movie.poster_path ? `<img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
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
}); 

}

//display movie details
async function displayMovieDetails() {
  const detailsId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${detailsId}`)

  //background Image
  backdropImage('movie', movie.backdrop_path);
    
  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
          <div>
          ${movie.poster_path ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />` : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />` }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date} </p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${ movie.budget == 0 ? 'NA' : addCommastoAmount(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${ movie.revenue == 0 ? 'NA' : addCommastoAmount(movie.revenue)
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${ movie.runtime == 0 ? 'NA' : movie.runtime} Minutes</li>
            <li><span class="text-secondary">Status:</span> ${ movie.status == 0 ? 'NA' : movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((genre) => `<li>${genre.name}</li>`).join('')}
          </div>
      </div>`
  
  document.querySelector('#movie-details').appendChild(div)
}

//function for Background Image
function backdropImage(type, path) {
  const bImage = document.createElement('div');
  bImage.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`
  bImage.style.backgroundRepeat = 'no-repeat'
  bImage.style.backgroundSize = 'cover';
  bImage.style.position = 'absolute'
  bImage.style.width = '100vw'
  bImage.style.height = '110vh'
  bImage.style.opacity = '0.2'
  bImage.style.backgroundPosition = 'center'
  bImage.style.top = '0'
  bImage.style.left = '0'
  bImage.style.zIndex = '-1'
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(bImage)
  } else {
    document.querySelector('#show-details').appendChild(bImage)
  }
  
}

function addCommastoAmount(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show')
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show')
}
    
    
document.addEventListener('DOMContentLoaded', init)



//display popular 20 showa

async function showPopularShows() { 
  
  const { results } = await fetchAPIData('tv/popular');

  results.forEach(show => {

    let div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
        ${show.poster_path ? `<img
          src="https://image.tmdb.org/t/p/w500${show.poster_path}"
          class="card-img-top"
          alt="${show.name}"
        />` : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />` }
        
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${show.first_air_date}</small>
        </p>`;

        document.querySelector('#popular-shows').appendChild(div) 
}); 

}

async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  
  const show = await fetchAPIData(`tv/${showId}`);

  //background Image
  backdropImage('tv', show.backdrop_path);
    
  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
          <div>
          ${show.poster_path ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />` : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />` }
          </div>
          <div>
            <h2>${show.original_name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date} </p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${ show.number_of_episodes}</li>
            <li><span class="text-secondary">Last date To Air:</span> ${ show.last_air_date}</li>
            <li><span class="text-secondary">Last Episode to air:</span> ${ show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${ show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((genre) => `<li>${genre.name}</li>`).join('')}
          </div>
      </div>`
  
  document.querySelector('#show-details').appendChild(div)
}

//Init App
function init(){
  switch (global.currentPage){
     case '/':
    case '/index.html':
        showPopularMovies()
        break;
    case '/shows.html':
      showPopularShows()
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      console.log('Search');
      break;   
  }
  hilightActivelink()
}
