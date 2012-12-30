(function(window,undefined){

  // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
  function log(){
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) console.log(Array.prototype.slice.call(arguments));
  };

  window.log = window.log || log;

})(window);
