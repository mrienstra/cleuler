/*

http://www.psy.ritsumei.ac.jp/~akitaoka/opart7e.html
  "Blue-ray discs"

http://www.psy.ritsumei.ac.jp/~akitaoka/opart4e.html
  "Hamaya", x: 333, y: 50, a: 400, b: 100, pattern: circular
  "Secret base", x: 505, y: 1, a: 400, b: 100, pattern: circular
  "The last day of the earth", x: 100, y: 250, a: 450, b: 150, pattern: circular
  "The last day of the earth", x: 500, y: 100, a: 465, b: 150, pattern: circular

http://www.psy.ritsumei.ac.jp/~akitaoka/opart3e.html
  "Cosmic rays and aurorae", x: 300, y: 10, a: 275, b: 100, pattern: circular
  "Roll of tubes", x: 111111111111111, y: 10, a: 400, b: 100, pattern: circular
  "Mirror ball", x: 200, y: 100

http://www.psy.ritsumei.ac.jp/~akitaoka/opart2-e.html
  "Sea urchins", x: 8, y: 8; x: 11, y: 11
  "Dizziness", x: 6, y: -6

http://www.psy.ritsumei.ac.jp/~akitaoka/cataloge.html
  "Helmholtz's angle expansion" x: 359, y: 263, pattern: circular
  "Vasarely illusion" x: 150 y: 150

*/

