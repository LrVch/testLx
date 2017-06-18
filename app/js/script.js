"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready() {

  // news
  (function() {
    var news = document.querySelector('[data-news]');
    var loader = document.querySelector('[data-news-loader]');
    var API_URL = 'http://localhost:4040';

    if (!news) {
      return;
    }

    function renderNews(callback, data) {
      var html = data.map(function(newsItem) {
        return getMarkup(newsItem);
      }).join("");

      var div = document.createElement("div");

      div.innerHTML = html;
      div.className = 'news__container';

      news.appendChild(div);

      callback && callback();
    }

    var renderNewsBindedEvents = renderNews.bind(null, bindEvents);

    function hideLoader() {
      loader.className = 'news__loader loaded';
    }

    function showLoader() {
      loader.className = 'news__loader show';
    }

    function bindEvents() {
      news.addEventListener('click', findMoreBtn);
    }

    function findMoreBtn(event) {
      var target = event.target;

      while (target !== this) {
        if (target.hasAttribute('data-toggle-more')) {
          toggleMore(target, event);
          return;
        }
        target = target.parentNode;
      }
    }

    function toggleMore(target, event) {
      event.preventDefault();
      var parent = target.parentNode;
      var textElem = target.querySelector('[data-more-text]');

      if (target.hasAttribute('data-open')) {
        target.removeAttribute('data-open');
        parent.className = 'news-item';
        textElem.innerHTML = 'more';
      } else {
        target.setAttribute('data-open', '');
        parent.className = 'news-item open';
        textElem.innerHTML = 'hide';
      }
    }

    function requestErrorHandler(e, count, callback) {
      requestErrorHandler.count++;

      if (requestErrorHandler.count === count) {
        return;
      }

      console.error( "Извините, в данных ошибка, мы попробуем получить их ещё раз" );
      console.error( e.name );
      console.error( e.message );

      callback && callback();
    }

    requestErrorHandler.count = 0;

    function parseData(data, callback) {
      try {
        var news = JSON.parse(data);
        callback && callback(news);

      } catch (e) {
        requestErrorHandler(e, 3, function() {
          getNews(parseData, null, showLoader, hideLoader);
        });
      }
    }

    function getMarkup(newsItem) {
      return '<div class="news-item">'
               +'<div class="news-item__header">'
                  +'<h4 class="news-item__title">' + newsItem.title + '</h4>'
                  +'<div class="news-item__date">' + formatDate(new Date(newsItem.date)) + '</div>'
                +'</div>'
                +'<div class="news-item__content" data-content>'
                  +'<div>'
                   +'<p>' + newsItem.text + '</p>'
                  +'</div>'
                +'</div><a href="#" data-toggle-more class="news-item__more"><span data-more-text>more</span><span>&nbsp;&gt;</span></a>'
              +'</div>';
    }

    function formatDate(date) {
      return addNull(date.getDate()) + '.' + addNull((date.getMonth() + 1)) + '.' + addNull(date.getFullYear());
      // var options = {
      //   year: 'numeric',
      //   month: 'numeric',
      //   day: 'numeric',
      // };
      // return date.toLocaleString("ru", options);
    }

    function addNull(num) {
      return num < 10 ? '0' + num : num;
    }

    function getNews(success, error, allwaysBefore, allwaysAfter) {
      allwaysBefore && allwaysBefore();

      var xhr = new XMLHttpRequest();

      xhr.open('GET', API_URL + '/news');

      xhr.send();


      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        allwaysAfter && allwaysAfter();

        if (xhr.status !== 200) {
          error && error(xhr.status, xhr.statusText) || console.error(xhr.status + ': ' + xhr.statusText);
        } else {
          success && success(xhr.responseText, renderNewsBindedEvents);
        }
      }
    }

    getNews(parseData, null, showLoader, hideLoader);
  }());

  // lenta
  (function() {
    function Lenta(options) {
      var self = this;
      this.config = Lenta.mergeSettings(options);

      this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;
      this.selectorWidth = this.selector.offsetWidth;
      this.innerElements = [].slice.call(this.selector.children);
      this.transformProperty = Lenta.webkitOrNot();
      this.initState = false;

      ['resizeHandler', 'mouseenterHandler', 'mouseleaveHandler', 'transitionendHandler'].forEach(function (method) {
        self[method] = self[method].bind(self);
      });

      this.init();
    }

    Lenta.mergeSettings = function(options) {
      var settings = {
        selector: '.lenta',
        duration: 200,
        silence: 1700,
        delay: 1000,
        easing: 'ease-out',
        onInit: function() {},
        onChange: function() {},
      };
      var userSttings = options;
      for (var attrname in userSttings) {
        settings[attrname] = userSttings[attrname];
      }
      return settings;
    }

    Lenta.webkitOrNot = function() {
      var style = document.documentElement.style;

      // if (typeof style.transform == 'string') {
        return 'transform';
      // }
      // return 'WebkitTransform';
    }

    Lenta.prototype.init = function() {
      window.addEventListener('resize', this.resizeHandler);

      if (this.selector === null) {
        throw new Error('Something wrong with your selector 😭');
      }

      this.selector.addEventListener('mouseenter', this.mouseenterHandler);
      this.selector.addEventListener('mouseleave', this.mouseleaveHandler);

      this.createRezerv();

      this.sliderFrame = document.createElement('div');
      this.sliderFrame.className = 'lenta__inner';
      this.setTransform(this.config.duration, this.config.easing);
      this.setTranslate(0);

      var docFragment = document.createDocumentFragment();

      for (var i = 0; i < this.innerElements.length; i++) {
        docFragment.appendChild(this.createFrameItem(this.innerElements[i]));
      }

      this.sliderFrame.appendChild(docFragment);

      this.selector.innerHTML = '';
      this.selector.appendChild(this.sliderFrame);

      this.selector.querySelector('.lenta__inner').addEventListener('transitionend', this.transitionendHandler);

      this.frameItemWidth = this.selector.querySelector('.lenta__frame').offsetWidth;
      this.sliderFrame.style.width = this.frameItemWidth * this.innerElements.length + 'px';

      this.setInitState();

      this.resolveSlidesNumber();
    }

    Lenta.prototype.resolveSlidesNumber = function() {
      if (this.checkIfMoreItemsIsNeed().is) {
        this.createMoreFrameItems();
        return;
      }
    }

    Lenta.prototype.startMove = function(delay) {
      var self = this;

      this.startTimerId = setTimeout(function() {
        self.moveLenta();
        self.transitionendHandler();

        self.timerId = setInterval(function() {
          self.moveLenta();
          self.transitionendHandler();
        }, self.config.duration + self.config.silence + 200);
      }, delay);
    }

    Lenta.prototype.stopLenta = function() {
      clearTimeout(this.startTimerId);
      clearInterval(this.timerId);
    }

    Lenta.prototype.moveLenta = function() {
      this.setTransform(this.config.duration, this.config.easing);
      var currentOffset = Math.abs(+this.sliderFrame.style[this.transformProperty].slice(11, -3));

      this.setTranslate(currentOffset + this.frameItemWidth);
    }

    Lenta.prototype.setTransform = function(ms, ease) {
      this.sliderFrame.style.webkitTransition = 'transform ' + ms + 'ms ' + ease;
      this.sliderFrame.style.transition = 'transform ' + ms + 'ms ' + ease;
    }

    Lenta.prototype.setTranslate  = function(dist) {
      this.sliderFrame.style[this.transformProperty] = 'translateX(-' + dist + 'px)';
      this.sliderFrame.style['-ms-' + this.transformProperty] = 'translateX(-' + dist + 'px)';
      this.sliderFrame.style['-mos-' + this.transformProperty] = 'translateX(-' + dist + 'px)';
    }

    Lenta.prototype.transitionendHandler = function(event) {
      ++Lenta.transitionendHandlerCounter;

      if (Lenta.transitionendHandlerCounter === 2) {
        Lenta.transitionendHandlerCounter = 0;
        this.loopItems();
      }
    }

    Lenta.transitionendHandlerCounter = 0;

    Lenta.prototype.loopItems = function() {
      var firstItem = this.selector.querySelector('.lenta__inner').firstElementChild;
      var parent = this.selector.querySelector('.lenta__inner');

      parent.appendChild(firstItem);
      this.setTransform(0, this.config.easing);

      this.setTranslate(0);
      this.config.onChange.call(this);
    }

    Lenta.prototype.mouseenterHandler = function() {
      this.stopLenta();
    }

    Lenta.prototype.mouseleaveHandler = function() {
      this.startMove(200);
    }

    Lenta.prototype.createFrameItem = function(imgDiv) {
      var elementContainer = document.createElement('div');
      var img = document.createElement('img');
      var visibleContainer = document.createElement('div');
      var src = imgDiv.getAttribute('data-src');
      img.src = src;
      img.className = 'lenta__img';
      elementContainer.className = 'lenta__frame';
      visibleContainer.className = 'lenta__img-visible'
      visibleContainer.style.backgroundImage = 'url(' + src +')';
      this.imgErrorHandler(img, visibleContainer);
      elementContainer.appendChild(img);
      elementContainer.appendChild(visibleContainer);

      return elementContainer;
    }

    Lenta.prototype.imgErrorHandler = function(img, visibleContainer) {
      var src = 'img/image-error.jpg'
      img.onerror = function(event) {
        img.src = src;
        visibleContainer.style.backgroundImage = 'url(' + src +')';
      }
    }

    Lenta.prototype.createMoreFrameItems = function() {
      var count = this.checkIfMoreItemsIsNeed().count;
      var innerElementsLendth = this.checkIfMoreItemsIsNeed().innerElementsLendth;
      var items = this.rezerv.splice(0, count);

      this.sliderFrame.style.width = this.frameItemWidth * (innerElementsLendth + count) + (this.frameItemWidth * 10) + 'px';

      var docFragment = document.createDocumentFragment();

      items.forEach(function(item) {
         docFragment.appendChild(this.createFrameItem(item));
      }, this);

      this.sliderFrame.appendChild(docFragment);

      this.setInitState();
    }

    Lenta.prototype.setInitState = function() {
      if (!this.initState) {
        this.config.onInit.call(this);
        this.initState = true;
        this.selector.style.visibility = 'visible';
        this.startMove(this.config.delay);
      }
    }

    Lenta.prototype.checkIfMoreItemsIsNeed = function() {
      var innerElementsLendth = this.selector.querySelector('.lenta__inner').children.length;
      var count = (this.selector.offsetWidth - (this.frameItemWidth * innerElementsLendth)) / this.frameItemWidth + 3;

      return {
        count: parseInt(count),
        innerElementsLendth: innerElementsLendth,
        is: count > 1
      }
    }

    Lenta.prototype.createRezerv = function () {
      var count = 100 / this.innerElements.length;
      var rezerv = [];

      for (var i = 0; i < count; i++) {
        rezerv = rezerv.concat(this.innerElements);
      }

      this.rezerv = rezerv;
    }

    Lenta.prototype.resizeHandler = function() {
      this.resolveSlidesNumber();
    }

    window.Lenta = Lenta;
  }());

  var lenta = new Lenta({
    duration: 500,  // скорость движения слайдов
    silence: 1700,  // время между движение слайдов
    delay: 1500,    // задержка начала движения после загрузки страницы
    onInit: function() {
      console.log('init');
    },
    onChange: function() {
      console.log('onChange');
    }
  });
}
