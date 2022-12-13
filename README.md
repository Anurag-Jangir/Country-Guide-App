# Country-Guide-App
* I've used **Asynchronous JavaScript** in this project.
- I was able to _retrieve_ user coordinates and display their corresponding places by using the **Geocode API**.
* Additionally, I used the **Restcountries API** to allow users to search and view specific information on the countries they have searched.
- I employed the **fetch()** approach.
* Additionally, this app effectively uses **catch()** to handle any errors.

## Detailed information: 
> AJAX (Asynchronous JavaScript and XML) allows us to communicate with remote servers in an asynchronous way. With AJAX calls, we can **request data** from web servers dynamically.

As this whole project revolves around fetching API. Now in JavaScript there are actually multiple ways of doing AJAX calls. And as a JavaScript developer we should know all the methods to fetch API i.e. from old school way to latest way.

1. The very first method is using **XMLHttpRequest**:

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

> After that here we have sequence of AJAX calls, so that the second one runs only after the first one has finished. So by doing this, we have one callback inside another callback i.e. (nested callbacks). Now, imagine if we have callbacks inside of callbacks inside of callbacks, like 10 times. And for that kind of behaviour we have special name **CALLBACK HELL**
