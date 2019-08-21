'use strict';

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const app = express();

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
  
  const geoData = require('./data/geo.json');
  const searchQuery = request.query.data;
  try {
    // put next 4 lines into if statement for catching error
    const formattedQuery = geoData.results[0].formatted_address;
    const lat = geoData.results[0].geometry.location.lat;
    const lng = geoData.results[0].geometry.location.lng;
    response.send(new FormattedData(searchQuery, formattedQuery, lat, lng));
  } catch (error) {
    console.error(error);

    if(searchQuery === ''){ 
      response.status(500).send('Something went wrong!');
    }
  }
})

// WEATHER DATA


function WeatherGetter(weatherValue) {
  this.forecast = weatherValue.summary;
  this.time = new Date(weatherValue.time * 1000).toDateString();
}

app.get('/weather', (request, response) => {
  try {
    const darkskyData = require('./data/darksky.json');
    const dailyData = darkskyData.daily.data.map(value => {
      console.log('value.summary is', value.summary);
      console.log('value.time is', value.time);
      return new WeatherGetter(value);
    })

    response.send(dailyData);

  } catch (error) {
    console.error(error);
    response.status(500).send('Something went wrong!');
  }
})

app.listen(PORT, () => { console.log(`app is up on PORT ${PORT}`) });

