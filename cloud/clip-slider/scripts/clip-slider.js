;
(function (window, document, Snap, util) {
    'use strict';

    // Constants
    var NAME = 'ClipSlider';
    var DEFAULTS = {
        width: 1280,
        height: 720,
        cx: 640,
        cy: 600,
        radius1: 0,
        radius2: 720,
        imageArray: []
    };

    function ClipSlider(element, options) {


        this.el = element;
        this.duration = 1000;
        this.currentIndex = 0;
        this.nextIndex = 1;
        this.oldCurrentIndex = -1;
        this.oldNextIndex = -1;

        // Compose Settings Object
        util.extend(this, DEFAULTS, options);

        this.init();
    }

    /**
     * 初始化
     */
    ClipSlider.prototype.init = function () {
        this.updateSlides = this.updateSlides.bind(this);
        this.initDom();
        this.enable();
    };

    /**
     * 初始化DOM
     */
    ClipSlider.prototype.initDom = function () {
        var self = this;
        //清除旧dom
        var rootEl = this.el.getElementsByClassName('clip-slider-wrapper');
        if(rootEl.length > 0){
            rootEl[0].parentNode.removeChild(rootEl[0]);
        }

        //创建新dom
        rootEl = document.createElement('div');
        rootEl.setAttribute('class', 'clip-slider-wrapper');

        var ul = document.createElement('ul');
        ul.setAttribute('class', 'clip-slider');

        var defs = '<defs>' +
            '<clipPath id="clImage">' +
            '<circle id="clCircle" cx="' + this.cx + '" cy="' + this.cy + '" r="' + this.radius1 + '"></circle>' +
            '</clipPath>' +
            '</defs>';
        this.imageArray.forEach(function (item, i) {
            var li = document.createElement('li');
            li.setAttribute('class', 'slide-item');
            if(i == 0){
                li.classList.add('slide-current');

            }
            if(i == 1){
                li.classList.add('slide-next');
            }

            var viewBox = '0 0 ' + self.width + ' ' + self.height;
            var defsTmp = '';
            if (i == 0) {
                defsTmp = defs;
            }
            var html = '<div class="svg-wrapper">' +
                '<svg class="svg" viewBox="' + viewBox + '">' +
                '<title>Animated SVG Slider</title>' + defsTmp +
                '<image class="slide-image" height="100%" width="100%" xlink:href="' +
                '' + item + '"></image>' +
                '</svg>' +
                '</div>';

            li.innerHTML = html;
            ul.appendChild(li);
        });

        rootEl.appendChild(ul);
        this.slideArray = [].slice.apply(rootEl.getElementsByClassName('slide-item'));
        this.slideImageArray = [].slice.apply(rootEl.getElementsByClassName('slide-image'));
        this.circle = rootEl.querySelectorAll('#clCircle')[0];

        this.slideArray.forEach(function(item,i){
            item.style.width = self.width + 'px';
            item.style.height = self.height + 'px';
        });

        this.rootEl = rootEl;
        this.el.appendChild(rootEl);

    };


    ClipSlider.prototype.enable = function () {
        if (this.slideImageArray.length < 2) {
            return;
        }

        var loadCount = 0;
        var l = this.slideImageArray.length;
        var self = this;
        this.slideImageArray.forEach(function (item, i) {
            if (item.complete) {
                loadCount++;
                if (loadCount == l) {
                    self.updateSlides();
                }
            } else {
                item.onerror = function(){
                    //有图片加载失败时，隐藏
                    self.rootEl.classList.add('transparent');

                };
                item.onload = function(){
                    loadCount++;
                    if (loadCount == l) {
                        self.updateSlides();
                    }
                };
            }
        });
    };


    ClipSlider.prototype.updateSlides = function () {
        if(this.oldCurrentIndex > -1){
            this.slideArray[this.oldCurrentIndex].classList.remove('slide-current');
            this.slideArray[this.oldNextIndex].classList.remove('slide-next');
            this.slideImageArray[this.oldNextIndex].removeAttribute('clip-path');
        }
        this.circle.setAttribute('r',this.radius1);

        this.curSlide = this.slideArray[this.currentIndex];
        this.nextSlide = this.slideArray[this.nextIndex];
        this.curSlide.classList.add('slide-current');
        this.nextSlide.classList.add('slide-next');
        this.slideImageArray[this.nextIndex].setAttribute('clip-path', 'url(#clImage)');//clip-path="url(#clImage)"
        this.oldCurrentIndex = this.currentIndex;
        this.oldNextIndex = this.nextIndex;
        this.currentIndex = ((this.currentIndex + 1 ) % this.imageArray.length);
        this.nextIndex = ((this.nextIndex + 1 ) % this.imageArray.length);


        Snap("#clCircle").animate({r: this.radius2}, this.duration, null, this.updateSlides);
    };

    window[NAME] = ClipSlider;


}(window, document, Snap, util));

