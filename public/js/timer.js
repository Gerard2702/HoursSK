function comprobarHora(){
   var fecha = new Date();
   $("#dateNow").html(fecha.toLocaleTimeString())
   var starValue = (fecha.getHours()*3600) + (fecha.getMinutes()*60) + fecha.getSeconds()
   var timer = new Timer();
   
   timer.start({
      startValues: {seconds: starValue}
   });

   timer.addEventListener('secondsUpdated', function (e) {
      $('#dateNow').html(timer.getTimeValues().toString());
   });
   var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   $("#dayNow").html(days[fecha.getDay()])
 }

 comprobarHora();