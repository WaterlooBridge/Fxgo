$.widget('pandafe.selectList', {
  options: {
    data: [],
    multselect: false,
    format: function (item) {return item},
    onChange: function () {},
    checkedField: 'checked'
  },
  _create: function () {
    var self =this
    var field = this.options.checkedField
    var html = []
    html.push('<ul class="select__selector">')
    html.push('</ul>')
    html.push('<ul class="select__list" style="display: none;">')
    this.options.data.forEach(function (item, index) {
      var extraClass = !!item[field] ? 'select__item-selected' : ''
      html.push('<li class="select__item '+ extraClass +'" data-index="' + index + '">')
      html.push(self.options.format(item))
      html.push('</li>')
    })
    html.push('</ul>')
    this.element.html(html.join(''))
    this.$selector = this.element.find('.select__selector')
    this.$list = this.element.find('.select__list')
    this._listenup()
    this._changeSelected()
  },
  _showList: function () {
    if (!this.element.is('.disabled')) {
      this.$list.show()
      this.$selector.hide()
      this.expand = true
      this._addCollapseListener()
    }
  },
  _hideList: function () {
    this.$list.hide()
    this.$selector.show()
    this._removeCollapseListener()
  },
  _listenup: function () {
    var self = this
    this.$selector.click(function () {
      self._showList()
    })

    this.$list.on('click', '.select__item', function (evt) {
      if (!self.options.multselect) {
        $(this).addClass('select__item-selected').siblings('.select__item-selected').removeClass('select__item-selected')
        self._hideList()
      } else {
        $(this).toggleClass('select__item-selected')
      }
      self._changeSelected()
    })

    if (this.options.multselect) {
      var self = this
    }
  },
  _addCollapseListener: function () {
    if (this.options.multselect) {
      var self = this
      $('body').on('click' + this.eventNamespace, function (evt) {
        var $target = $(evt.target)
        var id = Math.random().toString(32).slice(2)
        var oldId = $target.attr('id')
        $target.attr('id', id)
        if (self.element.find('#' + id).length === 0) {
          self._hideList()
        }
        if (oldId) {
          $target.attr('id', oldId)
        } else {
          $target.removeAttr('id')
        }
      })
    }
  },
  _removeCollapseListener: function () {
    $('body').off(this.eventNamespace)
  },
  _changeSelected: function () {
    var $items = this.$list
      .find('.select__item-selected')
      .clone()
      .removeClass()
      .addClass('selected__item')
    this.$selector.html($items)
    this.options.onChange(this.getValue())
  },
  getValue: function () {
    var self = this
    return this.$selector.find('li').map(function (index, item) {
      return self.options.data[item.dataset.index]
    }).toArray()
  }
})
