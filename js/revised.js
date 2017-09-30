class Map {
  constructor(){
    //initialize array for parking locations
    this.markerList = [];
    // google map canvas
    this.map;
  }

  initMap() {
  // initalize location to hardcoded coordinates
  let myLatLng = {lat: 25.759641, lng: -80.374158};

  //render a new map
  this.map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: myLatLng
  });

  // if current location has been authorized by user
  if (navigator.geolocation) {
    // gets the latitude and longitude coordinates of current location
    navigator.geolocation.getCurrentPosition((position)=>{
      // create position object to hold values
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // sets maps center to the user's current location
      this.map.setCenter(pos);
      // creates user's marker (different icon)
      const userMarker = new google.maps.Marker({
      position: pos,
      icon: './images/current.png',
      map: this.map,
      title: 'Current Location'
      });

      // If position could not be generated
    }, () => {
      console.log('Error')
    });
  } else {
    // Browser doesn't support Geolocation
    console.log('Error')
  }

  // generate parking locations
  if(this.markerList.length > 0){
    // loops through array of parking addresses
    this.markerList.forEach((marker)=>{
      const markerVal = new google.maps.Marker({
      position: marker.location,
      map: this.map,
      icon: './images/parking.png',
      title: 'Hello World!'
      });

      // implements click action to generate information window
      markerVal .addListener('click', ()=>{
          let infowindow = marker.infoWindow;
          infowindow.open(this.map, markerVal);
        });
    });
  }}

  // creates a new marker object that consist of
  // the coordinates, the formatted address, and info window
  newMarker(addressCoord, addressPretty){
    console.log(addressPretty)
    let contentString = `
      <div id="content>
      <div id="siteNotice">
      </div>
      <h1 id="firstHeading" class="firstHeading">Current Location:</h1>
      <div id="bodyContent">
      ${addressPretty}
      </div>
      </div>`;
    let infowindow = new google.maps.InfoWindow({
          content: contentString
        });
    this.markerList.push({
      address: addressPretty,
      location: addressCoord,
      infoWindow: infowindow
    });
    this.initMap();
  }

//
getLocationObject(addressPretty){

    $.getJSON(
        // 1 argument -> settings object
        {
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          data:{
            address: addressPretty,
            key: "AIzaSyAyFH28gu5Ydd4x3txn64ocoQVXzMgMB44",
            status: false
          },
          // what  to do when everything worked (we get the data)
          success: (infoFromApi)=>{
            this.newMarker(infoFromApi.results[0].geometry.location, addressPretty);
          },

          // what to do when the request errored (we didn't get the data)
          error: (errorInfo)=>{
            console.log(errorInfo);
          }
        }
      );
  }
}

// create a Map instance
const myMap = new Map();

// initialize a map
myMap.initMap();

$(document).ready(()=>{
  $('.my-location').submit((myEvent)=>{
    // prevent default actions of a form submission
    myEvent.preventDefault();
    // takes the address string from user input
    const addressVal = $('#address').val();
      // 
      myMap.getLocationObject(addressVal);
    // reset input field
    $('#address').val('');
  });
});
