# Carousel

>一个jQuery的轮播图插件，基于jquery-1.12.4版本开发

## 使用说明

### 安装

下载 [jquery-xmcarousel](https://github.com/itrainhub/jquery-xmcarousel/archive/V1.0.0.zip)

### 引入

```
// CSS
<link rel="stylesheet" href="dist/jquery.carousel.min.css">

// JavaScript
<script src="jquery-1.12.4.min.js"></script>
<script src="dist/jquery.carousel.min.js"></script>
```

### 创建轮播图

```
// HTML
<div class="xm-carousel-container">
  <div class="xm-carousel-wrapper">
    <div class="xm-carousel-slider" style="background: #f00"></div>
    <div class="xm-carousel-slider" style="background: #ff0"></div>
    <div class="xm-carousel-slider" style="background: #f0f"></div>
  </div>
  <div class="xm-carousel-pagination"></div>
  <div class="xm-carousel-button-prev">&lt;</div>
  <div class="xm-carousel-button-next">&gt;</div>
</div>

// CSS
<style type="text/css">
  .xm-carousel-container {
    width: 200px;
    height: 150px;
  }
</style>

// JavaScript
<script>
  $(function() {
    $(".xm-carousel-container").carousel({
      autoplay: {
        delay: 5000
      },
      pagination: {
        el: ".xm-carousel-pagination",
        type: "bullet"
      },
      type: "vertical",
      navigation: {
        nextEl: ".xm-carousel-button-next",
        prevEl: ".xm-carousel-button-prev"
      }
    });
  });
</script>
```

### API

```
$(selector).carousel(options)
```

-- options: 轮播图配置选项，说明：

|选项|类型|默认值|说明|
|--|--|--|--|
|type|string|"horizontal"|轮播图类型，可取 "horizontal"、"vertical"、"fade"|
|autoplay|boolean,object|false|是否自动轮播。<br>设置为 true 时默认为<br>{<br>&nbsp;&nbsp;delay:3000 // 自动轮播延迟时间<br>}|
|pagination|boolean,object|false|是否显示分页器。<br>设置为 true 时默认为<br>{<br>&nbsp;&nbsp;el: ".xm-carousel-pagination", // 分页器元素<br>&nbsp;&nbsp;type: "bullet", // 元素类型，可取 "bullet" - 小点, "custom" - 自定义<br>&nbsp;&nbsp;initClassName: "xm-carousel-pagination-item", // 元素正常样式类名<br>&nbsp;&nbsp;activeClassName: "xm-carousel-pagination-item-active", // 元素激活样式类名<br>&nbsp;&nbsp;customeClassName: "" // 自定义样式类名<br>}|
|navigation|boolean,object|false|是否显示前后翻页按钮。<br>设置为 true 时默认为<br>{<br>&nbsp;&nbsp;nextEl: ".xm-carousel-button-next", // 后一项按钮元素<br>&nbsp;&nbsp;prevEl: ".xm-carousel-button-prev" // 前一项按钮元素<br>}|
