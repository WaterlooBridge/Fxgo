var messages = langMessages[language.toLowerCase()]
if (!messages) {
  messages = langMessages['en-us']
}

$.fn.i18n = function () {
  if (this.jquery) {
    this.hide()
    this.find('[data-lang]').add(this).each(function () {
      var lang = this.dataset.lang
      if (lang) {
        var message = messages[lang]
        if (this.tagName === 'INPUT') {
          this.setAttribute('placeholder', message)
        } else {
          $(this).html(message)
        }
      }
    })
    this.show()
  }
  return this
}

$.extend({
  i18n: function (msgId) {
    return messages[msgId] || '?'
  }
})

$.fn.setValue = function (value) {
  if (this.jquery && value) {
    this.html(messages[this.data('lang')].replace(/&value&/, '<span>' + value + '</span>'))
  }
  return this
}

$.fn.linkI18n = function (url) {
  var lang = messages[this.data('lang')].replace(/<br\/>/g, '')
  var lestIndex = lang.indexOf('(')
  var fastIndex = lang.indexOf(')')
  var splic = lang.substring(lestIndex, fastIndex + 1)
  var strArr = lang.split(splic)
  var html = ''
  for (var i = 0; i < strArr.length; i++) {
    html += strArr[i]
  }
  this.html(html.replace('[', '<a href='+ url +'>').replace(']', '</a>'))
  return this
}

$.fn.i18nInject = function () {
  var lang = messages[this.data('lang')]
  this.html(messages[this.data('lang')].replace(/<br\/>/g, ''))
  $('.inject-url').attr('href', false).removeAttr('href');

  return this
}

$.fn.i18nDialog = function (callback, id) {
  $(this).on('click', function () {
    callback()
  })
  var lang = messages[this.data('lang')].replace(/<br\/>/g, '').replace('[', '<a>').replace(']', '</a>')
  this.html(lang)
  return this
}
