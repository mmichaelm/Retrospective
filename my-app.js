var $$ = Dom7;

var app = new Framework7({
    root: '#app',
    name: 'Retro',
    id: 'retrospective.retro',
    panel: {
      swipe: 'left',
    },
    routes: [
      {
        path: '/aboutScrum/',
        url: 'aboutScrum.html',
      },
    ]
  });

var mainView = app.views.create('.view-main');

//Variables:
var image;      //für browser sollte image nur deklariert werden. var image = document.getElementById('retroImage'); 
var geoLocation;
var notes;
var title;
var retroDate;

$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
});

var calendarDateFormat = app.calendar.create({
  inputEl: '#reminderDate',
  date: new Date()
});

var calendarDateFormat = app.calendar.create({
  inputEl: '#retroDate',
  date: new Date()
});

function cameraStart(){
  navigator.camera.getPicture(onSuccessCamera, onFailCamera, { quality: 50, 
  destinationType: Camera.DestinationType.FILE_URI });
};

function onSuccessCamera(imageURI) {
  image = document.getElementById('retroImage');
  image.src = imageURI;
  console.log('imageURI: ' + imageURI);
};
function onFailCamera(message) {
  navigator.notification.alert('Failed because: ' + message,'', 'Error', 'OK' );
};

function getGeolocation(){
  navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation, {timeout: 5000});
};

var onSuccessGeolocation = function(position) {
  var fieldGeoLocation = document.getElementById('geolocation');
  fieldGeoLocation.value = '{' + position.coords.longitude + ',' + position.coords.latitude + '}';
};

function onErrorGeolocation(error) {
  navigator.notification.alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n', '', 'Error', 'OK' );
};

function addReminder(){
  getCityOrGeolocation();
  getNotes();
  getTitleAndRetroDate();
  var reminderDate = document.getElementById('reminderDate').value;
  var reminderDateYear = reminderDate.substr(0,4);
  var reminderDateMonth = reminderDate.substr(5,2)-1; // beware: month 0 = january, 11 = december
  var reminderDateDay = reminderDate.substr(8,2);
  var startDate = new Date(reminderDateYear,reminderDateMonth,reminderDateDay,8,30,0,0,0);
  var endDate = new Date(reminderDateYear,reminderDateMonth,reminderDateDay,9,00,0,0,0);
  console.log('notes: ' + notes + 'retroDate: ' + retroDate);
  //console.log("addReminder: " + "Reminderdate: " + reminderDate + "! Year: " + reminderDateYear + "! Month: " + reminderDateMonth + "! Day: " + reminderDateDay + "! startDate: " +startDate + "! enddate: " + endDate);

  var eventLocation = geoLocation;
  var successCreateEvent = function(message) { 
    navigator.notification.alert("The Reminder 'Retro: " + retroDate + "' was added",'', 'Success', 'OK' );
    cordova.plugins.notification.local.schedule({
      title: 'Calendar Reminder "Retro: ' + retroDate + '" Added' ,
      text: 'You will get a Reminder with the ToDos on ' + reminderDate + ' at 8:30' ,
      foreground: true
    });
    //damit var zurückgesetzt werden, kann man weglassen oder?
    //retroDate = "";
    //reminderDate = "";
    //notes = ""; 
  };
  var errorCreateEvent = function(message) { 
    navigator.notification.alert("Something went wrong. Errorcode: " + message,'', 'Error', 'OK' );
  };

  if(retroDate != "" && reminderDate != "" && notes != ""){
  // create a calendar
  window.plugins.calendar.createCalendar("My calendar","",""); //wenn probleme dann success, error wieder eintragen!
  // add Event
  window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,successCreateEvent,errorCreateEvent);
  }
  else{
    navigator.notification.alert("The 'Retro'-date, the reminder date or the ToDos are undefined",'', 'Missing Information', 'OK' );
  };
};

function sendEmail(){
  getNotes();
  getTitleAndRetroDate();
  console.log('image.src= ' + image.src);
  if(retroDate != "" && notes != ""){
    cordova.plugins.email.open({
      to:          document.getElementById('emailAdresses').value, // email addresses for TO field
      attachments: image.src, // oder: nur image oder [image] file paths or base64 data streams image.src
      subject:     title, // subject of the email
      body:        'toDos:' + notes, // email body (for HTML, set isHtml to true)
   });
  }
  else{
    navigator.notification.alert("the 'Retro'-date or the ToDos are undefined",'', 'Missing Information', 'OK' );
  };
};

function getCityOrGeolocation(){
  geoLocation = document.getElementById('geolocation').value;
  console.log('geoLocation: ' + geoLocation + 'city: ' + document.getElementById('city').value);
  if(geoLocation == undefined || geoLocation == ""){
    geoLocation = document.getElementById('city').value;
  }
  console.log('geoLocation: ' + geoLocation);
};

function getTitleAndRetroDate(){  
  retroDate = document.getElementById('retroDate').value;
  title = "Retro: " + retroDate;
  console.log('RetroDate & title: ' + retroDate + title);
};

function getNotes(){
  notes = document.getElementById('notes').value;
};