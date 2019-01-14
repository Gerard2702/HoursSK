  // Initialize Firebase
  var date = new Date()
  let fecha = date.toLocaleDateString().replace(new RegExp('/','g'),'-')
  let logUser = ""
  let tagUser = ""
  let urlTagUsers = ""
  //Components
  let cbtnTag = $("#btnTag")

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
     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
       // User successfully signed in.
       // Return type determines whether we continue the redirect automatically
       // or whether we leave that to developer to handle.
       return true;
     },
     uiShown: function() {
       // The widget is rendered.
       // Hide the loader.
       startSignIn()
     }
   },
   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
   signInFlow: 'popup',
   'credentialHelper': firebaseui.auth.CredentialHelper.NONE,
   signInSuccessUrl: '',
   signInOptions: [
     // Leave the lines as is for the providers you want to offer your users.
     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
     firebase.auth.EmailAuthProvider.PROVIDER_ID
   ]
 };

 
 
 var currentUid = null;  
 firebase.auth().onAuthStateChanged(function(user) {  
  if (user && user.uid != currentUid) {    
   currentUid = user.uid;
   logUser = user
   urlTagUsers = '/tags/' + logUser.uid+"/"+fecha
   initHome()
   
  } else {  
   // Sign out operation. Reset the current user UID.  
   currentUid = null;  
   ui.start('#firebaseui-auth-container', uiConfig);
  }  
 }); 

 function initHome(){
   database.ref(urlTagUsers).once('value').then(function(snapshot) {
      var tag = snapshot.val()
      tagUser = tag
      startTagButton()
      startHome()     
    });
 }


 function startHome(){
   $("#divlogin").attr("hidden",true);
   $("#msjWelcome").html("<strong>Welcome " + logUser.displayName+"</strong>")
   
   $("#divContent").removeAttr("hidden")
   $("#divContent").addClass("animated fadeIn")
   
 }

 function startTagButton(){
   if(tagUser.tagStatus == 1){
      cbtnTag.removeClass("btn-danger")
      cbtnTag.addClass("btn-success")
      cbtnTag.html("TAG IN")
   }        
   else
   {
      cbtnTag.removeClass("btn-success")
      cbtnTag.addClass("btn-danger")
      cbtnTag.html("TAG OUT")
   }
 }

 function startSignIn(){
   $("#divContent").attr("hidden",true)
   document.getElementById('loader').style.display = 'none';
   $("#divlogin").removeAttr("hidden");
   $('#divlogin').addClass('animated fadeIn');
 }

 //events 
 $("#logout").click(function(e){
   firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
 })

 cbtnTag.click(function(){
    if(tagUser.tagStatus==1){
      var tagOut = new Date()
      tagUser.tagOut = tagOut.toLocaleTimeString()
      tagUser.tagStatus = 0
      database.ref(urlTagUsers).set(tagUser)
      initHome()
    }else{
      var tagIn = new Date()
      var newtagUser = new tagUserClass(logUser.uid,fecha,tagIn.toLocaleTimeString(),"",1,0)
      database.ref(urlTagUsers).set(newtagUser)
      initHome()
    }
    
 })

 function tagUserClass(uid,date,tagIn,tagOut,tagStatus,timeIn){
    this.uid = uid
    this.date = date
    this.tagIn = tagIn
    this.tagOut = tagOut
    this.tagStatus = tagStatus,
    this.timeIn = timeIn
 }

 

