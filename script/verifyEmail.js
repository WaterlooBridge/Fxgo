var email, dialogId, isEmail;

function verifyTemplate (type) {
  var html = ''
  html += '<div class="verify-email">'
    +'<p data-lang="s21" id="verifyEmailTitle"></p>'
    +'<div class="verify-input">'
      +'<input data-lang="s22" type="text">'
      +'<div class="verify-resend" data-lang="s23" id="resend-'+type+'">Resend</div>'
    +'</div>'
  +'</div>'
  return html
}

var verifyEmail = {
  template: verifyTemplate('email'),
  controls: ['s3', function (props) {
    var code = $($(this.parentNode.parentNode).find('input')[0]).val();
    $.ajax({
      dataType: 'jsonp',
      url: domain + '/user/info/email/active/jsonp',
      data: {
        t: (new Date()).valueOf(),
        userId: userId,
        language: ajaxLanguage,
        tradeToken: tk,
        email: email,
        code: code,
      },
      success: function (data) {
        if (data.success) {
          $('#' + dialogId).remove();
          $('body').removeClass('forbidden');
          $('.form__verify-button').html($.i18n('s4'))
          isEmail = true
        } else {
          if (data.errorCode == 00019 && inject && inject.getNativeTk) {
            inject.getNativeTk()
          } else {
            errorDialog(data.errorInfo)
          }
        }
      }
    })
  }],
  componentWillMount: function (cb) {
    $.ajax({
      dataType: 'jsonp',
      url: domain + '/user/info/send/active/email/jsonp',
      data: {
        userId: userId,
        language: ajaxLanguage,
        tradeToken: tk,
        email: email
      },
      success: function (data) {
        if (data.success) {
          cb && cb()
          countdown()
        } else {
          if (data.errorCode == 00019 && inject && inject.getNativeTk) {
            inject.getNativeTk()
          } else {
            errorDialog(data.errorInfo)
          }
        }
      }
    })
  },
  componentDidUpdate: function (props, id) {
    $('#verifyEmailTitle').setValue(props && props.email && props.email)
    email = props && props.email && props.email
    dialogId = id
  }
}

var timer = 60
var isCountDown = true
function countdown() {
  if (timer >= 1) {
    isCountDown = false
    timer -= 1;
    $('#resend-email').html(timer)
    setTimeout(function() {
        countdown();
    }, 1000);
  } else {
    $('#resend-email').html($.i18n('s23'))
    isCountDown = true
    timer = 60
  }
}

$(function () {
  $('body').on('click', '#resend-email', function () {
    if (!isCountDown) {
      return false
    } else {
      verifyEmail.componentWillMount(countdown)
    }
  })
})
