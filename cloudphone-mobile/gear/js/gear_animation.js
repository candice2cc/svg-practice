/**
 * Created by candice on 16/7/1.
 */
;
(function (window, document, undefined) {
    'use strict';

    // Constants
    var NAME = 'GearAnimation';
    var DEFAULTS = {
        fontSizeDefault: 16,
        widthDefault: 360
    };

    function GearAnimation(element, options) {
        this.element = element;
        // Data Extraction
        var data = {};
        // Delete Null Data Values
        for (var key in data) {
            if (data[key] === null) delete data[key];
        }

        this.svgEls = new Array();


        // Compose Settings Object
        this.extend(this, DEFAULTS, options, data);

        // States
        this.enabled = false;
        this.isPortrait = this.getScreenOrientation(); //是否竖屏


        // Callbacks
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);


        // Initialise
        this.initialise();
    }

    GearAnimation.prototype.initialise = function () {
        this.updateGear();
        this.updateLine();
        this.updatePhone();
        this.enable();
    };

    GearAnimation.prototype.updateGear = function () {
        this.gearSVGs = [].slice.call(this.element.getElementsByClassName('gear-item'));
        this.svgEls = this.svgEls.concat(this.gearSVGs);
    };
    GearAnimation.prototype.updateLine = function () {
        this.lineSVGs = [].slice.call(this.element.getElementsByClassName('cloud-line'));
        this.svgEls = this.svgEls.concat(this.lineSVGs);

    };
    GearAnimation.prototype.updatePhone = function () {
        this.phoneLineSVG = this.element.getElementsByClassName('phone-line')[0];
        this.phonePlatSVG = this.element.getElementsByClassName('phone-flat')[0];
        this.phoneScreenSVG = this.element.getElementsByClassName('phone-screen')[0];

        this.svgEls.push(this.phoneLineSVG);
        this.svgEls.push(this.phonePlatSVG);
        this.svgEls.push(this.phoneScreenSVG);
    };

    GearAnimation.prototype.disable = function () {

    };

    GearAnimation.prototype.enable = function () {
        if (!this.enabled) {
            this.enabled = true;

            var loadCount = 0;
            var l = this.svgEls.length;
            var self = this;
            this.svgEls.forEach(function (svg, i) {
                if (svg.getSVGDocument()) {
                    loadCount++;
                    if (loadCount == l) {
                        self.enableAnimation();
                    }
                } else {
                    svg.addEventListener('load', function () {
                        loadCount++;
                        if (loadCount == l) {
                            self.enableAnimation();
                        }
                    });
                }
            });
            this.scale();
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.onDeviceOrientation);


        }
    };

    /**
     * 开启动画
     */
    GearAnimation.prototype.enableAnimation = function () {
        var self = this;
        //safari ,android4.x fix
        if (isSafari || (androidVersion > 0 && androidVersion < 5)) {
            self.phonePlatSVG.getSVGDocument().getElementsByClassName('cls-safari-fix')[0].style.display = 'block';
        }


        self.fadeIn(self.element);
        for (var i = 0, l = self.gearSVGs.length; i < l; i++) {
            self.animateSVG(self.gearSVGs[i], '.gear-m');
        }
        setTimeout(function () {
            for (i = 0, l = self.lineSVGs.length; i < l; i++) {
                self.animateSVG(self.lineSVGs[i], 'path');
            }
            setTimeout(function () {
                //phone进场
                self.fadeIn(self.phoneLineSVG);
                self.animateSVG(self.phoneLineSVG, 'path');
                setTimeout(function () {
                    self.fadeOut(self.phoneLineSVG);
                    self.fadeIn(self.phonePlatSVG);
                    self.fadeIn(self.phoneScreenSVG);
                }, 2000);
            }, 600); //line绘制时间
        }, 600);
    };

    GearAnimation.prototype.extend = function () {
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

    GearAnimation.prototype.fadeIn = function (el) {
        el.classList.remove('g-fade-out');
        el.classList.add('g-fade-in');
    };

    GearAnimation.prototype.fadeOut = function (el) {
        el.classList.add('g-fade-out');
        el.classList.remove('g-fade-in');
    };


    /**
     * 开启指定svg object的animation态
     * @param svgEl :SVG object
     * @param selector :path的selector
     */
    GearAnimation.prototype.animateSVG = function (svgEl, selector) {
        [].slice.call(svgEl.getSVGDocument().querySelectorAll(selector)).forEach(function (path, i) {
            path.style.animationPlayState = 'running';
            path.style.webkitAnimationPlayState = 'running';
        });

    };


    //适配响应

    /**
     * 基于字体大小缩放
     */
    GearAnimation.prototype.scale = function () {
        //return; //TODO
        //alert(window.innerWidth);
        var fontSize;
        fontSize = window.innerWidth * this.fontSizeDefault / this.widthDefault;
        this.element.style.fontSize = fontSize + 'px';
    };

    GearAnimation.prototype.onDeviceOrientation = function () {
        if (this.isPortrait === this.getScreenOrientation()) {
            return;
        }
        this.isPortrait = this.getScreenOrientation();
        this.scale();
        if (isAndroid) {
            location.reload(false);
        }


    };

    GearAnimation.prototype.getScreenOrientation = function () {
        if (window.orientation === 180 || window.orientation === 0) {
            return true;
        }
        if (window.orientation === 90 || window.orientation === -90) {
            return false;
        }
    };
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isSafari = u.indexOf('Safari') > -1 || u.indexOf('AppleWebkit') <= -1;
    //get androidVersion
    var androidVersion = -1;
    if (isAndroid) {
        androidVersion = parseFloat(u.slice(u.indexOf('Android') + 8));
        if (isNaN(androidVersion)) {
            androidVersion = -1;
        }
    }

    // Expose MediaAnimation
    window[NAME] = GearAnimation;


})(window, document);