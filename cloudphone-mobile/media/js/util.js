/**
 * Created by candice on 16/7/13.
 */

;
(function (util, window, document, undefined) {

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    /**
     * 使用特征检测方式获取浏览器信息
     */
    function getBrowserInfo() {
        var info = {};
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || userAgent.indexOf(' OPR/') >= 0;
        info.isOpera = isOpera;
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        info.isFirefox = isFirefox;
        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        info.isSafari = isSafari;
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        info.isIE = isIE;
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        info.isEdge = isEdge;
        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        info.isChrome = isChrome;
        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        info.isBlink = isBlink;

        return info;
    }

    util.getBrowserInfo = getBrowserInfo;


    /**
     * Determine the mobile operating system.
     * This function either returns 'iOS', 'Android' or 'unknown'
     *
     * @returns {String}
     */
    function getMobileSystem() {


        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return 'iOS';

        }
        else if (userAgent.match(/Android/i)) {

            return 'Android';
        }
        else {
            return 'unknown';
        }
    }

    util.getMobileSystem = getMobileSystem;

    /**
     * 获取Android版本号
     * @returns {Number}
     */
    function getAndroidVersion() {
        var ua = userAgent.toLowerCase();
        var version = parseFloat(ua.slice(ua.indexOf('android') + 8));
        if (isNaN(version)) {
            version = -1;
        }
        return version;

    }

    util.getAndroidVersion = getAndroidVersion;


})(window.util = window.util || {}, window, document);


