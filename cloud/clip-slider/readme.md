###clip slider
基于SVG clip-path和mask遮罩元素的弹性过渡幻灯片特效
####使用方法
- 依赖
snap.svg
- 文件
<script src="../Snap.svg-0.4.1/dist/snap.svg.js"></script>
<script src="../common/scripts/util.js"></script>
<script src="scripts/clip-slider.js"></script>

- demo

        var clipSlider = new ClipSlider(document.getElementById('Demo'),{
            imageArray:['images/s-1.jpg','images/s-2.jpg','images/s-3.jpg'],
            width: 320,
            height: 480,
            cx: 160,
            cy: 408,
            radius1: 0,
            radius2: 580,
        });

        参数说明：
        imageArray:轮播图片URL
        width:容器宽度
        height：容器高度
        cx：动画起始坐标x，相对于容器
        cy: 动画起始坐标y，相对于容器
        radius：动画发散圈起始半径和结束半径，结束半径建议覆盖整个容器范围
