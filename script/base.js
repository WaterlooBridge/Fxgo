var domain = "http://m.zyxwxm.com/";
//select 效果
var joptiondata;
$(".e-option").change(function(){
	joptiondata = $(this).find("option:selected").text();
	if(joptiondata == '请选择'){
		$(this).prev().val('').css('text-align','right');
	}else{
		$(this).prev().val(joptiondata).css('text-align','left');
	}
})

$(function(){

	$(".e-option").change();  // select 效果

	var min = 1;  // 最小值
	var max = 100; // 最大值

	$(".amount").change(function(){
		var amtVal = Number($(this).val());
		if(amtVal <= min || isNaN(amtVal)) {
			$(this).parents('.count-sm').find('.plus').removeClass('disable');
			$(this).val(min);
			$(this).parents('.count-sm').find('.minus').addClass('disable');
		} else if(amtVal >= max) {
			$(this).parents('.count-sm').find('.minus').removeClass('disable');
			$(this).val(max);
			$(this).parents('.count-sm').find('.plus').addClass('disable');
		} else {
			$(this).val(Math.round(amtVal));
			$(this).parents('.count-sm').find('.minus').removeClass('disable');
			$(this).parents('.count-sm').find('.plus').removeClass('disable');
		}
	})

	$(".amount").each(function () {
		$(this).change();
	})


	// 减
  $(".minus").click(function(){
		$(this).parents('.count-sm').find('.plus').removeClass('disable');
		// 屏蔽双击选中
  	$(this).attr("onselectstart","return false").css("-moz-user-select","none");
    var nums = $(this).parents('.count-sm').find(".amount");
    numsval = parseInt(nums.val());
		if(numsval <= min){
			return false;
		}else{
			numsval = numsval-1;
			nums.val(numsval);
			chooseNum = numsval;
		}

		if(numsval <= min) {
			$(this).addClass('disable');
		}
      updateRiceNum(numsval);
  });

  // 加
  $(".plus").click(function(){
		$(this).parents('.count-sm').find('.minus').removeClass('disable');
		// 屏蔽双击选中
		$(this).attr("onselectstart","return false").css("-moz-user-select","none");
    var nums = $(this).parents('.count-sm').find(".amount");
    numsval = parseInt(nums.val());
    if(numsval < max ) {
			numsval ++;
			nums.val(numsval);
			chooseNum = numsval;
		}
		if(numsval >= max) {
			$(this).addClass('disable');
		}

      updateRiceNum(numsval);
  });

})
function getRequest() {
	var url = window.location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			//就是这句的问题
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
			//之前用了unescape()
			//才会出现乱码
		}
	}
	return theRequest;
}
function replaceParamVal(paramName,replaceWith) {
	var oUrl = window.location.search;
	var re=eval('/('+ paramName+'=)([^&]*)/gi');
	var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
	return nUrl;
}

function replaceParamVal(paramName) {
	var oUrl = window.location.search;
	var re=eval('/('+ paramName+'=)([^&]*)/gi');
	var nUrl = oUrl.replace(re,"");
	return nUrl;
}

function updateRiceNum(numsval) {

    $("#rice_price").html(numsval * 100);

}
