/**
 * Created by candice on 16/8/1.
 */
;(function(window,document,Snap,util){
    var NAME = 'OceanProgress';
    var DEFAULTS = {
        fillColor:'#1863d0', //进度默认填充色值
        centerIcon:'cloud'
    };

    function OceanProgress(el,options){
        this.el = el;
        this.progress = 0;
        this.yRand = [[96,-20],[91,-25],[101,-15],[101,-15]];

        util.extend(this,DEFAULTS,options);
        this.init();
    }

    OceanProgress.prototype.init = function(){
        this.waterArray = [].slice.apply(this.el.getElementsByClassName('water-fill'));
        var self = this;
        this.waterArray.forEach(function(item,i){
           item.setAttribute('y',self.yRand[i][0]);  //reset y
        });

        //set fillColor
        this.waterPath = this.el.getElementsByClassName('water-path')[0];
        this.waterPath.style.fill = this.fillColor;

        //set centerIcon
        this.cloudIcon = document.getElementById('noxphone-cloud');
        this.closeIcon = document.getElementById('noxphone-close');
        this.switchCenterIcon(this.centerIcon);


    };

    /**
     * API设置进度
     * @param progress eg 80%:80
     */
    OceanProgress.prototype.setProgress = function(progress){
        this.progress = progress;
        this.updateWater();
    };

    /**
     * API切换背景
     */
    OceanProgress.prototype.switchCenterIcon = function(centerIcon){
        if(centerIcon === 'cloud'){
            this.closeIcon.classList.remove('p-fade-in');
            this.closeIcon.classList.add('p-fade-out');

            this.cloudIcon.classList.add('p-fade-in');
            this.cloudIcon.classList.remove('p-fade-out');

        }else if(centerIcon === 'close'){
            this.cloudIcon.classList.remove('p-fade-in');
            this.cloudIcon.classList.add('p-fade-out');

            this.closeIcon.classList.add('p-fade-in');
            this.closeIcon.classList.remove('p-fade-out');
        }

    };

    /**
     * 更新波浪高度
     */
    OceanProgress.prototype.updateWater = function(){
        var self = this;
        this.waterArray.forEach(function(item,i){
            var yValue = self.calcY(self.progress,i);
            Snap(item).animate({y:yValue},500);
        });

    };

    OceanProgress.prototype.calcY = function(progress,index){
        var rand = this.yRand[index];
        var delta = (rand[0] - rand[1])*(progress/100);
        return rand[0] - delta;
    };

    window[NAME] = OceanProgress;

})(window,document,Snap,util);