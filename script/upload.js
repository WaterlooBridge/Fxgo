
var imgInfo = {};

var updateImg = {idCard: {img: [], fail: [0, 0], resId:['#id-card-front', '#id-card-back'], tips:['#tip-card-front', '#tip-card-back']},
				passport: {resId:'#passport-update-img'}, 
				residence: {resId:'#residence-update-img'}};
var type = 2;
var auditType = 0;
$('.residence-wrap').hide();
var proofIsShow = false;
$('body').i18n();

if (!localStorage.upload && !isDisabled) {
  localStorage.upload = true;
  var lang = isNativeVersion ? 's90' : 's28';
  $('body').dialog({
    template: '<div data-lang="'+ lang +'" class="first-entry-update"></div>'
  }).data('pandafeDialog')
}

// 切换护照
$('#passport').on('click', function () {
  type = 1
  if ($('#passport i').hasClass('radio-active')) {
    return false
  }
  $('#passport i').removeClass('radio-i').addClass('radio-active')
  $('#id-card i').removeClass('radio-active').addClass('radio-i')
  $('#id-card-update').hide()
  $('#passport-update').show()
})
// 切换id卡
$('#id-card').on('click', function () {
  type = 2
  if ($('#id-card i').hasClass('radio-active')) {
    return false
  }
  $('#id-card i').removeClass('radio-i').addClass('radio-active')
  $('#passport i').removeClass('radio-active').addClass('radio-i')
  $('#passport-update').hide()
  $('#id-card-update').show()
})
// 上传id卡正面
$('#id-card-front').on('click', function () {
  imgInfo.type = 1
  imgInfo.name = 'idCard'
  imgInfo.img = 0
  imgInfo.auditType = 0
  if (inject && inject.openGallery) {
    inject.openGallery()
  }
})
// 上传id反面
$('#id-card-back').on('click', function () {
  imgInfo.type = 1
  imgInfo.name = 'idCard'
  imgInfo.img = 1
  imgInfo.auditType = 0
  if (inject && inject.openGallery) {
    inject.openGallery()
  }
})
//上传id卡正面 人工审核
$('#tip-card-front .btn-upload').on('click', function () {
	imgInfo.type = 1
	imgInfo.name = 'idCard'
	imgInfo.img = 0
	imgInfo.auditType = 1
	if (inject && inject.openGallery) {
		inject.openGallery()
	}
})
//上传id卡反面 人工审核
$('#tip-card-back .btn-upload').on('click', function () {
	imgInfo.type = 1
	imgInfo.name = 'idCard'
	imgInfo.img = 1
	imgInfo.auditType = 1
	if (inject && inject.openGallery) {
		inject.openGallery()
	}
})
// 上传护照
$('#passport-update-img').on('click', function () {
  imgInfo.type = 1
  imgInfo.name = 'passport'
  if (inject && inject.openGallery) {
    inject.openGallery()
  }
})

// 上传住宅
$('#residence-update').on('click', function () {
  imgInfo.type = 2
  imgInfo.name = 'residence'
  if (inject && inject.openGallery) {
    inject.openGallery()
  }
})
// 上一步
$('#previous').on('click', function () {
  location.href = './index.html' + location.search + '&previous=true'
})

function getImgUrl (code, url) {
  if (code == '1') {
    if (imgInfo.name == 'idCard') {
      updateImg.idCard.img[imgInfo.img] = url;
      updateImg.idCard.type = 1;
      [$('#id-card-front'), $('#id-card-back')][imgInfo.img].html('<img class="updateimg" src="'+url+'"/>').addClass('update-img-fiex');

    }
    if (imgInfo.name == 'passport') {
      updateImg.passport.img = url
      updateImg.passport.type = 1
      $('#passport-update-img').html('<img class="updateimg" src="'+url+'"/>').addClass('update-img-fiex')
    }
    if(imgInfo.name == 'residence') {
      updateImg.residence.img = url
      updateImg.residence.type = 2
      $('#residence-update-img').html('<img class="updateimg" src="'+url+'"/>').addClass('update-img-fiex')
    }
  }

  verification()
}

function handleImg (base64Str) {
	if (imgInfo.name == 'idCard') {
		uploadImg(base64Str, updateImg.idCard, 1, true, imgInfo.auditType);
    } else if (imgInfo.name == 'passport'){
		uploadImg(base64Str, updateImg.passport, 2);
	} else if (imgInfo.name == 'residence') {
		uploadImg(base64Str, updateImg.residence, 2);
	}
	
}

