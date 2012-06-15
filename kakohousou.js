

// Debug 用出力
// console.log("ERROR: {1} {2}", "a", "b") => show "ERROR: a b" to log
var __debug__ = false;
var console = function(){
  if (! __debug__) {
    return {log: function(){}}; // dummy console
  } else {
    return {
      log: function(){ $('log').innerHTML = strformat.apply(null,arguments); },
    };
  }
}();

// DOM要素の所得
function $(id)
{
  return document.getElementById(id);
}

// 文字列連結 strjoin("A","B","C") => "ABC"
function strjoin()
{
  return [].slice.apply(arguments).join("");
}

// 文字列書式 strformat("Hello {1}", "test") => "Hello test"
function strformat()
{
  var args = arguments;
  return args[0].replace(/\{(\d+)\}/g, function(matched,index){
    return args[Number(index)];
  });
}

// 辞書から query-string 生成
function make_query_string(params)
{
  // TODO: encode
  var result = [];
  for (var key in params) {
    result.push([key,params[key]].join("="));
  }
  return result.join("&");
}

function loadVideo(url, autoplay)
{
  swfobject.embedSWF(
      strjoin(url,"&rel=1&border=0&fs=1&autoplay=",(autoplay?"1":"0")),
      'video-player',
      '290', '250',
      '9.0.0', false, false,
      {allowfullscreen: 'true'});
}

function loadPage(start)
{
  var url = "http://gdata.youtube.com/feeds/api/videos/-/NINJAM?";
  var params = {
        orderby: "published",
        author: "nakajimayuusuke",
        alt: "jsonc",
        format: "5",
        v: "2", // API version
        callback: "showResults"
    };
    params["max-results"] = "10";
    params["start-index"] = start;

  var element = document.createElement("script");
  element.type = "text/javascript";
  element.src = url + make_query_string(params);
  document.body.appendChild(element);

  console.log("request {1}", start);
}

// タイトルの日付を固定幅で表示する
function fix_title_fixed_date(title)
{
  var space = "&nbsp;";
  var empty = "";

  return title.replace(/\s*(\d+)月(\s*\d+)日/, function(matched,month,day){
    return strjoin("&shy;<wbr/>",
        space, (month.length == 1 ? space:empty), month, "月",
        space, (day.length == 1 ? space:empty), day, "日"
    );
  });
}

function make_anchor(href, title)
{
  return strformat('<a href="{1}">{2}</a>', href, title);
}

function showResults(response)
{
  // TODO: error if response.error exists

  var html = [];
  var data = response.data;
  var items = data.items;

  for (var i in items) {
    var item = items[i];
    var title = fix_title_fixed_date(item.title);
    var playerUrl = item.content["5"];
    var videoLink = strformat("javascript:loadVideo('{1}',true)", playerUrl);
    html.push(strjoin("<li>", make_anchor(videoLink, title), "</li>"));
  }

  // load latest video (autoplay=false)
  if (data.startIndex == "1") {
    loadVideo(items[0].content["5"], false);
    pager.setTotalItems(data.totalItems);
  }

  $('video-list').innerHTML = html.join('');
}

var pager = function()
{
  // private:
  var current_page = 0;
  var item_per_page = 10; // max-results
  var total_items = 100;

  function page(num) {
    if (num * item_per_page > total_items) {
      current_page = 0;
    } else if (num < 0) {
      current_page = Math.floor(total_items / item_per_page);
    } else {
      current_page = num;
    }
    var start = current_page * item_per_page + 1; // first start-index is 1
    if (start < total_items) {
      loadPage(start);
    }
    else {
      current_page = 0;
      loadPage(1);
      $('log').innerHTML = strformat("XXX: {1} {2} {3}", current_page, start, total_items);
    }
  }

  // public:
  return {
    first: function(){ page(-1); },
    prev: function(){ page(current_page+1); },
    next: function(){ page(current_page-1); },
    last: function(){ page(0); },
    latest: function(){ page(0); },
    setTotalItems: function(n){ total_items = n; },
  };
}();

window.onload = function(){
  var labels = ["first", "prev", "next", "last", "latest"];
  for (var index in labels) {
    var label = labels[index];
    $('pager-' + label).onclick = pager[label];
  }

  loadPage(1);
};
