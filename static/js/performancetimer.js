(function(global){

  //PUBLIC
  global.$startTimer = startTimer;
  global.$stopTimer = stopTimer;

  //PRIVATE
  var timer = 0;
  var testcmd = "";
  //IMPLEMENTATION
  startTimer("latency");

  function startTimer(test){
    timer = performance.now()
    testcmd = test;
  }


  function stopTimer(){
    timer = performance.now()-timer;
    console.log("Timer : " + testcmd + " : " + timer);
  }

})(window);
