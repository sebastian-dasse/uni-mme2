/**
 * @author Sebastian Dass&eacute;
 */

// TODO cache selected elements

window.onload = function (argument) {
    var btnPlayPause = document.getElementById("btn_play_pause")
    var btnStop = document.getElementById("btn_stop");
    var player = document.getElementById("video_player");
    var btnFullscreen = document.getElementById("btn_fullscreen");
    var progressBar = document.getElementById("progress_bar_container");
    var progress = document.getElementById("progress");
    var textCurrentTime = document.getElementById("text_current_time");
    // defaultProgressBar.getElementById("default_progress_bar");
    
    
    btnPlayPause.addEventListener("click", togglePlayPause(player, btnPlayPause));
    btnStop.addEventListener("click", stop(player, btnPlayPause));
    player.addEventListener("timeupdate", updateProgress(player, progress, textCurrentTime));
    btnFullscreen.addEventListener("click", toggleFullscreen);
    progressBar.addEventListener("mousedown", progressCtrl);
    // var defaultProgressBar.addEventListener("click", progressCtrl);

    updateProgress(player, progress, textCurrentTime)();
    console.log("app loaded");
};

var togglePlayPause = function(player, btnPlayPause) {
    return function() {
        if (player.paused) {
            player.play();
            btnPlayPause.textContent = "Pause";
            console.log("video playing");
        } else {
            player.pause()
            btnPlayPause.textContent = "Play";
            console.log("video paused");
        }
    };
};

var stop = function(player, btnPlayPause) {
    return function() {
        player.pause();
        player.currentTime = 0;
        btnPlayPause.textContent = "Play";
        console.log("video stopped");
    };
};

var updateProgress = function(player, progress, textCurrentTime) {
    return function() {
        var progressInPercent = Math.floor(100 * player.currentTime / player.duration);
        /*var defaultProgressBar = document.getElementById("default_progress_bar");
        defaultProgressBar.value = progressInPercent;
        defaultProgressBar.getElementsByTagName("span")[0].innerHTML = Math.floor(progressInPercent);*/
        progress.style.width = progressInPercent + "%";
        textCurrentTime.innerHTML = new Date(player.currentTime * 1000).toUTCString().split(" ")[4];
        if (player.currentTime === player.duration) {
            var btn = document.getElementById("btn_play_pause");
            btn.textContent = "Play";
        }
    };
};

var progressCtrl = function(evt) {
    progressCtrl2(evt);
    var progressbar = document.getElementById("progress_bar_container");
    progressbar.addEventListener("mousemove", progressCtrl2);
    progressbar.addEventListener("mouseup", function() {
        progressbar.removeEventListener("mousemove", progressCtrl2)
    });
};

var progressCtrl2 = function(evt) {
    var el = document.getElementById("progress_bar_container")
    var width = el.offsetWidth;
    var offset = el.offsetLeft;
    var relativeX = evt.pageX - offset;
    var normalizedX = relativeX / width;

    var player = document.getElementById("video_player");
    player.currentTime = normalizedX * player.duration;
    updateProgress();
};

var toggleFullscreen = function() {
    console.warn("toggleFullscreen not implemented yet")
};
