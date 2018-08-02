var href = window.location.href;
var inject = window.inject;
function urlParam(name) {
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(href);
  if(!results || results.length <= 1) {
    return "";
  }
  return results[1] || 0;
};

// var userId = urlParam("userId") || 27
var userId = urlParam("userId") || 205703
// var tk = urlParam("tradeToken") || 'aa2fea89-c630-42b7-aa7d-c69d56430ebd'
var tk = urlParam("tradeToken") || 'f928ce4f-9d1a-442a-ae2b-a79905e13cd7'
var isDisabled = urlParam('status') === '1'
var isPreview = urlParam('preview') === '1'
var step = urlParam('step') || 0
//var domain = 'http://m-fxgo.cp1h.com'
var domain = 'http://m.bravely.cn'
//var hostname = 'http://static-fxgo.cp1h.com/profile'
var hostname = 'http://static.bravely.cn/profile'
var isNativeVersion = urlParam('isNativeVersion') == '1'
var language = 'zh-cn'
var languageSplit = language.split('-')
var ajaxLanguage = languageSplit[0] + '-' + languageSplit[1].toUpperCase()

function getTk(tradeToken) {
  tk = tradeToken
}