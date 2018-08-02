function QfScroll(options) {
  var _this = this;
  var divOpt = options.target

  var dataPanel = null;
  var selectedBar = null;
  var dataBar = null;

  var touchEvents = null;
  var oneHeight = 0;
  var dataList = null;
  this.curIndex = 0;

  var mY = 0;
  var dY = 0;
  var isDown = false;

  this.getValue = function() {
    return dataList[_this.curIndex];
  }

  this.format = function (data, isDefault) {
    return '<li class="selector__item' + (isDefault ? ' active' : '') + '">' + (options.format ? options.format(data, isDefault) : data) + '</li>'
  }

  this.setData = function(data, defaultValue) {
    divOpt.empty()
    _this.initTouchEvents()
    _this.initView()
    _this.addEventListener()
    dataList = data;
    var defaultIdx = 0
    for (var i = 0; i < dataList.length; i++) {
      var isDefault = dataList[i] === defaultValue
      dataPanel.append(this.format(dataList[i], isDefault))
      if (isDefault) {
        defaultIdx = i
      }
    }

    dataBar = divOpt.find('.selector__item')
    dataBar.height(divOpt.height() / 5)
    dataBar.css('line-height', divOpt.height() / 5 + 'px')
    _this.selectIndex(defaultIdx)
    return defaultIdx
  }

  this.addEventListener = function() {
    dataPanel.bind(touchEvents.start, function(event) {
      event.preventDefault()
      mY = _this.getMousePos(event).y;
      dY = dataPanel.position().top;
      isDown = true;
    })
    dataPanel.bind(touchEvents.move, function(event) {
      event.preventDefault()
      var y = _this.getMousePos(event).y;
      if (isDown) {
        _this.setTop(y - mY + dY)
      }
    })
    dataPanel.bind(touchEvents.end, function(event) {
      event.preventDefault()
      isDown = false;
      _this.setRightTop()
    })
  }

  this.setRightTop = function() {
    var topValue = dataPanel.position().top;
    if (topValue >= 0) {
      if ((topValue % oneHeight) <= (oneHeight / 2)) {
        index = -parseInt(topValue / oneHeight) + 2;
      } else {
        index = -parseInt(topValue / oneHeight) + 1;
      }
      if (topValue >= oneHeight * 2) {
        index = 0;
      }
    } else {
      if ((-topValue % oneHeight) <= (oneHeight / 2)) {
        index = parseInt(-topValue / oneHeight) + 2;
      } else {
        index = parseInt(-topValue / oneHeight) + 3;
      }
      if (topValue <= -oneHeight * (dataList.length - 3)) {
        index = dataList.length - 1;
      }

    }
    _this.selectIndex(index)
  }

  this.selectIndex = function(index) {
    if (index >= dataList.length) {
      _this.selectIndex(dataList.length - 1)
      return;
    }
    var val = oneHeight * 2 - index * oneHeight;
    _this.setTop(val)
    dataPanel.find('li:nth-child('+ (_this.curIndex + 1) + ')').removeClass('active')
    dataPanel.find('li:nth-child(' + (index + 1) + ')').addClass('active')
    _this.curIndex = index;
    options.onChange && options.onChange(index)
  }

  this.setTop = function(value) {
    dataPanel.css('top', value)
  }

  this.setWidth = function(value) {
    divOpt.css('width', value)
  }

  this.initView = function(event) {

    divOpt.html(
      '<ul class="selector__panel"></ul>' +
      '<div class="selector_selected"></div>'
    )
    dataPanel = divOpt.find('.selector__panel')
    selectedBar = divOpt.find('.selector_selected')

    divOpt.css({
      "background": "#fcfcfc",
      "display": "inline-block",
      "min-width": "100px",
      "height": "200px",
      "overflow": "hidden",
      "position": "relative",
      "z-index": "0"
    })
    dataPanel.css({
      "text-align": "center",
      "position": "absolute",
      "width": "100%",
      "top": "0",
      "left": "0",
      "font-size": "20px",
      "color": "#333",
      "z-index": "80"
    })

    selectedBar.css({
      "position": "absolute",
      "top": "40%",
      "left": "0",
      "width": "100%",
      "height": "20%",
      "border-top": "1px solid #e5e5e5",
      "border-bottom": "1px solid #e5e5e5",
      "z-index": "50"
    })
    oneHeight = divOpt.height() / 5;
  }

  this.initTouchEvents = function(event) {
    if (_this.isPC()) {
      touchEvents = {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup",
        leave: "mouseleave"
      }
    } else {
      touchEvents = {
        start: "touchstart",
        move: "touchmove",
        end: "touchend",
        leave: "mouseleave"
      }
    }
  }

  this.isPC = function(event) {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag
  }

  this.getMousePos = function(event) {
    var e = event || window.event
    var x = e.originalEvent.targetTouches[0].pageX
    var y = e.originalEvent.targetTouches[0].pageY
    return {
      'x': x,
      'y': y
    }
  }
}
