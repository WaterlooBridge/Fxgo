$.widget('pandafe.selector', {
  options: {
    title: '',
    columns: [],
    default: [],
    translate: false,
    onChange: function () {}
  },
  _default: function () {
    this.$columns = []
    this.values = []
    this.indexes = []
    this.preIndexes = []
    this.$target = null
  },
  _create: function () {
    this._default()
    var html = []
    var id = Math.random().toString(32).slice(2)
    html.push('<div class="selector" id="'+ id +'">')

    html.push('<div class="selector__controls">')
    html.push('<div class="selector__cancel" data-lang="s24"></div>')
    html.push('<div class="selector__title">'+ $.i18n(this.options.title) +'</div>')
    html.push('<div class="selector__confirm" data-lang="s20"></div>')
    html.push('</div>')

    html.push('<div class="selector__columns">')

    html.push(this._getColumnHtml())

    html.push('</div>')

    html.push('</div>')

    $('body').append($(html.join('')).i18n())

    this.$target = $('#' + id)

    this._handleEvent()
    this._initColumns()
  },
  _init: function () {
    if (this.$target) {
      this.$target.show()
      $('body').addClass('forbidden')
    }
  },
  _handleEvent: function () {
    var self = this
    this.$target.on('click', '.selector__cancel, .selector__confirm', function () {
      self.$target.hide()
      $('body').removeClass('forbidden')
      if ($(this).is('.selector__confirm')) {
        var values = self.getValues()
        self.options.onChange(values)
        self.preIndexes = $.extend([], self.indexes)
      } else {
        self.options.onChange()
        self._resetColumn()
      }
    })
  },
  _initColumns: function () {
    var self = this
    this.$columns = this.$target.find('.selector__column').map(function (index, item) {
      var column = new QfScroll({
        target: $(item),
        onChange: function (idx) {
          self.indexes[index] = idx
        },
        format: self.options.format
      })
      self.preIndexes.push(column.setData(self.options.columns[index], self.options.default[index]))
      return column
    })
  },
  _resetColumn: function () {
    var self = this
    this.$columns.each(function (index, item) {
      item.selectIndex(self.preIndexes[index])
    })
  },
  _getColumnHtml: function () {
    var html = []
    this.options.columns.forEach(function (item, index) {
      html.push('<div class="selector__column" data-index="'+ index +'"></div>')
    })
    return html.join('')
  },
  getValues: function () {
    var self = this
    return this.indexes.map(function (idx, index) {
      return self.options.columns[index][idx]
    })
  },
  setData: function (data) {
    this.options.columns = data
    this.element.find('.selector__columns').html(this._getColumnHtml())
    this._initColumns()
  }
})
