# Country-Guide-App
* I've used **Asynchronous JavaScript** in this project.
- I was able to _retrieve_ user coordinates and display their corresponding places by using the **Geocode API**.
* Additionally, I used the **Restcountries API** to allow users to search and view specific information on the countries they have searched.
- I employed the **fetch()** approach.
* Additionally, this app effectively uses **catch()** to handle any errors.

## Detailed information: 
> AJAX (Asynchronous JavaScript and XML) allows us to communicate with remote servers in an asynchronous way. With AJAX calls, we can **request data** from web servers dynamically.

As this whole project revolves around fetching API. Now in JavaScript there are actually multiple ways of doing AJAX calls. And as a JavaScript developer we should know all the methods to fetch API i.e. from old school way to latest way.

1. The very first method is using **`XMLHttpRequest`**:

```
const xhrRequest = new XMLHttpRequest();
  xhrRequest.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  xhrRequest.send();

  xhrRequest.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const [neighbour] = data.borders;
    console.log(neighbour);
    if (!neighbour) return;

    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);
    });
  });
  ```

> **Explanation** : Here in XMLHttpRequest we have to register a callback on the request object for the load event. So here we basically send off the request. So that request then fetches the data in the background. And then once that is done, it will emit the load event. And so using this **event-listener**, we are waiting for that event. And so as soon as the data arrives, this callback function will be called.

> After that here we have sequence of AJAX calls, so that the second one runs only after the first one has finished. So by doing this, we have one callback inside another callback i.e. (nested callbacks). Now, imagine if we have callbacks inside of callbacks inside of callbacks, like 10 times. And for that kind of behaviour we have special name **CALLBACK HELL**. Which makes the code very difficult to understand and maintain. We have **promises** to deal with "callback hell". 

2. The second method is using **`Fetch API`**:
```
fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then(response => {
    console.log(response);
    return response.json();
  })
  .then(data => {
    console.log(data[0]);
  });
```
> Fetch method always returns a **Promise** and a promise is either **fulfilled** or **rejected**.  
> `Promise is object that is used basically as a placeholder for the future result of an asynchronous operation.` or  
> `A promise is like a container for an asynchronously delivered value.` or even less formal  
> `A promise is a container for a future value.`  

![image](https://user-images.githubusercontent.com/89689615/207294618-576bc2e7-a7b8-4dc6-88b2-5705861c7a86.png)

Promises have two stages **Promise Building** and **Promise Consuming**. Fetch() method will return a promise and the promise will be in pending state but at certain point the promise will be then **settled** and either in a `fulfilled` state or `rejected` state. Suppose promise is fulfilled and now we have a value to work with we will use `.then()` method to handle promise.
#### `Response.json()` is also an asynchronous function which also returns another promise.  
<hr>

## Chaining Promises & Handling Errors:
```
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
```


<hr>


# Summary 
  - > In the project we can get our current location simply based on the **Geolocation** of our device. I have used Geolocation API `navigation.geolocation.getCurrentPosition(position, err)` which gave the **co-ordinates** of the location, and after getting **co-ordinates** (latitude & longitude) of current location I did **Reverse-Geocoding**  
  - > "**Reverse-Geocoding** is a process used to convert coordinates (latitude and longitude) to human-readable addresses."  
  I used `https://geocode.xyz/` (Geocode.xyz) API to basically reverse geocode coordinates. Reverse Geocoding gave me the **country** that those coordinates belong to and then based on that country, I could get all the data about the country using `Rest Countries` API.   
  - > I have implemented a search bar 🔍 in this website so that we can search any country.  
  When a country is searched in search bar we will also get the information of its **neighbour country** along with the searched one. And I have used nested fetch() methods to implement this functionality. 
