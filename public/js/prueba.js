var config = {
    apiKey: "AIzaSyA9LK--Iol6qHB1gZDJSNyZ_2bCLG3JkNc",
    authDomain: "mytagsk.firebaseapp.com",
    databaseURL: "https://mytagsk.firebaseio.com",
    projectId: "mytagsk",
    storageBucket: "mytagsk.appspot.com",
    messagingSenderId: "54548966190"
};
firebase.initializeApp(config);


var database = firebase.database();

var usuario = {
    date: "15-1-2019",
    dayName: "Tuesday",
    tagIn: "16:15:00",
    tagOut: "18:00:00",
    timeIn: "00:00:00"
}

/*database.ref("prueba/LRLJ7vqo3bb0ogTuXJZFHOBTd5S2").on("child_added", function(data){
  var tags = data.val()
  console.log(tags)
})*/
var date = new Date()
let first = date.getDate() - date.getDay();
let fecha = date.toLocaleDateString().replace(new RegExp('/', 'g'), '-')
let last = first + 6;
let firstday = new Date(date.setDate(first)).toLocaleDateString().replace(new RegExp('/', 'g'), '-');
let lastday = new Date(date.setDate(last)).toLocaleDateString().replace(new RegExp('/', 'g'), '-');
var urlTagsUser = 'tags/LRLJ7vqo3bb0ogTuXJZFHOBTd5S2'

/*database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_added', function (snapshot) {
        var data = snapshot.val()
        console.log(data)
    });*/

database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_added', function (snapshot) {
    var data = snapshot.val()
    console.log(data)
});

/*database.ref(urlTagsUser).orderByChild('flag').equalTo(0).on("child_added", function(data){
  var key = data.val().date
  console.log("key: "+key)
})*/

/*database.ref("test/16-1-2019").orderByChild("flag").equalTo(0).on("child_added", function(data){
  var key = data.key
  console.log(key)
})*/
