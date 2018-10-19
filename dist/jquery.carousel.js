/*!
 * jQuery Carousel Plugin v1.0.0
 * https://github.com/itrainhub/jquery-xmcarousel
 */
;
(function(factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function($) {
  var Carousel = function() {
    this.$element = null;
    this.$wrappers = null;
    this.$sliders = null;
    this.$pagination = null;
    this.$paginationItems = null;
    this.$prev = null;
    this.$next = null;
    this.options = null;
    this.length = 0;
    this.currentIndex = 0;
    this.nextIndex = 1;
    this.timer = null;
    this.paginationActiveClass = "";
    this.sliderWidth = 0;
    this.sliderHeight = 0;
    this.isRunning = false;
  };

  Carousel.VERSION = "1.0.0";

  $.extend(Carousel.prototype, {
    // 初始化
    init: function(element, options) {
      var _self = this;
      element = element || ".xm-carousel-container";
      _self.$element = $(element);
      _self.$wrappers = _self.$element.find(".xm-carousel-wrapper");
      _self.$sliders = _self.$wrappers.find(".xm-carousel-slider");
      _self.options = $.extend({}, Carousel.defaultOptions, options);
      _self.length = _self.$sliders.length;

      // 分页器处理
      if (_self.options.pagination) {
        var $pagination = _self.$element.find(_self.options.pagination.el);
        var initClassName = _self.options.pagination.initClassName || "xm-carousel-pagination-item";
        var activeClassName = _self.paginationActiveClass = _self.options.pagination.activeClassName || "xm-carousel-pagination-item-active";
        var paginationHTML = "";

        if (_self.options.pagination.type === "custom") {
          // 定制分页器
          initClassName = _self.options.pagination.customeClassName;
        } else {
          // 默认分页器
          for(var i = 0; i < _self.length; i++) {
            paginationHTML += "<i class='"+ initClassName +"'></i>";
          }
          $pagination.html(paginationHTML);
        }

        // 获取分页器中的项
        _self.$paginationItems = $pagination.find("." + initClassName);
        _self.$paginationItems.first().addClass(activeClassName);
      }

      // 轮播方式处理
      if (_self.options.type === "horizontal" || _self.options.type === "vertical") {
        // 水平或垂直
        var
          firstCopy = _self.$sliders.first().clone(true),
          lastCopy = _self.$sliders.last().clone(true),
          elWidth = _self.sliderWidth = _self.$sliders.first().outerWidth(true),
          elHeight = _self.sliderHeight = _self.$sliders.first().outerHeight(true);

        _self.$wrappers.append(firstCopy).prepend(lastCopy);
        _self.length += 2;

        _self.$sliders = _self.$wrappers.find(".xm-carousel-slider");
        
        if (_self.options.type === "horizontal") {
          _self.$wrappers.css({width: _self.length * elWidth, left: -1 * _self.sliderWidth});
          _self.$sliders.css({float: "left"});
        } else if (_self.options.type === "vertical") {
          _self.$wrappers.css({height: _self.length * elHeight, top: -1 * _self.sliderHeight});
        }

        _self.$wrappers.css({position: "absolute"})

        _self.currentIndex = 1;
        _self.nextIndex = 2;
      } else if(_self.options.type === "fade") {
        // 淡入淡出
        _self.$sliders.css({position: "absolute", top: 0, left: 0})
                      .not(":first").hide();
        _self.currentIndex = 0;
        _self.nextIndex = 1;
      }

      // 前后翻页
      if (_self.options.navigation) {
        _self.$prev = $(_self.options.navigation.prevEl);
        _self.$next = $(_self.options.navigation.nextEl);
      }

      // 添加事件监听
      _self.addListener();

      // 自动轮播
      _self.autoPlay();
    },

    // 添加事件监听
    addListener: function() {
      var _self = this;
      // 鼠标移入/移出轮播图容器
      _self.$element.hover(function() {
        clearInterval(_self.timer);
      }, $.proxy(_self.autoPlay, _self));

      // 移入小点切换
      if (_self.$paginationItems){
        _self.$paginationItems.on("mouseenter", function() {
          var index = $(this).index();
          if (_self.options.type === "horizontal" || _self.options.type === "vertical")
            index += 1;
          if (_self.currentIndex === index)
            return;
          _self.nextIndex = index;
          _self.move();
        });
      }

      // 向前/后翻页
      if (_self.$prev){
        _self.$prev.on("click", function() {
          if (_self.isRunning)
            return;
          _self.nextIndex = _self.currentIndex - 1;
          _self.move();
        });
        _self.$prev.on("selectstart", function() {
          return false;
        });
      }
      if (_self.$next) {
        _self.$next.on("click", function() {
          if (_self.isRunning)
            return;
          _self.move();
        });
        _self.$next.on("selectstart", function() {
          return false;
        });
      }
    },

    // 自动轮播
    autoPlay: function() {
      if (this.options.autoplay) {
        var duration = this.options.autoplay.delay;
        this.timer = setInterval($.proxy(this.move, this), duration);
      }
    },

    // 轮播切换
    move: function() {
      if (this.options.type === "horizontal")
        this.horizontal();
      else if (this.options.type === "vertical")
        this.vertical();
      else if (this.options.type === "fade") {
        if (this.nextIndex < 0)
          this.nextIndex = this.length - 1;
        this.fade();
      }
    },

    // 滑动轮播
    slide: function(direction, end) {
      var
        _self = this,
        bulletIndex = _self.nextIndex - 1,
        bulletLen = _self.$paginationItems.length,
        end = null,
        head = null,
        foot = null;

      this.isRunning = true;
      
      if (bulletIndex < 0)
        bulletIndex = bulletLen - 1;
      else if (bulletIndex >= bulletLen)
        bulletIndex = 0;

      if (direction === "horizontal") {
        head = {left: -1 * _self.sliderWidth};
        foot = {left: -1 * (_self.length - 2) * _self.sliderWidth};
        end = {left: -1 * _self.nextIndex * _self.sliderWidth};
      } else if (direction === "vertical") {
        head = {top: -1 * _self.sliderHeight};
        foot = {top: -1 * (_self.length - 2) * _self.sliderHeight};
        end = {top: -1 * _self.nextIndex * _self.sliderHeight};
      }
      _self.$wrappers.stop().animate(end, function() {
        if (_self.currentIndex >= _self.length - 1) {
          _self.currentIndex = 1;
          _self.nextIndex = 2;
          _self.$wrappers.css(head)
        } else if (_self.currentIndex <= 0) {
          _self.currentIndex = _self.length - 2;
          _self.nextIndex = _self.length - 1;
          _self.$wrappers.css(foot);
        }

        _self.isRunning = false;
      });
      _self.$paginationItems.removeClass(_self.paginationActiveClass)
        .eq(bulletIndex).addClass(_self.paginationActiveClass);      

      _self.currentIndex = _self.nextIndex;
      _self.nextIndex++;
    },

    // 水平滑动
    horizontal: function() {
      this.slide("horizontal");
    },

    // 垂直滑动
    vertical: function() {
      this.slide("vertical");
    },

    // 淡入淡出
    fade: function() {
      this.$sliders.eq(this.currentIndex).fadeOut();
      this.$sliders.eq(this.nextIndex).fadeIn();
      this.$paginationItems.eq(this.currentIndex).removeClass(this.paginationActiveClass);
      this.$paginationItems.eq(this.nextIndex).addClass(this.paginationActiveClass);

      this.currentIndex = this.nextIndex;
      this.nextIndex++;
      if (this.nextIndex >= this.length)
        this.nextIndex = 0;
    }
  });

  // 默认配置
  Carousel.defaultOptions = {
    type: "horizontal", // "horizontal"、"vertical"、"fade"
    autoplay: {
      delay: 3000
    },
    pagination: {
      el: ".xm-carousel-pagination",
      type: "bullet", // "bullet"、"custom"
      activeClassName: "xm-carousel-pagination-item-active",
      initClassName: "xm-carousel-pagination-item",
      customeClassName: ""
    },
    navigation: {
      nextEl: ".xm-carousel-button-next",
      prevEl: ".xm-carousel-button-prev"
    }
  };
  
  // jQuery 插件
  $.fn.carousel = function(options) {
    this.each(function(index, element) {
      var c = new Carousel();
      c.init(element, options);
    });
  }
});