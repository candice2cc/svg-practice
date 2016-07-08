/**
 * Created by candice on 16/6/20.
 */
;
(function (window, document, undefined) {
    'use strict';

    // Constants
    var NAME = 'GearAnimation';
    var DEFAULTS = {};


    function inheritPrototype(subType, superType) {
        var prototype = Object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    }

    function SVGEl(el) {
        this.el = el;
        if (el) {
            this.doc = el.getSVGDocument();
        }

        this.paths = new Array();
    }


    /**
     * 齿轮SVG
     * @param el
     * @constructor
     */
    function GearSVGEl(el) {
        SVGEl.call(this, el);
        this.init();
    }

    inheritPrototype(GearSVGEl, SVGEl);
    GearSVGEl.prototype.init = function () {
        var self = this;
        [].slice.call(this.doc.querySelectorAll('.gear-m')).forEach(function (path, i) {
            self.paths[i] = path;
        });
    };
    GearSVGEl.prototype.animate = function () {
        this.paths.forEach(function (path, i) {
            path.style.animationPlayState = 'running';
        });
    };

    /**
     * 曲线SVG
     * @param el
     * @constructor
     */
    function LineSVGEl(el) {
        SVGEl.call(this, el);
        this.init();
    }

    inheritPrototype(LineSVGEl, SVGEl);
    LineSVGEl.prototype.init = function () {
        var self = this;
        [].slice.call(this.doc.querySelectorAll('path')).forEach(function (path, i) {
            self.paths[i] = path;
        });
    };
    LineSVGEl.prototype.animate = function () {
        this.paths.forEach(function (path, i) {
            path.style.animationPlayState = 'running';

        });
    };


    function GearAnimation(element, options) {
        this.element = element;
        this.extend(this, DEFAULTS, options);
        this.gearSVG = new Array();
        this.cloudLineSVG = new Array();
        this.phoneLineSVG = null;
        this.phonePlatSVG = null;
        this.phoneScreenSVG = null;
        this.initFlag = false;
        this.loadListener = this.init;
        this.onCustomLoad();//当组件加载时初始化
    }

    GearAnimation.prototype.onCustomLoad = function () {
        if (typeof this.loadListener !== 'function') {
            return;
        }
        var self = this;
        var svgs = this.element.querySelectorAll('.svg');
        var loadCount = 0;
        for (var i = 0; i < svgs.length; i++) {
            if (svgs[i].getSVGDocument()) {
                loadCount++;
                if (loadCount == svgs.length) {
                    self.loadListener.apply(self, []);//保持作用域
                }
            } else {
                svgs[i].addEventListener('load', function () {
                    loadCount++;
                    if (loadCount == svgs.length) {
                        self.loadListener.apply(self, []);
                    }
                });
            }

        }
    };

    GearAnimation.prototype.init = function () {
        var gears = this.element.querySelectorAll('.gear-item');
        for (var i = 0; i < gears.length; i++) {
            this.gearSVG[i] = new GearSVGEl(gears[i]);
        }
        var cloudLines = this.element.querySelectorAll('.cloud-line');
        for (var j = 0; j < cloudLines.length; j++) {
            this.cloudLineSVG[j] = new LineSVGEl(cloudLines[j]);
        }

        this.phoneLineSVG = new SVGEl(this.element.querySelectorAll('.phone-line')[0]);
        this.phonePlatSVG = new SVGEl(this.element.querySelectorAll('.phone-flat')[0]);
        this.phoneScreenSVG = new SVGEl(this.element.querySelectorAll('.phone-screen')[0]);
        this.initFlag = true;
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

    GearAnimation.prototype.animate = function () {
        var self = this;
        if (!self.initFlag) {
            var loadListener = self.loadListener;

            self.loadListener = function () {
                loadListener.apply(self, []);
                self.animate.apply(self, []);
            };
        } else {
            //非chrome fix
            if (!isChrome) {
                this.phonePlatSVG.el.getSVGDocument().getElementsByClassName('cls-filter-fix')[0].style.display = 'block';
            }

            this.element.style.opacity = '1';
            //齿轮转动
            this.gearSVG.forEach(function (gear, i) {
                gear.animate();
            });

            //曲线
            this.cloudLineSVG.forEach(function (line, i) {
                line.animate();
            });

            //phone
            setTimeout(function () {
                self.phoneLineSVG.el.style.opacity = '1';
                var phoneLine = self.phoneLineSVG;
                [].slice.call(phoneLine.doc.querySelectorAll('path')).forEach(function (path, i) {
                    phoneLine.paths[i] = path;
                });

                phoneLine.paths.forEach(function (path, i) {
                    path.style.animationPlayState = 'running';
                });

                setTimeout(function () {
                    self.phoneLineSVG.el.style.opacity = '0';
                    self.phonePlatSVG.el.style.opacity = '1';
                    self.phoneScreenSVG.el.style.opacity = '1';
                }, 1500); //手机绘制完成，切换到扁平手机
            }, 1000);//曲线动画完成一轮，开始绘制手机
        }

    };
    var u = navigator.userAgent;
    var isChrome = u.indexOf('Chrome') > -1; //chrome以外的浏览器(safari firefox)不支持阴影使用的滤镜，因此区分

    // Expose GearAnimation
    window[NAME] = GearAnimation;
})(window, document);