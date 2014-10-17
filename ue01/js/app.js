/**
 * @author Sebastian Dass&eacute;
 */

"use strict"

window.onload = function() {
    
    // cache selected elements
    var player = document.getElementById("video_player");
    var progressBarContainer = document.getElementById("progress_bar_container");
    var progress = document.getElementById("progress");
    var btnPlayPause = document.getElementById("btn_play_pause");
    var btnStop = document.getElementById("btn_stop");
    var btnFullscreen = document.getElementById("btn_fullscreen");
    var textCurrentTime = document.getElementById("text_current_time");
    
    // setup controller
    var ctrl = Ctrl(player, btnPlayPause, progressBarContainer, progress, textCurrentTime);

    // add listeners
    player.addEventListener("timeupdate", ctrl.updateProgress);
    progressBarContainer.addEventListener("mousedown", ctrl.progressCtrl);
    btnPlayPause.addEventListener("click", ctrl.togglePlayPause);
    btnStop.addEventListener("click", ctrl.stop);
    btnFullscreen.addEventListener("click", ctrl.toggleFullscreen);
    document.addEventListener("keydown", ctrl.keyListener);
    document.addEventListener("click", function() { document.activeElement.blur(); }); // to allow keyboard control with SPACE and ENTER
    
    ctrl.updateProgress();

    console.log("app loaded %o", document.body);
};


var Ctrl = function(player, btnPlayPause, progressBarContainer, progress, textCurrentTime) {
    
    var _playerDuration = player.duration;
    var _progressBarWidth = progressBarContainer.offsetWidth;
    var _progressBarOffsetLeft = progressBarContainer.offsetLeft;

    
    var _followTheCursor = function(evt) {
        player.currentTime = _playerDuration * (evt.pageX - _progressBarOffsetLeft) / _progressBarWidth;
        updateProgress();
    };

    var _dontFollowTheCursor = function(evt) {
        progressBarContainer.removeEventListener("mousemove", _followTheCursor)
    };


    var togglePlayPause = function() {
        if (player.paused) {
            player.play();
            btnPlayPause.textContent = "Pause";
        } else {
            player.pause()
            btnPlayPause.textContent = "Play";
        }
    };

    var stop = function() {
        player.pause();
        player.currentTime = 0;
        btnPlayPause.textContent = "Play";
    };

    var updateProgress = function() {
        var progressInPercent = Math.floor(100 * player.currentTime / _playerDuration);
        progress.style.width = progressInPercent + "%";
        textCurrentTime.innerHTML = new Date(player.currentTime * 1000).toUTCString().split(" ")[4];
        if (player.currentTime === _playerDuration) {
            btnPlayPause.textContent = "Play";
        }
    };

    var progressCtrl = function(evt) {
        _followTheCursor(evt);
        progressBarContainer.addEventListener("mousemove", _followTheCursor);
        progressBarContainer.addEventListener("mouseup", _dontFollowTheCursor);
        document.addEventListener("mouseup", _dontFollowTheCursor);
    };

    var toggleFullscreen = function() {
        if (player.requestFullScreen) {
            !document.fullScreen ? player.requestFullScreen() : document.exitFullScreen();
        } else if (player.mozRequestFullScreen) {
            !document.mozFullScreen ? player.mozRequestFullScreen() : document.mozCancelFullScreen();
        } else if (player.webkitRequestFullScreen) {
            !document.webkitIsFullScreen ? player.webkitRequestFullScreen() : document.webkitCancelFullScreen();
        } else {
            console.log("Your browser does not support full screen mode.");
        }
    };

    var keyListener = function(evt) {
        var doNothing = function() {
            // console.debug("The key with key code '" + keyCode + "'' is not mapped to a function.");
        };
        var executekeyActionForKey = {
            8:  stop, // BACKSPACE
            13: function() { // ENTER
                    var wasStoppedAlready = player.currentTime < 0.1;
                    stop();
                    if (wasStoppedAlready) {
                        togglePlayPause();
                    }
                }, 
            32: togglePlayPause, // SPACE
            37: function() { player.currentTime -= 1; }, // LEFT_ARROW
            39: function() { player.currentTime += 1; } // RIGHT_ARROW
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
