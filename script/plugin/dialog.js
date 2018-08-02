$.widget('pandafe.dialog', {
  options: {
    template: '',
    controls: [],
    props: null,
    componentWillMount: function () {},
    componentDidUpdate: function () {}
  },
  _init: function () {
    var self = this
    this.options.componentWillMount()
    var $dialog = $('#' + this.id)
    $dialog.on('click', '.dialog__cancel', function () {
      self.destroy()
      $dialog.remove()
      $('body').removeClass('forbidden')
    })
    
    this.options.controls[0] && $dialog.on('click', '.dialog__verify', this.options.controls[1])

  },
  _create: function () {
    var id = this.id = Math.random().toString(32).slice(2)
    var html = []
    html.push('<div class="dialog" id="' + id + '">')
    html.push('<div class="dialog__container">')
    html.push('<div class="dialog__body">')
    html.push(this.options.template)
    html.push('</div>')
    html.push('<div class="dialog__footer">')
    html.push('<button class="dialog__cancel" style="width: '+(this.options.controls[0] ? '50%' : '100%')+'" data-lang="s'+(this.options.controls[0] ? '24' : '29')+'"></button>')
    this.options.controls[0] && html.push('<button class="dialog__verify" style="width: 50%" data-lang="'+this.options.controls[0]+'"></button>')
    html.push('</div>')
    html.push('</div>')
    html.push('</div>')
    $('body').append(html.join('')).addClass('forbidden')
    $('.dialog').i18n()
    this.options.componentDidUpdate(this.options.props, this.id)
  }
})

function errorDialog (err) {
  $('#error-dialog').html(err)
  $('#error-dialog').css('height', '40px')
  setTimeout(function () {
    $('#error-dialog').css('height', '0px')
  }, 2500)
}