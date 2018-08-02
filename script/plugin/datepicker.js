$.widget('pandafe.datepicker', $.pandafe.selector, {
  _default: function () {
    this._super()
    this.options.columns = this._initData()
  },
  _initData: function() {
    var maxYear = new Date().getFullYear() - 18
    var minYear = new Date().getFullYear() - 80
    var yearList = [], monthList = []
    for (var i = maxYear; i > minYear - 1; i--) {
      yearList.push(i)
    }

    for (var i = 77; i < 89; i++) {
      monthList.push($.i18n('s'+i))
    }
    return [yearList, monthList, []]
  },
  _onColumnChange: function(index, idx) {
    if (index === 1) {
      var yearScroll = this.$columns[0]
      var dayScroll = this.$columns[2]
      var daycount = new Date(
        yearScroll.getValue(),
        idx + 1,
        0
      ).getDate()
      var curIndex = dayScroll ? dayScroll.curIndex : 0
      var dayList = this.options.columns[2]

      if (daycount != dayList.length) {
        dayList = []
        for (var i = 0; i < daycount; i++) {
          dayList[i] = i + 1
        }
        this.options.columns[2] = dayList
        if (dayScroll) {
          dayScroll.setData(dayList)
          dayScroll.selectIndex(curIndex)
        }
      }
    }
  },
  _initColumns: function () {
    var self = this
    var $columns = this.$target.find('.selector__column')
    $columns.map(function (index, item) {
      var i = index
      var column = new QfScroll({
        target: $columns.eq(i),
        onChange: function (idx) {
          self.indexes[i] = idx
          self._onColumnChange(i, idx)
        },
        format: self.options.format
      })
      self.$columns[i] = column
      self.preIndexes.push(column.setData(self.options.columns[i], self.options.default[i]))
    })
  },
})
