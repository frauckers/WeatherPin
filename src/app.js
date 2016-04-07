var Wakeup = require('wakeup');
var timeline = require('timeline');

var tempUnit;

// Construct URL
var location = '29708';
var weatherKey = '3b410becc013d20c';
var url = 'http://api.wunderground.com/api/' + weatherKey + '/conditions/forecast/hourly/q/' + location + '.json';
/*
var sendError = function() {
    Pebble.sendAppMessage({'KEY_ERROR': true},
        function(e) {
            console.log('Sent empty state to Pebble successfully!');
        },
        function(e) {
            console.log('Error sending empty state to Pebble!');
        }
    );
};

var xhrRequest = function (url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(this.responseText);
    };

    try {
        xhr.open(type, url);
        xhr.send();
    } catch (ex) {
        console.log(ex);
        sendError();
    }
};

var API_URL_ROOT = 'https://timeline-api.getpebble.com/';


function timelineRequest(pin, type, topics, apiKey, callback) {
  // User or shared?
  var url = API_URL_ROOT + 'v1/' + ((topics !== null) ? 'shared/' : 'user/') + 'pins/' + pin.id;

  // Create XHR
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log('timeline: response received: ' + this.responseText);
    callback(this.responseText);
  };
  xhr.open(type, url);

  // Set headers
  xhr.setRequestHeader('Content-Type', 'application/json');
  if(topics !== null) {
    xhr.setRequestHeader('X-Pin-Topics', '' + topics.join(','));
    xhr.setRequestHeader('X-API-Key', '' + apiKey);
  }

  // Get token
  Pebble.getTimelineToken(function(token) {
    // Add headers
    xhr.setRequestHeader('X-User-Token', '' + token);

    // Send
    xhr.send(JSON.stringify(pin));
    console.log('timeline: request sent.');
  }, function(error) { console.log('timeline: error getting timeline token: ' + error); });
}
*/

var wu_iconToId = {
    'unknown': 0,
    'clear': 1,
    'sunny': 2,
    'partlycloudy': 3,
    'mostlycloudy': 4,
    'mostlysunny': 5,
    'partlysunny': 6,
    'cloudy': 7,
    'rain': 8,
    'snow': 9,
    'tstorms': 10,
    'sleat': 11,
    'flurries': 12,
    'hazy': 13,
    'chancetstorms': 14,
    'chancesnow': 15,
    'chancesleat': 16,
    'chancerain': 17,
    'chanceflurries': 18,
    'nt_unknown': 19,
    'nt_clear': 20,
    'nt_sunny': 21,
    'nt_partlycloudy': 22,
    'nt_mostlycloudy': 23,
    'nt_mostlysunny': 24,
    'nt_partlysunny': 25,
    'nt_cloudy': 26,
    'nt_rain': 27,
    'nt_snow': 28,
    'nt_tstorms': 29,
    'nt_sleat': 30,
    'nt_flurries': 31,
    'nt_hazy': 32,
    'nt_chancetstorms': 33,
    'nt_chancesnow': 34,
    'nt_chancesleat': 35,
    'nt_chancerain': 36,
    'nt_chanceflurries': 37,
    'fog': 38,
    'nt_fog': 39
};

