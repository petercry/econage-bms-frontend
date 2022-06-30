const EcoDate = function() {

};

EcoDate.formatSimpleDate = (date) => {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth()+1;
    let myweekday = date.getDate();
    return (mymonth + "/" + myweekday);
};

//格式化日期：yyyy-MM-dd
EcoDate.formatDateDefault = (date) => {
      let myyear = date.getFullYear();
      let mymonth = date.getMonth()+1;
      let myweekday = date.getDate();
      if(mymonth < 10){
          mymonth = "0" + mymonth;
      }
      if(myweekday < 10){
          myweekday = "0" + myweekday;
      }
      return (myyear+"-"+mymonth + "-" + myweekday);
};
// 格式化日期 yyyy-MM

//格式化日期：yyyy-MM-dd
EcoDate.formatDateDefault2 = (date) => {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth()+1;
    let myweekday = date.getDate();
    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }
    return (myyear+"/"+mymonth + "/" + myweekday);
};

//格式化日期：yyyy年MM月dd日
EcoDate.formatDateCN = (date) => {
      let myyear = date.getFullYear();
      let mymonth = date.getMonth()+1;
      let myweekday = date.getDate();
      if(mymonth < 10){
          mymonth = "0" + mymonth;
      }
      if(myweekday < 10){
          myweekday = "0" + myweekday;
      }
      return (myyear+"年"+mymonth + "月" + myweekday+"日");
};


EcoDate.formatDateCNObj = (date) => {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth()+1;
    let myweekday = date.getDate();

    var h=date.getHours();
    var m=date.getMinutes();
    var s=date.getSeconds();
    
    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }

    let _obj = {};
    _obj.dateStr = myyear+"年"+mymonth + "月" + myweekday+"日";
    _obj.timeStr = (h<=9?'0'+h:h) +":"+(m<=9?'0'+m:m) +":"+(s<=9?'0'+s:s);
    _obj.weekStr = "星期" + "日一二三四五六".charAt(date.getDay());

    return _obj;


};



//格式化日期：yyyy年MM月dd日
EcoDate.formatDateCNSimple = (date) => {
      let myyear = date.getFullYear();
      let mymonth = date.getMonth()+1;
      let myweekday = date.getDate();

      
      return (mymonth + "月" + myweekday+"日");
};


EcoDate.convertDateFromString = (dateString)=> {
    if (dateString) {
        var sdate = dateString.split('-');
        var date = new Date(sdate[0], sdate[1]-1, sdate[2]);
        return date;
    }
};

EcoDate.convertDateTimeFromString = (dateString)=> {
    if (dateString) {
        let tempStrs = dateString.split(" ");
        let dateStrs = tempStrs[0].split("-");
        let year = parseInt(dateStrs[0], 10);
        let month = parseInt(dateStrs[1], 10) - 1;
        let day = parseInt(dateStrs[2], 10);
        let timeStrs = tempStrs[1].split(":");
        let hour = parseInt(timeStrs [0], 10);
        let minute = parseInt(timeStrs[1], 10);
        let second = parseInt(timeStrs[2], 10);
        let date = new Date(year, month, day, hour, minute, second);
        return date;
    }
};

export default EcoDate;
export { EcoDate };