function uploadImg (base64Str, imgObj, type, isArray, auditTypeParam) {
	if(isArray) {
		loading(imgObj.resId[imgInfo.img]);
	} else {
		loading(imgObj.resId);
	}
	$.ajax({
		url: domain + '/user/profile/upload/v2',
		type: "POST",
		dataType: "json",
		data: {
			t: (new Date()).valueOf(),
			userId: userId,
			tradeToken: tk,
			language: ajaxLanguage,
			baseStr: base64Str,
			type: type,
			auditType: auditTypeParam, //0 自动审核 1人工审核
			cardDirection: imgInfo.img, //身份证方向 0=正面，1=反面
			sufix: '.jpg'
		},
		success: function (result) {
			console.log(result);
			if (result.success) {
				if(isArray){
					auditType = auditTypeParam;
					imgObj.img[imgInfo.img] = result.data.pic;
					imgObj.type = 1;
					$(imgObj.resId[imgInfo.img])
						.html('<img class="updateimg" style="background-image:url(data:image/png;base64,'+base64Str+')"/>');
				} else {
					imgObj.img = result.data.pic;
					imgObj.type = type;
					$(imgObj.resId).html('<img class="updateimg" style="background-image:url(data:image/png;base64,'+base64Str+')"/>');
				}
				verification();
			} else {
				if (isArray) {
					$(imgObj.resId[imgInfo.img])
						.html('<div class=\'loading\'><div class=\'upload-fail\'>' + result.errorInfo + '</div></div>').i18n();
					if(++imgObj.fail[imgInfo.img] > 1)
						$(imgObj.tips[imgInfo.img]).show();
				} else {
					$(imgObj.resId)
						.html('<div class=\'loading\'><div data-lang=\'s39\' class=\'upload-fail\'></div></div>').i18n();
				}
			}
		}
	})
}

$.ajax({
  url: domain + '/user/profile/contact/select/jsonp',
  type: "POST",
  dataType : "jsonp",
  data: {
    t: (new Date()).valueOf(),
    userId: userId,
    tradeToken: tk,
    language: ajaxLanguage,
  },
  success: function (result) {
    if(result.success) {
      proofIsShow = result.data.proofIsShow
      if (proofIsShow) {
        $('.residence-wrap').show()
      }
      if (result.data.cardType == 2) {
        $('#id-card').click()
      }
      if(result.data.proofResidencePic && proofIsShow) {
        $('#residence-update-img').html('<img class="updateimg" style="background-image:url('+result.data.proofResidencePic+')"/>')
        updateImg.residence.img = result.data.proofResidencePic
      }
      if(result.data.cardType == 1 && result.data.cardPic1) {
        updateImg.passport.img = result.data.cardPic1
        $('#passport-update-img').html('<img class="updateimg" style="background-image:url('+result.data.cardPic1+')"/>')
      }
      if(result.data.cardType == 2 && result.data.cardPic1) {
        updateImg.idCard.img[0] = result.data.cardPic1
        $('#id-card-front').html('<img class="updateimg" style="background-image:url('+result.data.cardPic1+')"/>')
      }
      if(result.data.cardType == 2 && result.data.cardPic2) {
        updateImg.idCard.img[1] = result.data.cardPic2
        $('#id-card-back').html('<img class="updateimg" style="background-image:url('+result.data.cardPic2+')"/>')
      }
      verification()
    } else {
      if (result.errorCode == 00019 && inject && inject.getNativeTk) {
        inject.getNativeTk()
      } else {
        errorDialog(result.errorInfo)
      }
    }
  }
});

$(function () {
  $('#credentials-details').i18nDialog(function () {
    $('body').dialog({
      template: '<div class="uoload-credentials-details">'
      +'<p data-lang="s47" class="credentials-details-title"></p>'
      +'<img src="./images/credentials.jpg" />'
      +'<div data-lang="s48" class="credentials-details-contant"></div>'
      +'</div>',
    }).data('pandafeDialog')
  })

  $('#residence-details').i18nDialog(function () {
    $('body').dialog({
      template: '<div class="uoload-credentials-details">'
      +'<p data-lang="s45" class="credentials-details-title"></p>'
      +'<img src="./images/residence.jpg" />'
      +'<div data-lang="s46" class="credentials-details-contant"></div>'
      +'</div>',
    }).data('pandafeDialog')
  })
})

// 是否审核成功
if (isDisabled) {
  $('.next').hide()
  $('.previous').addClass('is-disabled')
  $('#passport-update-img').off('click');
  $('#id-card-back').off('click');
  $('#id-card-front').off('click');
  $('#residence-update').off('click');
}

function submit () {
  $.ajax({
    url: domain + '/user/profile/contact/update/jsonp',
    type: "POST",
    dataType : "jsonp",
    data: {
      t: (new Date()).valueOf(),
      userId: userId,
      tradeToken: tk,
      cardType: type,
      cardPic1: type === 1 ? updateImg.passport.img : updateImg.idCard.img[0],
      cardPic2: updateImg.idCard.img[1],
      proofResidencePic: updateImg.residence.img + '' === 'true' ? null : updateImg.residence.img,
	  auditType: auditType 
    },
    success: function (result) {
      if(result.success) {
        location.href = './questionnaire.html' + location.search
      } else {
        if (result.errorCode == 00019 && inject && inject.getNativeTk) {
          inject.getNativeTk()
        } else {
          errorDialog(result.errorInfo)
        }
      }
    }
  });
}

$('#next').on('click', function () {
  if ($(this).hasClass("disabled")) {
    return false
  } else {
    submit()
  } 
})



function verification () {
  if (!proofIsShow) {
    updateImg.residence.img = true
  }
  if ((updateImg.idCard.img.length == 2 || updateImg.passport.img) && updateImg.residence.img) {
    $('.next').removeClass('disabled');
  } else {
    $('.next').addClass('disabled')
  }
}
