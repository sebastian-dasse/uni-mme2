/**
 * @author Sebastian Dass&eacute;
 */

"use strict"

window.onload = function() {
    var ctrl = Ctrl(Util);
    ctrl.setup();

    console.log("app loaded %o", document.body);
};


/**
 * the central controller for this app
 */
var Ctrl = function(Util) {

    var DBL_CLICK_DELAY = 250;

    // cache selected elements
    var video = document.getElementById("video_player");
    var progressBar = document.getElementById("progress_bar");
    var progress = document.getElementById("progress_bar_progress");
    var btnPlayPause = document.getElementById("btn_play_pause");
    var btnStop = document.getElementById("btn_stop");
    var btnFullscreen = document.getElementById("btn_fullscreen");
    var textCurrentTime = document.getElementById("text_current_time");
    var filterCtrl = document.getElementById("filter_controls");
    var btnBlur = document.getElementById("btn_blur");
    var btnGrayscale = document.getElementById("btn_grayscale");
    var btnFalsecolor = document.getElementById("btn_falsecolor");
    var btnFilterOff = document.getElementById("btn_filter_off");
    
    var _followTheCursor = function(evt) {
        video.currentTime = video.duration * (evt.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
        updateProgress();
    };

    var _dontFollowTheCursor = function(evt) {
        progressBar.removeEventListener("mousemove", _followTheCursor)
    };

    var _doNothing = function() {};


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
        var progressInPercent = Math.floor(100 * video.currentTime / video.duration);
        progress.style.width = progressInPercent + "%";
        textCurrentTime.innerHTML = new Date(video.currentTime * 1000).toUTCString().split(" ")[4];
        if (video.currentTime === video.duration) {
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
        var actionForKey = {
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
            39: function() { video.currentTime += 1; }, // RIGHT_ARROW
            86: function() { console.log(video); } // v
        };
        var execute = actionForKey[evt.keyCode] || _doNothing;
        execute();
    };

    var applyFilter = function(filterName) {
        return function() { video.className = (filterName === "off") ? "" : filterName; }
    };

    
    /**
     * set up all event listeners
     */
    var setup = function() {
        video.addEventListener("timeupdate", updateProgress);
        progressBar.addEventListener("mousedown", progressCtrl);
        
        btnPlayPause.addEventListener("click", togglePlayPause);
        btnStop.addEventListener("click", stop);
        btnFullscreen.addEventListener("click", toggleFullscreen);

        var dblClicked = false;
        video.addEventListener("click", function() { setTimeout(function() { !dblClicked && togglePlayPause(); }, DBL_CLICK_DELAY) });
        video.addEventListener("dblclick", function() {
            dblClicked = true;
            toggleFullscreen();
            setTimeout(function() { dblClicked = false; }, DBL_CLICK_DELAY);
        });

        document.addEventListener("keydown", keyListener);
        document.addEventListener("click", function() { document.activeElement.blur(); }); // to allow keyboard control with SPACE and ENTER
        
        btnBlur.addEventListener("click", applyFilter("blur"));
        btnFalsecolor.addEventListener("click", applyFilter("falsecolor"));
        btnGrayscale.addEventListener("click", applyFilter("grayscale"));
        btnFilterOff.addEventListener("click", applyFilter("off"));

        updateProgress();

        filterCtrl.addEventListener("click", Util.onClickMarkButtonAsSelected(filterCtrl.children));
        btnFilterOff.disabled = true;

        console.log("controller set up")
    }

    return {
        setup: setup
    };
};


/**
 * utility functions for this app
 */
var Util = (function() {
    var u = {};
    u.onClickMarkButtonAsSelected = function(btns) {
        return function(evt) {
            for (var i = 0; i < btns.length; i++) {
                // console.log("btn %d = %o", i, btns[i]);
                btns[i].disabled = (btns[i] === evt.target) ? true : false;
            }
        };
    };
    return u;
}());
