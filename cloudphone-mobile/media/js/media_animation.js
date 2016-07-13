/**
 * Created by candice on 16/6/27.
 */

;
(function (window, document, undefined) {
    'use strict';

    // Constants
    var NAME = 'MediaAnimation';
    var DEFAULTS = {
        fontSizeDefault: 16,
        widthDefault: 360
    };

    function MediaAnimation(element, options) {
        this.element = element;
        // Data Extraction
        var data = {};
        // Delete Null Data Values
        for (var key in data) {
            if (data[key] === null) delete data[key];
        }


        // Compose Settings Object
        this.extend(this, DEFAULTS, options, data);

        // States
        this.enabled = false;
        this.isPortrait = this.getScreenOrientation(); //是否竖屏


        // Cache Elements
        this.svgEls = [];
        this.videoEl = null;


        // Callbacks
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
        // Initialise
        this.initialise();

    }

    MediaAnimation.prototype.extend = function () {
        if (arguments.length > 1) {
            var master = arguments[0];
            for (var i = 1, l = arguments.length; i < l; i++) {
                var object = arguments[i];
                for (var key in object) {
                    master[key] = object[key];
                }
            }
        }
    };

    MediaAnimation.prototype.data = function (element, name) {
        return this.deserialize(element.getAttribute('data-' + name));
    };
    MediaAnimation.prototype.deserialize = function (value) {
        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        } else if (value === 'null') {
            return null;
        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return parseFloat(value);
        } else {
            return value;
        }
    };

    MediaAnimation.prototype.initialise = function () {
        //set up
        //this.scale();

        this.updateDrawSVG();
        this.updateVideo();
        this.enable();
    };

    /**
     * TODO
     */
    MediaAnimation.prototype.disable = function () {


    };

    /**
     * 基于字体大小缩放
     */
    MediaAnimation.prototype.scale = function () {
        //return; //TODO
        var fontSize;
        fontSize = window.innerWidth * this.fontSizeDefault / this.widthDefault;
        this.element.style.fontSize = fontSize + 'px';
    };

    MediaAnimation.prototype.setScale = function(width){
        var fontSize;
        fontSize = width * this.fontSizeDefault / this.widthDefault;
        this.element.style.fontSize = fontSize + 'px';
    };

    MediaAnimation.prototype.updateDrawSVG = function () {
        // Cache SVG Elements
        var svgs = this.element.querySelectorAll('object.svg');
        this.svgEls = [];
        for (var i = 0, l = svgs.length; i < l; i++) {
            var svgEl = new SVGEl(svgs[i], {fontSizeDefault: this.fontSizeDefault, widthDefault: this.widthDefault});
            if (svgEl.element.getSVGDocument()) {
                svgEl.loaded = true;
            }
            svgEl.delay = this.data(svgEl.element, 'draw-delay' || 0);
            this.svgEls.push(svgEl);
        }
    };


    MediaAnimation.prototype.updateVideo = function () {
        var videoContainer = this.element.getElementsByClassName('video-container')[0];
        this.videoEl = new VideoEl(videoContainer);
    };


    MediaAnimation.prototype.parallax = function () {
        var scenes = this.element.getElementsByClassName('scene');
        for (var i = 0; i < scenes.length; i++) {
            var parallax = new Parallax(scenes[i]);
        }
    };

    MediaAnimation.prototype.updateSVGContent = function () {
        this.svgEls.forEach(function (item, i) {
            item.update();

        });
    };
    MediaAnimation.prototype.onDeviceOrientation = function () {
        if (this.isPortrait === this.getScreenOrientation()) {
            return;
        }
        this.isPortrait = this.getScreenOrientation();
        this.scale();
        //非Safari重新load
        if (!browserInfo.isSafari) {
            location.reload(false);
        }

    };


    /**
     * SVG绘制动画
     */
    MediaAnimation.prototype.drawSVG = function () {
        this.element.style.visibility = "visible"; //显示组件
        var self = this;
        this.svgEls.forEach(function (item, i) {
            if (i == self.svgEls.length - 1) {
                var onDrawn = item.onDrawn;
                item.onDrawn = function () {
                    onDrawn();
                    self.startVideo();
                }
            }
            item.render();
        });


    };


    MediaAnimation.prototype.startVideo = function () {
        this.videoEl.startVideo();
    };


    MediaAnimation.prototype.enable = function () {
        if (!this.enabled) {
            this.enabled = false;
            //parallax
            this.parallax();

            //SVG draw
            var loadCount = 0;
            var l = this.svgEls.length;
            var self = this;
            this.svgEls.forEach(function (item, i) {
                var svg = item.element;
                if (item.loaded) {
                    loadCount++;
                    if (loadCount == l) {
                        self.updateSVGContent();
                        self.drawSVG();
                    }
                } else {
                    svg.addEventListener('load', function () {
                        loadCount++;
                        if (loadCount == l) {
                            self.updateSVGContent();
                            self.drawSVG();
                        }
                    });
                }

            });
            //window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.onDeviceOrientation);

        }

    };

    MediaAnimation.prototype.getScreenOrientation = function () {
        if (window.orientation === 180 || window.orientation === 0) {
            return true;
        }
        if (window.orientation === 90 || window.orientation === -90) {
            return false;
        }
    };
    MediaAnimation.prototype.getStyle = function (element, property) {
        return (element.currentStyle ? element.currentStyle : window.getComputedStyle(element, null))[property];
    };
    MediaAnimation.prototype.hasClass = function (element, className) {
        var classList = element.classList;
        for (var i = 0, l = classList.length; i < l; i++) {
            if (classList[i] == className) {
                return true;
            }
        }
        return false;
    };


    /**
     * SVG模块
     * @param el
     * @constructor
     */
    function SVGEl(el, options) {
        this.element = el;
        this.doc = null;
        this.current_frame = 0;
        this.total_frames = 60;
        this.delay = 0;
        this.path = new Array();
        this.length = new Array();
        this.handle = 0;
        MediaAnimation.prototype.extend(this, options);
        this.initialise();
    }

    SVGEl.prototype.initialise = function () {

    };
    SVGEl.prototype.update = function () {
        this.doc = this.element.getSVGDocument();

        //SVG需要按比例缩小到0.75(phone除外)，且使用em单位，响应fontSize缩放方案
        if (!MediaAnimation.prototype.hasClass(this.element, 'phone')) {
            this.element.style.width = "";
            this.element.style.height = "";
            this.width = parseFloat(MediaAnimation.prototype.getStyle(this.element, 'width')) * 0.75;
            this.height = parseFloat(MediaAnimation.prototype.getStyle(this.element, 'height')) * 0.75;
            this.element.style.width = this.width / this.fontSizeDefault + 'em';
            this.element.style.height = this.height / this.fontSizeDefault + 'em';
        }

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
        var self = this;
        if (this.delay > 0) {
            setTimeout(function () {
                self.draw();
            }, this.delay); //滞后绘制时间

        } else {
            this.draw();
        }
    };
    SVGEl.prototype.draw = function () {
        var self = this,
            progress = this.current_frame / this.total_frames;
        if (this.current_frame == 0) {
            this.element.style.visibility = 'visible';
        }

        if (progress > 1) {
            this.onDrawn();
            window.cancelAnimFrame(self.handle);
        } else {
            this.current_frame++;
            for (var j = 0, len = this.path.length; j < len; j++) {
                this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
            }
            this.handle = window.requestAnimFrame(function () {
                self.draw();
            });
        }
    };

    SVGEl.prototype.onDrawn = function () {

    };

    /**
     * 视频模块
     * @param element
     * @constructor
     */
    function VideoEl(element) {
        this.element = element;
        this.video = null;
        this.videoStarted = false;
        this.screen = element.getElementsByClassName('screen')[0];
        this.controlEl = element.getElementsByClassName('video-control')[0];
        this.loadingEl = this.controlEl.getElementsByClassName('loading')[0];
        this.replayEl = this.controlEl.getElementsByClassName('replay')[0];

        //STATE
        this.clickPlayState = false;
        this.realStartState = false;

        this.init();
    }


    VideoEl.prototype.init = function () {
        this.clickPlay = this.clickPlay.bind(this);
        this.timeUpdate = this.timeUpdate.bind(this);
        this.videoEnded = this.videoEnded.bind(this);
        this.screen.addEventListener('click', this.clickPlay);
        this.replayEl.addEventListener('click', this.clickPlay);

    };
    VideoEl.prototype.timeUpdate = function (event) {
        if (this.video.currentTime > 0) {
            this.realStartPlay();
        }
        //已经加载完毕
        if (this.video.currentTime == this.video.duration) {
        }
    };


    /**
     * android6.0以下不支持全屏，因此播放在PHONE SVG区域
     */
    VideoEl.prototype.realStartPlay = function () {
        console.log('realStartPlay');
        if (androidVersion <= 6.0 && androidVersion > 0) {
            if (!this.realStartState) {
                this.realStartState = true;
                this.showVideo();
            }

        } else {
            this.showReplay();
        }

        this.clickPlayState = false;
    };

    VideoEl.prototype.videoEnded = function (event) {
        console.log('ended');
        this.showReplay();
    };

    VideoEl.prototype.clickPlay = function (event) {
        if (!this.clickPlayState) {
            this.clickPlayState = true;
            this.realStartState = false;//初始化this.realStartState，不能在ended中设置，因为ended后timeupdate还会执行
            //开始缓冲
            this.showLoading();
            this.video.play();
        }

    };

    VideoEl.prototype.showLoading = function () {
        this.video.classList.remove('full');
        this.replayEl.style.display = 'none';
        this.loadingEl.style.display = 'block';

    };
    VideoEl.prototype.showReplay = function () {
        this.video.classList.remove('full');
        this.replayEl.style.display = 'block';
        this.loadingEl.style.display = 'none';
    };
    VideoEl.prototype.showVideo = function () {
        this.video.classList.add('full');
        this.replayEl.style.display = 'none';
        this.loadingEl.style.display = 'none';
    };

    VideoEl.prototype.startVideo = function () {
        if (this.videoStarted) {
            return;
        }
        this.videoStarted = true;


        var parent = this.controlEl.parentElement;
        var html = '<source src="video/video.mp4" type="video/mp4">' +
            '<source src="video/video.webm" type="video/webm">' +
            '<source src="video/video.ogg" type="video/ogg">' +
            '<source src="video/video.mov" type="video/mov">' +
            'Your browser does not support HTML5 video.';
        var video = document.createElement('video');
        video.setAttribute('class', 'video');
        video.setAttribute('preload', 'preload');
        video.innerHTML = html;
        parent.insertBefore(video, this.controlEl);
        this.video = video;
        this.video.addEventListener('timeupdate', this.timeUpdate);
        if (androidVersion <= 6.0 && androidVersion > 0) {
            this.video.addEventListener('ended', this.videoEnded);
        }

        //视频占位图淡入
        this.screen.classList.remove('m-fade-out');
        this.screen.classList.add('m-fade-in');
        this.showReplay();

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


    var mobileSystem = util.getMobileSystem();
    var androidVersion = util.getAndroidVersion();
    var browserInfo = util.getBrowserInfo();


    // Expose MediaAnimation
    window[NAME] = MediaAnimation;


})(window, document);
