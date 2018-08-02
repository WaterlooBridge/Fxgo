var prev = urlParam('previous')

if (+step && +step < 3 && prev != 'true') {
  location.href = './'+['index', 'upload', 'questionnaire'][+step]+'.html' + location.search
}

var homeInfo = {}

var regExps = {
  email: /^\w+((-\w+)|(\.\w+))*\u0040[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
  phone: /^[0-9]*$/
}

var getMonth = []

for (var i = 77; i < 89; i++) {
  getMonth.push($.i18n('s'+i))
}

var checkboxArr= []
$("input[type='checkbox']").each(function (i) {
  checkboxArr.push($(this).prop('checked'))
})


$(function () {
  var $container = $('#profile')
  var countryData = null
  var gender = [{ value: 1, label: $.i18n('s74')}, { value: 2, label: $.i18n('s75')}]
  var primitiveKeys = {
    gender: function (key) {
      for (var i = 0; i < gender.length; i++) {
        if (gender[i].value === key) {
          return gender[i].label
        }
      }
    }
  }
  var profileConfig = [{
      label: 's7777',
      name: 'firstName'
    }, {
      label: 's6',
      name: 'contactTelNum'
    }, {
      label: 's9',
      name: 'gender',
      type: 'select',
      translate: true,
      columns: [gender],
      format: function (item) {return item.label},
      default: [1]
    }, {
      label: 's11',
      name: 'birth',
      type: 'date'
    }, {
      label: 's12',
      name: 'fullAddress'
    }
  ]

  if (isNativeVersion) {
    var emailIndex = profileConfig[0]
    var telIndex = profileConfig[1]
    profileConfig[0] = telIndex
    profileConfig[1] = emailIndex
  }

  function assemble () {
    var html = []
    profileConfig.forEach(function (item, index) {
      var isSelect = item.type === 'select' || item.type === 'date'
      html.push('<div class="form__element">')
      html.push('<p class="form__label" data-lang="' + item.label + '"></p>')
      html.push('<div class="form__input" data-type="' + (item.type || 'text') + '" data-index="' + index + '">')
      if (item.nodes) {
        [].push.apply(html, item.nodes || [])
      } else {
        html.push('<input type="text" name="' + item.name + '" ' + (isSelect ? 'data-lang="s10" readonly' : false) + '>')
      }
      if (isSelect) {
        html.push('<div class="form__arrow-holder"></div>')
      }
      if (item.verify) {
        html.push('<button type="button" class="form__verify-button highlight" data-lang="s3"></button>')
      }
      html.push('</div>')
      html.push('</div>')
    })
    $container.prepend($(html.join('')).i18n())
    var emailInput = isNativeVersion ? 1 : 0;
    if (isNativeVersion) {
      $('.form__verify-button').hide();
      $('.form__element').eq(9).hide();
      $('.form__element').eq(0).find('input').attr('disabled', true)
    }

    // $('.form__element').eq(emailInput).find('input').on('blur', function () {
    //   if (!regExps.email.test($(this).val())) {
    //     errorDialog($.i18n('s89'))
    //   }
    // })
  }


  function submit (url, cb) {
      $.ajax({
        dataType: 'jsonp',
        url: domain + url,
        data: {
          t: (new Date()).valueOf(),
          userId: userId,
          language: ajaxLanguage,
          tradeToken: tk,
          firstName: homeInfo.firstName,
          gender: homeInfo.gender,
          birth: homeInfo.birth,
          usCitizen: homeInfo.usCitizen,
          contactTelNum: homeInfo.contactTelNum,
          fullAddress: homeInfo.fullAddress
        }
      }).done(function (resp) {
        if (resp.success) {
          cb && cb()
        } else {
          if (resp.errorCode == 00019 && inject && inject.getNativeTk) {
            inject.getNativeTk()
          } else {
            errorDialog(resp.errorInfo)
          }
        }
      })
    }

  function fillup () {
    // 填写默认值
    $.ajax({
      dataType: 'jsonp',
      url: domain + '/user/profile/base/select/jsonp',
      data: {
        userId: userId,
        language: ajaxLanguage,
        tradeToken: tk
      }
    }).done(function (resp) {
      if (resp.success) {
        var form = $('form').get(0)
        var datas = resp.data
        if (datas && datas.emailActive == 1) {
          isEmail = true
          $('.form__verify-button').html($.i18n('s4'))
        }

        for (var key in datas) {
          var target = form[key]
          var value = datas[key]
          if (target) {
            if (primitiveKeys[key] && (value || value === 0)) {
              target.value = primitiveKeys[key](value)
            } else {
              target.value =  value
            }
            if (target.type === 'checkbox') {
              target.checked = !!value
            }
            homeInfo[key] = value
          }
        }

        verification()
      } else {
        if (resp.errorCode == 00019 && inject && inject.getNativeTk) {
          inject.getNativeTk()
        } else {
          errorDialog(resp.errorInfo)
        }
      }
    })
  }

  function listenup () {
    $container.on('click', '.form__input', function (evt) {
      var $target = $(evt.currentTarget)
      var type = $target.data('type')
      var config = profileConfig[$target.data('index')]
      // 自定义事件处理
      if (config.handler) {
        config.handler(evt, $(this))
      }

      // 普通下拉框
      if (type === 'select') {
        $target.addClass('form__input-active')
        $target.selector({
          columns: config.columns,
          format: config.format,
          default: config.default,
          title: config.label,
          translate: config.translate,
          onChange: function (values) {
            $target.removeClass('form__input-active')
            if (values) {
              $target.find('input').each(function (index, item) {
                if ($(item).attr('name') === 'gender') {
                  item.value = values[index].label
                  homeInfo.gender = values[index].value
                }
                if ($(item).attr('name') === 'countryId') {
                  item.value = values[0].countryName
                  homeInfo.countryId = values[0].countryId
                }
                // verification()
              })
            }
          }
        })
      }

      // 日期选择
      if (type === 'date') {
        $target.addClass('form__input-active')
        $target.datepicker({
          title: config.label,
          onChange: function (values) {
            $target.removeClass('form__input-active')
            var form = $('form').get(0)
            var target = form['birth']
            values[1] = getMonth.indexOf(values[1]) + 1
            target.value = values.join('-')
            homeInfo.birth = values.join('-')
            // verification()
          }
        })
      }

      // // 手机区号
      // if (type === 'tel' && $(evt.target).is("input[readonly]")) {
      //   var $region = $(evt.target)
      //   $region.addClass('form__input-active')
      //   var selector = $region.selector({
      //     title: 's5',
      //     // columns: [countryData],
      //     onChange: function (values) {
      //       $region.removeClass('form__input-active')
      //       if (values) {
      //         $region.val('+' + values[0].telCode)
      //         homeInfo.contactTelCode = '+' + values[0].telCode
      //       }
      //       // verification()
      //     },
      //     format: function (item) {
      //       return item.countryName
      //     }
      //   }).data('pandafeSelector')
      // }
      verification()
    })
  }


  $('.next').on('click', function () {
    if (!isDisabled) {
      var url = '/user/profile/base/update/jsonp'
      submit(url, function () {
        location.href = './upload.html' + location.search
      })
    } else {
      location.href = './upload.html' + location.search
    }
  })

  function getCountryInfo (cb) {
    $.ajax({
      dataType: 'jsonp',
      url: domain + '/news/api/dict/country/jsonp',
      data: {
        language: ajaxLanguage,
        tradeToken: tk
      }
    }).done(function (resp) {
      if (resp.success) {
        countryData = resp.data
        cb && cb()
      } else {
        if (resp.errorCode == 00019 && inject && inject.getNativeTk) {
          inject.getNativeTk()
        } else {
          errorDialog(resp.errorInfo)
        }
      }
    })
  }

  function getInputinfo () {
    $('body').on('input', "input[type='text']", function (){
      homeInfo[$(this).attr('name')] = $(this).val()
      verification()
    })

    $('body').on('input', "input[type='tel']", function () {
      homeInfo[$(this).attr('name')] = $(this).val()
      verification()
    })

    $('body').on('change', "input[type='checkbox']", function (){
      if ($(this).attr('name')) {
        homeInfo.usCitizen = +$(this).prop('checked')
      }
      checkboxArr = []
      $("input[type='checkbox']").each(function () {
        checkboxArr.push($(this).prop('checked'))
      })
      verification()
    })
  }

  getCountryInfo(function () {
    var index;
    for (var i = 0; i < profileConfig.length; i++) {
      if(profileConfig[i].name === 'countryId') {
        index = i
      }
    }

    // profileConfig[index].columns = [countryData]
    $('[data-lang]').i18n()
    // $('.i18n-clause').i18nInject()
    // $('.i18n-transaction').linkI18n()

    assemble()

    if (isDisabled) {
      $('input').attr('readonly', true);
      $('.next').removeAttr('disabled');
      $("input[type='checkbox']").attr('disabled', true);
    } else {
      listenup()
    }

    fillup()
    getInputinfo()

    var url = hostname + '/questionnaire.html' + (location.search || '?') + '&preview=1'
    $('.i18n-transaction').linkI18n(url);
    // $('.i18n-transaction span').attr('id', url).addClass('inject-url').attr('onclick', '');
    $('.inject-url').attr('onclick', '');
    $('body').on('click', '.inject-url', function () {
      var link = $(this).attr('id');
      if (inject && inject.injectUrl) {
        var url = '/user/profile/base/temp/save/jsonp';
        if (isDisabled) {
          inject.injectUrl(link)
        } else {
          submit(url, function () {
            inject.injectUrl(link)
          })
        }
      }
    })
    if (isDisabled) {
      $('.form__verify-button').hide()
      $('.form__arrow-holder').hide()
    }
  })


  function verification () {
    if (homeInfo.firstName &&
      checkboxArr[1] &&
      checkboxArr[2] &&
      homeInfo.gender &&
      homeInfo.contactTelNum &&
      homeInfo.birth &&
      homeInfo.fullAddress ||
      isDisabled) {
      $('.next').removeAttr('disabled')
    } else {
      $('.next').attr('disabled', true)
    }
  }

})
