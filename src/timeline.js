var timeline = require('timeline');

// Push a pin when the app starts
Pebble.addEventListener('ready', function() {
  // An hour ahead
  var date = new Date();
  date.setHours(date.getHours() + 1);

  // Create the pin
  var pin = {
    "id": "example-pin-0",
    "time": date.toISOString(),
    "layout": {
      "type": "genericPin",
      "title": "Example Pin",
      "tinyIcon": "system://images/SCHEDULED_EVENT"
    }
  };

  console.log('Inserting pin in the future: ' + JSON.stringify(pin));

  // Push the pin
  timeline.insertUserPin(pin, function(responseText) {
    console.log('Result: ' + responseText);
  });
});
