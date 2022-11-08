'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const card = document.querySelector('.card');
const searchBtn = document.getElementById('search-btn');
const countryInp = document.getElementById('country-inp');

// Render function
const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        data.population / 1000000
      ).toFixed(1)}M People</p>
      <p class="country__row"><span>🗣️</span>${
        Object.values(data.languages)[0]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.values(data.currencies)[0].name
      }</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const renderCard = function (data) {
  const html = `<div class="header">
    <p>📍Current Location</p>
    </div>
    <div class="information">
        <p>⦿ You are in <strong>${data.city}</strong>, ${data.state}</p>
        <p>⦿ Postal code: <strong>${data.postal}</strong></p>
    </div>`;
  card.insertAdjacentHTML('beforeend', html);
};

//----------------------- Driver Code -----------------------

// function to get JSON from api
const getJSON = function (url, errorMsg) {
  return fetch(url).then(response => {
    console.log(response); // console response
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

// get country data
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0]);

      // Neighbours country
      if (!data[0].hasOwnProperty('borders'))
        throw new Error(`Neighbour Country not found!`);
      const [neighbour] = data[0].borders;
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0], 'neighbour');
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong ❌ ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

countryInp.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchBtn.click();
  }
});

searchBtn.addEventListener('click', () => {
  const countryName = countryInp.value;
  getCountryData(countryName);
  countriesContainer.innerHTML = '';
  countryInp.value = '';
  card.innerHTML = '';
});

// -------------- Get current location --------------
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// -------------- Geo-location --------------
const whereAmI = function () {
  getPosition()
    .then(pos => {
      console.log(pos);
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=375583712777551720314x15115`
      );
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with Geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      renderCard(data);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0]);
    })
    .catch(err => console.error(`${err.message} 💥`))
    .finally((countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', () => {
  countriesContainer.innerHTML = '';
  card.innerHTML = '';
  whereAmI();
});
