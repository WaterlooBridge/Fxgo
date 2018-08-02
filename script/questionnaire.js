var datas = []
var datalength = 0
Array.prototype.findIndex = function (key, value) {
  var index = -1
  for (var i = 0; i < this.length; i++) {
    if (this[i][key] == value) {
      index = i
    }
  }
  return index
}
$(function () {
  $('.questionnaire__footer').i18n();
  var questions = []
  var $container = $('#profile')

  function assemble () {
    var html = []
    questions.forEach(function (item, index) {
      var isSelect = item.type === 'select'
      html.push('<div class="form__element" data-id='+ item.queId +'>')
      html.push('<p class="form__label question__header"><span class="question__num">' + (Number(index) + 1) + '.</span>' + item.queName + '</p>')
      html.push('<div class="form__select ' + (isDisabled && 'disabled') + '" data-type="' + item.optionPattern + '" data-index="' + index + '" data-id='+ item.queId +'>')
      html.push('</div>')
      html.push('</div>')
    })
    $container.prepend($(html.join('')).i18n())
      .find('.form__select')
      .map(function (index, item) {
        var data = questions[index]
        $(item).selectList({
          checkedField: 'optionSelected',
          data: data.options,
          multselect: data.optionPattern === 2,
          format: function (data) {return data.queOptionName},
          onChange: function (values) {
            var changeValue = []
            for (var i = 0; i < values.length; i++) {
              changeValue.push(values[i].queOptionId)
            }
            if (datas.findIndex('queId', data.queId) != -1) {
              datas[datas.findIndex('queId', data.queId)] = {queId: data.queId, queValue: changeValue.toString()}
            } else {
              datas.push({queId: data.queId, queValue: changeValue.toString()})
            }

            if ($(item).data('id') === 18) {
              if (values[0].queOptionCode === 'a4') {
                $('.form__element[data-id=19], .form__element[data-id=20], .form__element[data-id=21]').hide()
              } else {
                $('.form__element[data-id=19], .form__element[data-id=20], .form__element[data-id=21]').show()
              }
            }
            verification()
          }
        })
      })
  }

  $.ajax({
    url: domain + '/user/profile/question/select/jsonp',
    type: "POST",
    dataType : "jsonp",
    data: {
      userId: userId,
      tradeToken: tk,
      language: ajaxLanguage,
      queType: 2
    },
    success: function (resp) {
      if (resp.success) {
        questions = resp.data
        console.log(resp)
        assemble()
        datalength = resp.data.length
        verification()
      } else {
        if (resp.errorCode == 00019 && inject && inject.getNativeTk) {
          inject.getNativeTk()
        } else {
          errorDialog(resp.errorInfo)
        }
      }
    }
  })

  if (isDisabled) {
    $('#next').attr('data-lang', 's43').i18n()
  }

  if (isPreview) {
    $('#previous').hide()
  }

})


$('#previous').on('click', function () {
  location.href = (!isDisabled ? './upload.html' : './index.html') + location.search
})

function verification () {
  if (datas.length == datalength){
    $('#next').removeAttr('disabled')
  } else {
    $('#next').attr('disabled', true)
  }
}


$('#next').on('click', function () {
  if (isDisabled) {
    location.href = './upload.html' + location.search
  } else {
    $.ajax({
      url: domain + '/user/profile/question/update/jsonp',
      type: "POST",
      dataType : "jsonp",
      data: {
        userId: userId,
        tradeToken: tk,
        language: ajaxLanguage,
        queType: 2,
        queAndValue: JSON.stringify(datas),
        confirmType: isPreview ? undefined : 1
      },
      success: function (resp) {
        if (isPreview) {
          location.href = './index.html' + location.search.replace(/&preview=1/g, '')
        } else if (resp.success && inject && inject.injectSubmit) {
          inject.injectSubmit()
        }
        
        if (!resp.success) {
          if (resp.errorCode == 00019 && inject && inject.getNativeTk) {
            inject.getNativeTk()
          } else {
            errorDialog(resp.errorInfo)
          }
        }
      }
    })
  }
})
