/**
 * the svg path animation
 * Created by candice on 16/6/15.
 */
;
(function (window, document, undefined) {
    'use strict';

    // Constants
    var NAME = 'svgPathAnimation';

    function SVGEl(el) {
        this.el = el;
        this.doc = el.getSVGDocument();
        this.current_frame = 0;
        this.total_frames = 60;
        this.path = new Array();
        this.length = new Array();
        this.handle = 0;
        this.init();
    }

    SVGEl.prototype.init = function () {
        var self = this;
        [].slice.call(this.doc.querySelectorAll('path')).forEach(function (path, i) {
            self.path[i] = path;
            var l = self.path[i].getTotalLength();
            self.length[i] = l;
            self.path[i].style.strokeDasharray = l + ' ' + l;
            self.path[i].style.strokeDashoffset = l;
        });

    };
    SVGEl.prototype.render = function () {
        if (this.rendered) {
            return;
        }
        this.rendered = true;
        var self = this;
        if (this.el.attributes['class'] && this.el.attributes['class'].value.indexOf('later') >= 0) {
            setTimeout(function () {
                self.el.style.visibility = "visible";
                self.draw(function () {
                    //绘制完成后播放视频
                    startVideo();
                });
            }, 500); //滞后绘制时间

        } else {
            this.draw();
        }


    };
    SVGEl.prototype.draw = function (endCallback) {
        var self = this,
            progress = this.current_frame / this.total_frames;

        if (progress > 1) {
            if (endCallback != null && typeof endCallback == "function") {
                endCallback();
            }
            window.cancelAnimFrame(self.handle);
        } else {
            this.current_frame++;
            for (var j = 0, len = this.path.length; j < len; j++) {
                this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
            }
            this.handle = window.requestAnimFrame(function () {
                self.draw(endCallback);
            });
        }
    };

    function VideoEl(el) {
        this.el = el;
        this.controlEl = document.querySelectorAll('.video-control')[0];
        this.loadingEl = this.controlEl.querySelectorAll('.loading')[0];
        this.replayEl = this.controlEl.querySelectorAll('.replay')[0];
        this.canPlayState = false;
        this.endedPlayState = false;
        this.autoPlayState = false;
    }


    VideoEl.prototype.init = function () {
        var self = this;
        if (!isFirefox) {
            this.el.addEventListener('canplay', function () {
                console.log('canplay');
                self.canPlayState = true;
                self.play();
            });
            this.el.addEventListener('ended', function () {
                self.endedPlayState = true;
                self.replayEl.style.display = 'block';
            });
            this.replayEl.addEventListener('click', function () {
                self.replay();
            }, true);
        }

    };

    /**
     * 首次播放
     */
    VideoEl.prototype.play = function () {
        if (this.canPlayState && this.autoPlayState) {
            this.autoPlayState = false;
            this.loadingEl.style.display = 'none';
            console.log('video play');
            this.el.play();
        }

    };
    /**
     * 重复播放
     */
    VideoEl.prototype.replay = function () {
        if (this.endedPlayState) {
            this.endedPlayState = false;
            this.replayEl.style.display = 'none';
            this.el.play();
        }
    };
    /**
     * 开始播放
     */
    VideoEl.prototype.startPlay = function () {
        var self = this;
        if (isFirefox) {
            this.el.setAttribute('autoplay', 'autoplay');
            this.el.setAttribute('loop', 'loop');
            //this.el.load();
        } else {

            if (this.canPlayState) {
                this.autoPlayState = true;
                this.play();
            } else {
                this.loadingEl.style.display = 'block';
                setTimeout(function(){
                    self.autoPlayState = true;
                    self.play();
                },1000);//load隐藏延迟

            }
        }
    };

    window.requestAnimFrame = function () {
        return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback) {
            window.setTimeout(callback, 1000 / 60);
        }
        );
    }();

    window.cancelAnimFrame = function () {
        return (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        }
        );
    }();

    /**
     * 动画开始
     */
    function begin() {
        var pathAnimationEl = document.getElementById('pathAnimation');
        pathAnimationEl.style.visibility = "visible";
        parallax();
        var svgs = pathAnimationEl.querySelectorAll('object.svg');
        for (var i = 0; i < svgs.length; i++) {
            if (svgs[i].getSVGDocument()) {
                var svg = new SVGEl(svgs[i]);
                svg.render();
            } else {
                svgs[i].addEventListener('load', function () {
                    var svg = new SVGEl(this);
                    svg.render();
                });
            }
        }

    }

    function parallax() {
        var pathAnimationEl = document.getElementById('pathAnimation');
        var scenes = pathAnimationEl.querySelectorAll('.scene');
        for (var i = 0; i < scenes.length; i++) {
            var parallax = new Parallax(scenes[i]);
        }
    }

    /**
     * 视频初始化并播放
     */
    function startVideo() {
        var control = document.querySelectorAll('.video-control')[0];
        var parent = control.parentElement;
        var html = '<source src="video/video.mp4" type="video/mp4">' +
            '<source src="video/video.webm" type="video/webm">' +
            '<source src="video/video.ogg" type="video/ogg">' +
            '<source src="video/video.mov" type="video/mov">' +
            'Your browser does not support HTML5 video.';
        var video = document.createElement('video');
        video.setAttribute('class','video-mp4');
        video.setAttribute('preload','preload');
        video.innerHTML = html;
        parent.insertBefore(video,control);
        var videoEl = new VideoEl(video);
        videoEl.init();
        videoEl.startPlay();
    }


    // Expose svgPathAnimation.begin
    var isFirefox = navigator.userAgent.toUpperCase().indexOf("FIREFOX") > -1 ? true : false;
    window[NAME] = {};
    window[NAME]['begin'] = begin;
})(window, document);

