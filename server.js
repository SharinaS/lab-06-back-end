'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const superagent = require('superagent');
app.use(cors());
const PORT = process.env.PORT;
// LOCATION DATA
function FormattedData(searchQuery, formattedQuery, latitude, longitude) {
  this.search_query = searchQuery;
  this.formatted_query = formattedQuery;
  this.latitude = latitude;
  this.longitude = longitude;
}
app.get('/location', (request, response) => {
  const searchQuery = request.query.data;
  const urlToVisit = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GOOGLE_MAPS}`;
  // superagent.get('url as a string');
  superagent.get(urlToVisit).then(responseFromSuper => {
    console.log('stuff', responseFromSuper.body);
    // replaced geoData required with the data in the body of my superagent response
    const geoData = responseFromSuper.body;
    const specificGeoData = geoData.results[0];
    const formattedQuery = specificGeoData.formatted_address;
    const lat = specificGeoData.geometry.location.lat;
    const lng = specificGeoData.geometry.location.lng;
    response.send(new FormattedData(searchQuery, formattedQuery, lat, lng));
  }).catch(error => {
    response.status(500).send(error.message);
    console.error(error);
  });
})
// WEATHER DATA
function WeatherGetter(weatherValue) {
  this.forecast = weatherValue.summary;
  this.time = new Date(weatherValue.time * 1000).toDateString();
}
app.get('/weather', (request, response) => {
  try {
    const darkskyData = require('./data/darksky.json');
    const dailyData = darkskyData.daily.data.map(value => new WeatherGetter(value));
    response.send(dailyData);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
})
app.listen(PORT, () => { console.log(`app is up on PORT ${PORT}`) });


