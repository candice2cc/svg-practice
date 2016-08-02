###ocean progress
基于SVG遮罩和CSS混合模式来制作的波浪运动效果。
####使用方法
- 依赖
snap.svg
- 文件
<script src="../Snap.svg-0.4.1/dist/snap.svg.js"></script>
<script src="../common/scripts/util.js"></script>
<script src="scripts/ocean-progress.js"></script>

- demo

        var progress = new OceanProgress(document.getElementById('Demo'),{
            fillColor:'#1863d0', //进度默认填充色值
            centerIcon:'cloud'
        });
        progress.setProgress(30);
        setTimeout(function(){
            progress.setProgress(60);
            setTimeout(function(){
                progress.setProgress(90);
                setTimeout(function(){
                    progress.setProgress(45); //设置进度
                    progress.switchCenterIcon('close'); //切换至close
                },10000);
            },3000);
        },2000);

        参数说明：
        fillColor:wave填充色值
        centerIcon:icon，'close'|'cloud'

        API说明:
        eg. setProgress(80) 设置进度到80%
        eg. switchCenterIcon('close') 切换icon为关闭icon

