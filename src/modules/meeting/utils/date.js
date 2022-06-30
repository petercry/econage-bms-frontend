// 获取当日所在一周数组
function getWeekDay(time) {
  let dateString =formatDate(time);//当天的日期，例如2020-2-28
  let presentDate = new Date(dateString);
  let today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7;
  return Array.from(new Array(7), function (val, index) {
    return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000));
  });
}

// 获取当日所在一月的数组
function createMonthDay(year,month) {
    let daysOfMonth = []
    month = month > 9 ? parseInt(month, 10) : '0' + parseInt(month, 10) 
    const lastDayOfMonth = new Date(year,month,0).getDate();
    for(let i = 1;i <= lastDayOfMonth; i++) {
        if(i < 10) {
            daysOfMonth.push(year + '-' + month + '-' + '0' + i);
        } else {
            daysOfMonth.push(year+ '-'+month + '-' + i)
        }
    } 
    return daysOfMonth;
}

// 格式化日期
function formatDate(date) {
  date = new Date(date);
  let myyear = date.getFullYear();
  let mymonth = date.getMonth() + 1;
  let myweekday = date.getDate();
  mymonth < 10 ? mymonth = "0" + mymonth : mymonth;
  myweekday < 10 ? myweekday = "0" + myweekday : myweekday;
  return `${myyear}-${mymonth}-${myweekday}`;
}
export { getWeekDay,formatDate,createMonthDay}
