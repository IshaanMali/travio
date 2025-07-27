const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton')
const searchInput = document.querySelector('input[type="search"]');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();

  let keyword = '';
  if (query.startsWith('country')) keyword = 'countries';
  else if (query.startsWith('countries')) keyword = 'countries';
  else if (query.startsWith('temple')) keyword = 'temples';
  else if (query.startsWith('beach')) keyword = 'beaches';

  if (!keyword) {
    showError("Please enter a valid keyword: country, temple, or beach.");
    return;
  }

  fetch('travel_recommendation_api.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const root = data[0];
      const items = root[keyword];

      if (!items || !Array.isArray(items)) {
        throw new Error(`No data found for ${keyword}`);
      }

      if (keyword === 'countries') {
        const allCities = [];
        items.forEach(country => {
          allCities.push(...country.cities);
        });
        showResults(allCities, 'city');
      } else {
        showResults(items, keyword.slice(0, -1));
      }
    })
    .catch(error => {
      showError(error.message);
    });
});

function showResults(items, type) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card', 'm-2');
    card.style.width = '18rem';

    card.innerHTML = `
      <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

function showError(message) {
  const container = document.getElementById('results');
  container.innerHTML = `<div class="alert alert-danger" role="alert">
                           ${message}
                         </div>`;
}

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  document.getElementById('results').innerHTML = '';
});