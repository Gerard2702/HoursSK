
var date = new Date()
date.setHours(0,0,0,0)
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let day = days[date.getDay()]
let fecha = date.getTime()//date.toLocaleDateString().replace(new RegExp('/', 'g'), '-')
let first = date.getDate() - date.getDay();
let last = first + 6;

let firstday = new Date(date.setDate(first)).setHours(0,0,0,0)//toLocaleDateString().replace(new RegExp('/', 'g'), '-');
let lastday = new Date(date.setDate(last)).setHours(0,0,0,0)//.toLocaleDateString().replace(new RegExp('/', 'g'), '-');

var timer2 = new Timer();

let logUser = null
let tagUser = null
let keyTag = null
let urlTagUser = null
let urlTagsUser = null
let currentUid = null
var totalWeeklyTracker = 0
var oldHour = "00:00:00"

//Components
//let cbtnTag = $("#btnTag")
let cdivHistory = $("#divHistory")
let cdivWeeklyTracking = $("#divWeeklyTracking")
let ctotalWeeklyTracker = $("#totalWeeklyTracker")
let clinkHistory = $("#linkHistory")
let cdivTagIn = $("#divTagIn")


//********************************** FIREBASE **********************************
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
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return true;
        },
        uiShown: function () {
            startSignIn()
        }
    },
    signInFlow: 'popup',
    'credentialHelper': firebaseui.auth.CredentialHelper.NONE,
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

firebase.auth().onAuthStateChanged(function (user) {
    if (user && user.uid != currentUid) {
        currentUid = user.uid;
        logUser = user
        urlTagUser = '/tags/' + logUser.uid /*+ "/" + fecha*/
        urlTagsUser = '/tags/' + logUser.uid
        initHome()
        initWeeklyTracker()
        callWeeklyTracker()
        initHistory()
        callHistory()
    } else {
        currentUid = null;
        ui.start('#firebaseui-auth-container', uiConfig);
    }
});

//********************************** START AND INIT COMPONENTS **********************************
function initHome() {
    //database.ref(urlTagUser).once('value').then(function (snapshot) {
    //    var tag = snapshot.val()
    //    tagUser = tag
    //    startTagButton()
    //    startHome()
    //});
    database.ref(urlTagUser).orderByChild("flag").equalTo(0).once("value", function (snapshot) {
        if (snapshot.val() != null) {
            snapshot.forEach(function (data) {
                var tag = data.val()
                if (tag.date == fecha) {
                    keyTag = data.key
                    tagUser = tag
                }
            })         
        }
        startTagButton()
        startHome()       
    })
}

function startHome() {
    $("#divlogin").attr("hidden", true);
    $("#msjWelcome").html("<strong>Welcome " + logUser.displayName + "</strong>")
    $("#divContent").removeAttr("hidden")
    $("#divContent").addClass("animated fadeIn")
}

function startTagButton() {
    if (tagUser != null) {
        if (tagUser.tagStatus == 1) {
            tagOut(tagUser.tagIn)
        }
        else {
            tagIn()
        }
    } else {
        tagIn()
    }
}


function initHistory() {
    cdivHistory.html("")
    database.ref(urlTagsUser).orderByChild('date').on('child_added', function (snapshot) {
        var data = snapshot.val()
        var newListHistoryModel = newListHistory(data.dayName, data.date, data.tagIn, data.tagOut, data.timeIn)
        cdivHistory.prepend(newListHistoryModel)
    })
}

function callHistory() {
    database.ref(urlTagsUser).on('child_changed', function (snapshot) {
        initHistory()
    })
}

