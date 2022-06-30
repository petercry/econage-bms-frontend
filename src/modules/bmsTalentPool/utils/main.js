let loadingTimer;
let loading;
export const openLoading = function(){
  loading = this.$loading({
    fullscreen : true,
    lock: false,
    body: false,
    text: '玩命加载中.....',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'loadingClass'
  });
  loadingTimer = setTimeout(function () {  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    closeLoading();                       // 关闭遮罩层
  },20000);
}
export const closeLoading = function(){
  try{loading.close();}catch(e){}
  window.clearTimeout(loadingTimer);
}
// 日期格式化
export const dateFormat=function(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}
