const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    API_URL : 'https://api.themoviedb.org/3/',
   api_key : 'd432ff1982d50a3d5277edd282d7dc1f'
  }
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

  
  const API_URL = global.api.API_URL;
  const api_key = global.api.api_key;

  
  const response = await fetch(`${API_URL}${endpoint}?api_key=${api_key}&language=en-US`)
  
  showSpinner()
  
  const data = await response.json();

  hideSpinner()
  
  return data;
  
}

//display slidermovies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const slider = document.createElement('div');
    slider.classList.add('swiper-slide');
    slider.innerHTML = `
            <a href="./routes/movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
          </div>`;
    document.querySelector('.swiper-wrapper').appendChild(slider)

    initSwipe()
  })
}

function initSwipe() {
  const swiper = new Swiper('.swiper', {
    slidersPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView :2
      },
      700: {
        slidesPerView : 3
      },
      1200: {
        slidesPerView : 4
      },
    }
  })
}

//search movies/shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {

    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      ShowAlert('No results found', 'error')
      return;
    }
    showSearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    ShowAlert('Please insert something to search' , global.currentPage == '/' ? 'alert' : 'error' )
  }
}


//Show error alert
function ShowAlert(message, className) {

  const alertElement = document.createElement('div');

  alertElement.classList.add('alert', className);

  alertElement.appendChild(document.createTextNode(message));

  document.querySelector('#alert').appendChild(alertElement);

  setTimeout(() => alertElement.remove(),3000)
}

// make request to search
async function searchAPIData() {

  const API_URL = global.api.API_URL; 
  const api_key = global.api.api_key;
  const channel =  global.search.type;

  showSpinner()

  let response = await fetch(
    `${API_URL}search/${channel}?api_key=${api_key}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  )

  const data = await response.json();

  hideSpinner()
  
  return data;
  
}

//show search results
function showSearchResults(results) {
  //Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {

    let div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
         <a href="${global.search.type}-details.html?id=${result.id}">
        ${result.poster_path ? `<img
          src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />` : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />` }
        
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>`;
        
    
    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>` 
    document.querySelector('#search-results').appendChild(div) 
  }); 

  displayPagination()
}

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
            <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;
  
  document.querySelector('#pagination').appendChild(div)

  //Disable previous btn if we are on 1st page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  //Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  //pagination 
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    showSearchResults(results)
  })
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    showSearchResults(results)
  })
}



//display popular 20 movies

async function showPopularMovies() { 
  
  const popularMovies = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=d432ff1982d50a3d5277edd282d7dc1f');

  const response = await popularMovies.json()
  
  const results = await response.results
    

  results.forEach(movie => {

    let div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
        <a href="./routes/movie-details.html?id=${movie.id}">
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
    
    



//display popular 20 showa

async function showPopularShows() { 
  
  const popularShows = await fetch('https://api.themoviedb.org/3/tv/popular?api_key=d432ff1982d50a3d5277edd282d7dc1f');

  const response = await popularShows.json()
  
  
  const results = await response.results

  
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
// function init(){
//   switch (global.currentPage){
//      case '/':
//     case '/index.html':
//       displaySlider()
//         showPopularMovies()
//         break;
//     case '/routes/shows.html':
//       showPopularShows()
//       break;
//     case '/routes/movie-details.html':
//       displayMovieDetails();
//       break;
//     case '/routes/tv-details.html':
//       displayShowDetails();
//       break;
//     case '/routes/search.html':
//       search();
//       break;   
//   }
// }
hilightActivelink()

displaySlider()
showPopularMovies()
showPopularShows()
displayMovieDetails();
displayShowDetails();
search();

      
        

// document.addEventListener('DOMContentLoaded', init)