function initWeeklyTracker() {
    cdivWeeklyTracking.html("")
    //database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_added', function (snapshot) {
    //    var data = snapshot.val()
    //    var newListWeeklyModel = newListWeeklyTracking(data.dayName, data.date, data.tagIn, data.tagOut, data.timeIn)
    //    cdivWeeklyTracking.prepend(newListWeeklyModel)
    //    ctotalWeeklyTracker.html(sumHours(oldHour, data.timeIn) + ' h')
    //});
    //*************************************
    //database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_added', function (snapshot) {
    //    var data = snapshot.val()
    //    var newListWeeklyModel = newListWeeklyTracking(data.dayName, data.date, data.tagIn, data.tagOut, data.timeIn)
    //    cdivWeeklyTracking.prepend(newListWeeklyModel)
    //    ctotalWeeklyTracker.html(sumHours(oldHour, data.timeIn) + ' <i class="fa fa-clock"></i>')
    //});
    //***************************************
    database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_added', function (snapshot) {
        var data = snapshot.val()
        var newListWeeklyModel = newListWeeklyTracking(snapshot.key, data.dayName, convertTimeToDate(data.date), data.tagIn, data.tagOut, data.timeIn)
        cdivWeeklyTracking.prepend(newListWeeklyModel)
        ctotalWeeklyTracker.html(sumHours(oldHour, data.timeIn) + ' <i class="fa fa-clock"></i>')
    });
}

function callWeeklyTracker() {
    //database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_changed', function (snapshot) {
    //    initWeeklyTracker()
    //});
    database.ref(urlTagsUser).orderByChild('date').startAt(firstday).endAt(lastday).on('child_changed', function (snapshot) {
        //initWeeklyTracker()
        var data = snapshot.val()
        var newListWeeklyModel = newListWeeklyTracking(snapshot.key, data.dayName, convertTimeToDate(data.date), data.tagIn, data.tagOut, data.timeIn)
        $('#'+snapshot.key+'').replaceWith(newListWeeklyModel)
        ctotalWeeklyTracker.html(sumHours(oldHour, data.timeIn) + ' <i class="fa fa-clock"></i>')
    });
}

function startSignIn() {
    $("#divContent").attr("hidden", true)
    document.getElementById('loader').style.display = 'none';
    $("#divlogin").removeAttr("hidden");
    $('#divlogin').addClass('animated fadeIn');
}

//********************************** EVENTS **********************************
$("#logout").click(function (e) {
    firebase.auth().signOut().then(function () {
    }, function (error) {
    });
})

$("body").on("click", "#btnTag", function () {
    //oldHour = "00:00:00"
    if (tagUser != null) {
        if (tagUser.tagStatus == 1) {
            var tagOut = new Date().toLocaleTimeString()
            var timeIn = resHours(tagOut, tagUser.tagIn)
            tagUser.tagOut = tagOut
            tagUser.tagStatus = 0
            tagUser.timeIn = timeIn
            tagUser.flag = 1
            database.ref(urlTagUser + "/" + keyTag).set(tagUser)
            tagUser = null
            keyTag = null
            initHome()
        } else {
            var tagIn = new Date()
            var newtagUser = new tagUserClass(logUser.uid, day, fecha, tagIn.toLocaleTimeString(), "", 1, "00:00:00", 0)
            database.ref(urlTagUser).push(newtagUser)
            initHome()
        }
    }
    else {
        var tagIn = new Date()
        var newtagUser = new tagUserClass(logUser.uid, day, fecha, tagIn.toLocaleTimeString(), "", 1, "00:00:00", 0)
        database.ref(urlTagUser).push(newtagUser)
        initHome()
    }
})

$("body").on("click", "a.linkHistory", function () {
    console.log($(this).data("day"))
})

//********************************** FUNCTIONS **********************************
function resHours(last, first) {
    var hora1 = (last).split(":"), hora2 = (first).split(":"), t1 = new Date(), t2 = new Date()
    t1.setHours(hora1[0], hora1[1], hora1[2])
    t2.setHours(hora2[0], hora2[1], hora2[2])
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds())
    return t1.toLocaleTimeString()
}

function sumHours(first, last) {
    var hora1 = (first).split(":"), hora2 = (last).split(":"), t1 = new Date(), t2 = new Date()
    t1.setHours(hora1[0], hora1[1], hora1[2])
    t2.setHours(hora2[0], hora2[1], hora2[2])
    t1.setHours(t1.getHours() + t2.getHours(), t1.getMinutes() + t2.getMinutes(), t1.getSeconds() + t2.getSeconds())
    oldHour = t1.toLocaleTimeString()
    return oldHour
}

function convertTimeToDate(time){
    var newDate = new Date(time).toLocaleDateString()
    return newDate
}

