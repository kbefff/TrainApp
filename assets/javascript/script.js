// Initialize Firebase
var config = {
  apiKey: "AIzaSyB8twOUFMfS44hchm13x8TKa80zS9SeGRQ",
  authDomain: "trainschedule-b57ea.firebaseapp.com",
  databaseURL: "https://trainschedule-b57ea.firebaseio.com",
  projectId: "trainschedule-b57ea",
  storageBucket: "trainschedule-b57ea.appspot.com",
  messagingSenderId: "283633591584"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

//create a variable to reference child object in database "trainSchedules"
var connectedRef = database.ref("trainSchedules");


connectedRef.on('child_added', function (snap) {
  if (snap.val()) {
    var $tr = $('<tr>');
    [snap.val().name, snap.val().destination, snap.val().frequency, snap.val().nextArrival, snap.val().minutesAway,]
    .forEach(function (item) {
      var $td = $('<td>');
      $tr.append($td.text(item));
    });
    $('tbody').append($tr);
  }
});

var submit = function (event) {
  event.preventDefault();

  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  
  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

  var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
  var remaining = timeDiff % frequency;
  var minutesAway = frequency - remaining;
  var nextTrain = moment().add(minutesAway, "minutes");
  var nextArrival = moment(nextTrain).format("hh:mm");

  connectedRef.push({
    name: name,
    destination: destination,
    frequency: frequency,
    firstTrain: firstTrain,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });
  $(".input-fields").val("")
}

$('#submit').on('click', function (event) {
  submit(event);
});

connectedRef.on("child_added", function (snapshot) {


  $("#name-display").text(snapshot.val().name);
  $("#destination-display").text(snapshot.val().destination);
  $("#frequency-display").text(snapshot.val().frequency);
  $("#next-arrival-display").text(snapshot.val().nextArrival);
  $("#minutes-away-display").text(snapshot.val().minutesAway);


}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});