var wu_IconToTiny = {
    'unknown': "system://images/TIMELINE_WEATHER",
    'clear': "system://images/TIMELINE_SUN",
    'sunny': "system://images/TIMELINE_SUN",
    'partlycloudy': "system://images/PARTLY_CLOUDY",
    'mostlycloudy': "system://images/CLOUDY_DAY",
    'mostlysunny': "system://images/PARTLY_CLOUDY",
    'partlysunny': "system://images/PARTLY_CLOUDY",
    'cloudy': "system://images/CLOUDY_DAY",
    'rain': "system://images/HEAVY_RAIN",
    'snow': "system://images/HEAVY_SNOW",
    'tstorms': "system://images/HEAVY_RAIN",
    'sleat': "system://images/LIGHT_SNOW",
    'flurries': "system://images/LIGHT_SNOW",
    'hazy': "system://images/TIMELINE_WEATHER",
    'chancetstorms': "system://images/HEAVY_RAIN",
    'chancesnow': "system://images/LIGHT_SNOW",
    'chancesleat': "system://images/LIGHT_SNOW",
    'chancerain': "system://images/LIGHT_RAIN",
    'chanceflurries': "system://images/LIGHT_SNOW",
    'nt_unknown': "system://images/TIMELINE_WEATHER",
    'nt_clear': "system://images/TIMELINE_SUN",
    'nt_sunny': "system://images/TIMELINE_SUN",
    'nt_partlycloudy': "system://images/PARTLY_CLOUDY",
    'nt_mostlycloudy': "system://images/CLOUDY_DAY",
    'nt_mostlysunny': "system://images/PARTLY_CLOUDY",
    'nt_partlysunny': "system://images/PARTLY_CLOUDY",
    'nt_cloudy': "system://images/CLOUDY_DAY",
    'nt_rain': "system://images/HEAVY_RAIN",
    'nt_snow': "system://images/HEAVY_SNOW",
    'nt_tstorms': "system://images/HEAVY_RAIN",
    'nt_sleat': "system://images/LIGHT_SNOW",
    'nt_flurries': "system://images/LIGHT_SNOW",
    'nt_hazy': "system://images/CLOUDY_DAY",
    'nt_chancetstorms': "system://images/HEAVY_RAIN",
    'nt_chancesnow': "system://images/LIGHT_SNOW",
    'nt_chancesleat': "system://images/LIGHT_SNOW",
    'nt_chancerain': "system://images/LIGHT_RAIN",
    'nt_chanceflurries': "system://images/LIGHT_SNOW",
    'fog': "system://images/CLOUDY_DAY",
    'nt_fog': "system://images/CLOUDY_DAY"
};


xhrRequest(url, 'GET', function(responseText) {
  try {
    var resp = JSON.parse(responseText);
    
    var temp = Math.round(resp.current_observation.temp_f);
    var highTemp = resp.forecast.simpleforecast.forecastday[0].high;
    var lowTemp = resp.forecast.simpleforecast.forecastday[0].low;
    var max = Math.round(highTemp.fahrenheit);
    var min = Math.round(lowTemp.fahrenheit);
    var icon = resp.current_observation.icon_url.match(/\/([^.\/]*)\.gif/)[1];
    var condition = wu_iconToId[icon];
    if (typeof(condition) === 'undefined') {
      condition = 0;
    }
    var desc = resp.forecast.txt_forecast.forecastday[0].fcttext;
    var city = resp.current_observation.display_location.city;
    var dewpoint_f = resp.current_observation.dewpoint_f;
    var dewpoint = Math.round(dewpoint_f);
    var feelslike_f = resp.current_observation.feelslike_f;
    var feelslike = Math.round(feelslike_f);
    var wind = resp.current_observation.wind_string;
    var precip = resp.current_observation.precip_today_string;
    var date = new Date();
    date.setHours(date.getHours());         
    var tinyIcon = wu_IconToTiny[icon];
    var backgroundcolor = "#FFAA55";
    tempUnit = 'F';        
    var headings = ["Forecast", "Powered by"];
    var current = 'Hi/Lo: ' + max + '°/' + min + '°\nFeels like: ' + feelslike + '°' + '\nDewpoint: ' + dewpoint + '°' + '\n\nWind: ' + wind + '\n\nPrecip: ' + precip;
    var paragraphs = [desc,"Weather Underground"];
    var forecast_text =   'Hi/Lo: ' + max + '°/' + min + '° Feels like: ' + feelslike + '°' + ' Dewpoint: ' + dewpoint + '°' + ' Wind: ' + wind;
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    console.log('Before sending data (WU) ');
    console.log ('temp ' + temp);
    console.log ('max ' + max);
    console.log ('min ' + min);
    console.log ('condition ' + condition);
    console.log ('forecast ' + forecast_text);
    console.log ('description ',desc);
    console.log ('dewpoint ' + dewpoint);
    console.log ('feelslike ' + feelslike);
    console.log ('wind ' + wind);
    console.log ('precip ' + precip);
    console.log ('location ' + city);
    //sendData(temp, max, min, condition, desc);

  } catch(ex) {
    console.log(ex.stack);  
    console.log('Something went wrong');   



  }
});