function tagIn() {
    cdivTagIn.html(divTagIn())
    stopTagInTimer()
}

function tagOut(startTime) {
    cdivTagIn.html(divTagOut())
    startTagInTimer(startTime)
}

function stopTagInTimer() {
    timer2.stop();
}

function startTagInTimer(timeLogged) {
    let timeNow = new Date();
    let timeLoggedIn = resHours(timeNow.toLocaleTimeString(), timeLogged)
    timeLoggedIn = timeLoggedIn.split(":")
    let t1 = new Date()
    t1.setHours(timeLoggedIn[0], timeLoggedIn[1], timeLoggedIn[2])
    var starValue = (t1.getHours() * 3600) + (t1.getMinutes() * 60) + t1.getSeconds()
    timer2.start({ precision: 'seconds', startValues: { seconds: starValue } });
    timer2.addEventListener('secondsUpdated', function (e) {
        $('#divTimeIn .hours').html(timer2.getTimeValues().hours);
        $('#divTimeIn .minutes').html(timer2.getTimeValues().minutes);
        $('#divTimeIn .seconds').html(timer2.getTimeValues().seconds);
    });
}


//********************************** CLASS **********************************
function tagUserClass(uid, dayName, date, tagIn, tagOut, tagStatus, timeIn, flag) {
    this.uid = uid
    this.dayName = dayName
    this.date = date
    this.tagIn = tagIn
    this.tagOut = tagOut
    this.tagStatus = tagStatus,
        this.timeIn = timeIn,
        this.flag = flag
}

function newListHistory(day, fecha, tagIn, tagOut, hours) {
    let clistHistory = '<a class="list-group-item list-group-item-action text-left linkHistory" data-day="' + fecha + '">'
        + '<div class="d-flex w-100 justify-content-between">'
        + '<h6 class="mb-1"><strong>' + day + ' ' + fecha + '</strong></h6>'
        + '<small class="mb-0">' + hours + ' <i class="fa fa-clock"></i></small>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-6"><small class="mb-0">TAG IN: ' + tagIn + '</small></div>'
        + '<div class="col-6"><small class="mb-0">TAG OUT: ' + tagOut + '</small></div>'
        + '</div>'
        + '</a>';
    return clistHistory;
}

function newListWeeklyTracking(key, day, fecha, tagIn, tagOut, hours) {
    let clistHistory = '<div id="'+key+'"><a class="list-group-item list-group-item-action text-left linkHistory" data-day="' + fecha + '">'
        + '<div class="d-flex w-100 justify-content-between">'
        + '<h6 class="mb-1"><strong>' + day + ' ' + fecha + '</strong></h6>'
        + '<small class="mb-0">' + hours + ' <i class="fa fa-clock"></i></small>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-6"><small class="mb-0">TAG IN: ' + tagIn + '</small></div>'
        + '<div class="col-6"><small class="mb-0">TAG OUT: ' + tagOut + '</small></div>'
        + '</div>'
        + '</a></div>';
    return clistHistory;
}

function divTagIn() {
    let divTagIn = '<div class="col-12 animated fadeIn"><button class="btn btn-block btn-lg mt-3 btn-success" id="btnTag">TAG IN</button></div>'
    return divTagIn
}

function divTagOut() {
    let divTagOut = '<div class="col-6 animated fadeIn">'
        + '<div class="mt-3 divTimeLogged pl-0 pr-0 mx-auto" id="divTimeIn"><p class="text-primary"><strong><span class="hours">0</span><span>h </span><span class="minutes">0</span><span>m </span><span class="seconds">0</span><span>s </span></strong><i class="fa fa-clock"></i></p></div>'
        + '</div>'
        + '<div class="col-6">'
        + '<button class="btn btn-block btn-lg mt-3 mx-auto btn-danger" id="btnTag">TAG OUT</button>'
        + '</div>';
    //let divTagOut = '<div class="col-12 animated fadeIn"><button class="btn btn-block btn-lg mt-3 btn-danger" id="btnTag">TAG OUT</button></div>'
    //    + '<div class="col-md-12"><div class="mt-1 divTimeLogged" id="divTimeIn"><p><strong>10h 12m 12s</strong></p></div></div>'
    return divTagOut
}