(function(){
  var namespace = 'translateBox',
      x = 0,
      y = 0,
      a = 0,
      b = 0,
      xDelta = 0,
      yDelta = 0,
      startTime = 0,
      maxLoadAttempts = 180,
      jQueryLoadAttempts = 0,
      lastKey = null,
      numDir = null,
      pattern = null,
      fpsFrameCount = 0,
      fpsStartTime = 0,
      fps = 0,

  loadJquery = function (success) {
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js';
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);

    var checkjQueryLoaded = setInterval(function(){
      if (!!window.$.fn) {
        $ = window.$;
        window.clearInterval(checkjQueryLoaded);
        success();
      } else if(maxLoadAttempts < jQueryLoadAttempts) {
          alert('jQuery load failed');
          window.clearInterval(checkjQueryLoaded);
      }
      jQueryLoadAttempts++;
    }, 333);
  },

  moveBackground = function(){
    var t;

    if ($('#' + namespace + ':visible').length === 0) return;

    if (pattern === 'circular') {
      t = (Date.now() - startTime) * Math.PI / (60 * 60 * 60);
      x = yDelta * Math.sin(t * xDelta) + a;
      y = yDelta * Math.cos(t * xDelta) + b;
      console.log(xDelta, yDelta, t, x, y);
    } else if (pattern === 'lurch') {
      t = (Date.now() - startTime) * Math.PI / (60 * 60 * 60);
      x += xDelta + Math.sin(t) * a;
      y += yDelta + Math.cos(t) * b;
      console.log(xDelta, yDelta, t, x, y);
    } else {
      x += xDelta;
      y += yDelta;
    }

    $('#' + namespace).css({
      'background-position-x': x,
      'background-position-y': y
    });

    fpsFrameCount++;

    webkitRequestAnimationFrame(moveBackground);
  },

  sizeOverlay = function(){
    var bottomRightOffset = $('#' + namespace + 'BottomRight').offset();

    $('#' + namespace).css({
      width: bottomRightOffset.left,
      height: bottomRightOffset.top
    });
  },

  trackFps = function(cancel){
    if (cancel) {
      clearInterval(fpsIntervalId);
      hideInfo();
    } else {
      fpsIntervalId = window.setInterval(function(){
        var now = Date.now(),
            timeElapsed = now - fpsStartTime;
        if (timeElapsed < 1000) {
          hideInfo();
          return;
        }
        fps = Math.round(fpsFrameCount * 100000 / timeElapsed) / 100;
        fpsStartTime = now;
        fpsFrameCount = 0;
        
        updateInfo();
      }, 5000);
    }
  },

  updateInfo = function(){
    var $info = $('#' + namespace + 'BottomRight').children(),
        info;
    if ($info.length) {
      info = 'x: ' + xDelta + ', y: ' + yDelta;
      if (fps) {
        info += ', fps: ' + fps;
      }
      if (pattern) {
        info += ', a: ' + a + ', b: ' + b + ', pattern: ' + pattern;
      }
      info = info.replace(/ /g, '&nbsp;');
      $info.html(info).show();
    }
  },

  hideInfo = function(){
    $info = $('#' + namespace + 'BottomRight').children().hide().text('');
  },


  attachHandlers = function(){
    $(document).on('click', '#' + namespace, function(){
      $(this).hide();
      trackFps(true);
    });

    $('body').keydown(function(event) {
      var preventDefault = true,
          resetNumDir = true,
          num;

      if ($('#' + namespace + ':visible').length === 0) return;

      if (event.which === 37) {        // left arrow
        xDelta -= 1;
      } else if (event.which === 38) { // up arrow
        yDelta -= 1;
      } else if (event.which === 39) { // right arrow
        xDelta += 1;
      } else if (event.which === 40) { // down arrow
        yDelta += 1;
      } else if (event.which === 88) { // "x"
        resetNumDir = false;
        numDir = 'x';
      } else if (event.which === 89) { // "y"
        resetNumDir = false;
        numDir = 'y';
      } else if (event.which === 65) { // "a"
        resetNumDir = false;
        numDir = 'a';
      } else if (event.which === 66) { // "b"
        resetNumDir = false;
        numDir = 'b';
      } else if (event.which === 67) { // "c"
        if (pattern === 'circular') {
          pattern = null;
        } else {
          pattern = 'circular';
        }
      } else if (event.which === 76) { // "l"
        if (pattern === 'lurch') {
          pattern = null;
        } else {
          pattern = 'lurch';
        }
      } else if (event.which > 47 && event.which < 58) { // 0-9
        resetNumDir = false;
        num = event.which - 48;
        if (lastKey === 88) { // "x"
          xDelta = num;
        } else if (lastKey === 89) { // "y"
          yDelta = num;
        } else if (lastKey === 65) { // "a"
          a = num;
        } else if (lastKey === 66) { // "b"
          b = num;
        } else if (numDir === 'x') {
          xDelta = parseInt(xDelta + '' + num);
        } else if (numDir === 'y') {
          yDelta = parseInt(yDelta + '' + num);
        } else if (numDir === 'a') {
          a = parseInt(a + '' + num);
        } else if (numDir === 'b') {
          b = parseInt(b + '' + num);
        }
      } else {
        preventDefault = false;
      }

      console.log('event.which, xDelta, yDelta, lastKey, num', event.which, xDelta, yDelta, lastKey, num);

      lastKey = event.which;

      if (resetNumDir) {
        numDir = null;
      }

      updateInfo();

      if (preventDefault) {
        event.preventDefault();
      }
    });

    $('body').append('<div id="' + namespace + '" />');
    $('#' + namespace)
      .hide()
      .css({
        position: 'fixed',
        left: 0,
        top: 0
      });

    $('body').append('<div id="' + namespace + 'BottomRight" />');
    $('#' + namespace + 'BottomRight')
      .css({
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        position: 'fixed'
      })
      .append('<div />')
      .children()
      .css({
        padding: '0.33em',
        'text-shadow': '#fff 0 0 5px, #fff 0 0 7px, #fff 0 0 9px, #fff 0 0 11px',
        position: 'absolute',
        bottom: 0,
        right: 0,
        float: 'right'
      });
    hideInfo();

    sizeOverlay();

    $('img').on('click', function(event){
      event.preventDefault();

      sizeOverlay();

      x = y = 0;
      xDelta = yDelta = 1;
      a = b = 0;
      pattern = null;
      startTime = Date.now();

      $('#' + namespace)
        .show()
        .css({
          background: 'url(' + $(this).attr('src') + ') repeat',
          left: 0,
          top: 0
        });

      webkitRequestAnimationFrame(moveBackground);

      trackFps();
    });
  };

  loadJquery(attachHandlers);

})();