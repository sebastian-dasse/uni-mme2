/**
 * @author Sebastian Dass&eacute;
 */

"use strict"

window.onload = function() {
    
    // cache selected elements
    var video = document.getElementById("video_player");
    var progressBar = document.getElementById("progress_bar");
    var progress = document.getElementById("progress_bar_progress");
    var btnPlayPause = document.getElementById("btn_play_pause");
    var btnStop = document.getElementById("btn_stop");
    var btnFullscreen = document.getElementById("btn_fullscreen");
    var textCurrentTime = document.getElementById("text_current_time");
    
    // setup controller
    var ctrl = Ctrl(video, btnPlayPause, progressBar, progress, textCurrentTime);

    // setup the canvas for the filtered video
    setupCanvas(video);
    // console.log("crossOrigin = '" + video.crossOrigin + "'");
    console.log("... = '%o'", video);

    // add listeners
    video.addEventListener("timeupdate", ctrl.updateProgress);
    progressBar.addEventListener("mousedown", ctrl.progressCtrl);
    btnPlayPause.addEventListener("click", ctrl.togglePlayPause);
    btnStop.addEventListener("click", ctrl.stop);
    btnFullscreen.addEventListener("click", ctrl.toggleFullscreen);

    var dblClicked = false;
    var DBL_CLICK_DELAY = 250;
    video.addEventListener("click", function() { setTimeout(function() { !dblClicked && ctrl.togglePlayPause(); }, DBL_CLICK_DELAY) });
    video.addEventListener("dblclick", function() {
        dblClicked = true;
        ctrl.toggleFullscreen();
        setTimeout(function() { dblClicked = false; }, DBL_CLICK_DELAY);
    });

    document.addEventListener("keydown", ctrl.keyListener);
    document.addEventListener("click", function() { document.activeElement.blur(); }); // to allow keyboard control with SPACE and ENTER
    

    ctrl.updateProgress();

    console.log("app loaded %o", document.body);
};


var Ctrl = function(video, btnPlayPause, progressBar, progress, textCurrentTime) {
    
    var _videoDuration = video.duration;
    var _progressBarWidth = progressBar.offsetWidth;
    var _progressBarOffsetLeft = progressBar.offsetLeft;

    
    var _followTheCursor = function(evt) {
        video.currentTime = _videoDuration * (evt.pageX - _progressBarOffsetLeft) / _progressBarWidth;
        updateProgress();
    };

    var _dontFollowTheCursor = function(evt) {
        progressBar.removeEventListener("mousemove", _followTheCursor)
    };


    var togglePlayPause = function() {
        if (video.paused) {
            video.play();
            btnPlayPause.textContent = "Pause";
        } else {
            video.pause()
            btnPlayPause.textContent = "Play";
        }
    };

    var stop = function() {
        video.pause();
        video.currentTime = 0;
        btnPlayPause.textContent = "Play";
    };

    var updateProgress = function() {
        var progressInPercent = Math.floor(100 * video.currentTime / _videoDuration);
        progress.style.width = progressInPercent + "%";
        textCurrentTime.innerHTML = new Date(video.currentTime * 1000).toUTCString().split(" ")[4];
        if (video.currentTime === _videoDuration) {
            btnPlayPause.textContent = "Play";
        }
    };

    var progressCtrl = function(evt) {
        _followTheCursor(evt);
        progressBar.addEventListener("mousemove", _followTheCursor);
        progressBar.addEventListener("mouseup", _dontFollowTheCursor);
        document.addEventListener("mouseup", _dontFollowTheCursor);
    };

    var toggleFullscreen = function() {
        if (video.requestFullScreen) {
            !document.fullScreen ? video.requestFullScreen() : document.exitFullScreen();
        } else if (video.mozRequestFullScreen) {
            !document.mozFullScreen ? video.mozRequestFullScreen() : document.mozCancelFullScreen();
        } else if (video.webkitRequestFullScreen) {
            !document.webkitIsFullScreen ? video.webkitRequestFullScreen() : document.webkitCancelFullScreen();
        } else {
            console.log("Your browser does not support full screen mode.");
        }
    };

    var keyListener = function(evt) {
        var doNothing = function() {
            // console.log("The key with key code '" + keyCode + "'' is not mapped to a function.");
        };
        var executekeyActionForKey = {
            8:  stop, // BACKSPACE
            13: function() { // ENTER
                    var wasStoppedAlready = video.currentTime < 0.1;
                    stop();
                    if (wasStoppedAlready) {
                        togglePlayPause();
                    }
                }, 
            32: togglePlayPause, // SPACE
            37: function() { video.currentTime -= 1; }, // LEFT_ARROW
            39: function() { video.currentTime += 1; } // RIGHT_ARROW
        };
        (executekeyActionForKey[evt.keyCode] || doNothing)();
    };

    return {
        togglePlayPause: togglePlayPause, 
        stop: stop, 
        updateProgress: updateProgress, 
        progressCtrl: progressCtrl, 
        toggleFullscreen: toggleFullscreen, 
        keyListener: keyListener
    }
};

var setupCanvas = function(video) {
    var canvas = document.getElementById("video_canvas");

    // canvas.toDataURL();
    // video.crossOrigin = "anonymous";

    var canvas2DContext = canvas.getContext("2d");

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    // console.log(canvas);
    // console.log(canvas2DContext);
    
    var filter = myFirstFilter; // TODO make filter settable via button

    video.addEventListener("timeupdate", function() {
        // paintCanvas(video, canvas, canvas2DContext, filter);
        setInterval(function() { applyFilter(video, canvas, canvas2DContext, filter); }, 20);
    });
    
    canvas2DContext.drawImage(video, 0, 0);
    applyFilter(video, canvas, canvas2DContext, filter);
};

// var paintCanvas = function(video, canvas, canvas2DContext, filter) {
//     // if (video.paused || video.ended) {
//     //     return false;
//     // }
//     // canvas2DContext.drawImage(video, 0, 0);
//     setInterval(function() { applyFilter(video, canvas, canvas2DContext, filter); }, 20);
// };

var applyFilter = function(video, canvas, canvas2DContext, filter) {
    canvas2DContext.drawImage(video, 0, 0);
    var imageData;
    try {
        imageData = canvas2DContext.getImageData(0, 0, canvas.width, canvas.height);
        filter && filter(imageData);
        canvas2DContext.putImageData(imageData, 0, 0);
    } catch (e) {
        // console.warn("caught: " + e);
    }
    // if (filter && imageData) {
    //     filter(imageData);
    //     canvas2DContext.putImageData(imageData, 0, 0);
    // }
};

var myFirstFilter = function(imageData) {
    var len = imageData.data.length;
    for (var i = 0; i < len; i += 4) {
        imageData.data[i] = 255 - imageData.data[i];
        imageData.data[i+1] = 255 - imageData.data[i+1];
        imageData.data[i+3] = imageData.data[i+3] - 100;
    }
}
