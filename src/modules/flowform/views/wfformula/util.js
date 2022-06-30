import { Message } from 'element-ui';
const message = Message;
let regxMap = {
	text: /^.*$/,
	number: /^-?(0|([1-9]\d*)?)(\.\d*)?$/,
	int: /^-?(0|([1-9]\d*))?$/,
	pint: /^([1-9]\d*)?$/,
	url: /^(http|https|ftp)\:(\/{2})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
};
//校验defaultText 如果当前defaultText的值不符合当前所选格式，则清空，如果符合格式那么判断末尾是否有.去掉.
export let validDefaultTextValue4Number = (format, val) => {
	if (!regxMap[format].test(val)) {
		return '';
	} else {
		while (val[val.length - 1] === '.') {
			val = val.substring(0, val.length - 1);
		}
		return val;
	}
};
let validNormal = (format, val) => {
	return regxMap[format].test(val);
};
let validFuncMap = {
	number: validDefaultTextValue4Number,
	int: validDefaultTextValue4Number,
	pint: validDefaultTextValue4Number,
	url: validNormal
};
export let validDefaultTextValueHandler = (format, val) => {
	val && (val = val.trim());
	return validFuncMap[format].call(null, format, val);
};
/**
  @param formula  //方法名称
  c_name : key
  @param  value  //输入光标前面节点的参数
  @param obj //输入内容 {type:3,value:""} 点击符号{type:"4",value:"+-"} {type:5,value:"()"} 或是dom {type:"2",value:{id:dom.id,name:dom.name}}
  @return 
  value
*/
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
}; 
export let errorValue=(value,obj,rightvalue)=>{
    let formula=value.formula
    console.log(value,obj,rightvalue)
    if(value.outside==1){
        message["error"]("操作错误") 
        return false
    }
    if(value.outside==3){
        if(obj.type==4 && (value.formula=="SUM" ||  value.formula=="CALCULATE" || value.formula=="DAYS" || value.formula=="HOURS" || value.formula=='YEARS')){
            return true
        }else if(rightvalue && rightvalue.formula=="CALCULATE"){
            return true
        }else{ 
            message["error"]("操作错误") 
        return false
        }
    }
    if(value.type==4 && obj.type==1 && (obj.formula=="SUM" ||  obj.formula=="CALCULATE" || obj.formula=="DAYS" || obj.formula=="HOURS" || obj.formula=='YEARS')){
        return true
    }
    switch(formula){
        case "CALCULATE":   
        if(obj.type==1){
            if((value.outside==2 || value.type==4 || value.value=="(") && (obj.formula=="SUM" ||  obj.formula=="CALCULATE" || obj.formula=="DAYS" || obj.formula=="HOURS" || obj.formula=='YEARS')){
                return true
            }else{
                message["error"]("输入错误") 
                return false 
            }
        }
        if(obj.type==3){
            if(isNaN(obj.value)){
                message["error"]("输入错误") 
               return false 
            }
        }
        if(value.value=="(" ){
            switch(obj.type){
                case 4 :
                message["error"]("输入错误") 
                return false
                break; 
                case 5 :
                if(obj.value==")"){
                    message["error"]("输入错误")  
                    return false
                }
                break;
                case 3 :
                if(isNaN(obj.value)){
                    message["error"]("输入错误") 
                    return false
                }
                break;
            }
            return true
        }
        if(value.value==")"){
            switch(obj.type){
                case 3 :
                    message["error"]("输入错误")  
                    return false
                break;
                case 5 :
                if(obj.value=="("){
                    message["error"]("输入错误") 
                    return false
                }
                break;
                case 2 :
                message["error"]("输入错误")  
                return false
                break;
            }
            return true
        }
        if(value.type==3 ){
            if(obj.type==4){
                return true
            }else   if(obj.type==5 && obj.value==")"){
                return true
            }else{
                message["error"]("输入错误") 
                return false
            }
            
        }
        if(value.type==4){
            if(obj.type==3 || obj.type==2){
                return true
            }else if(obj.type==5 && obj.value=="("){
                return true
            }else{
                message["error"]("输入错误") 
                return false
            }
        }
        if(value.type==2){
            if(obj.type==4){
                return true
            }else if(obj.type==5 && obj.value==")"){
                return true
            }else{
                message["error"]("输入错误") 
                return false 
            }
        }
        break;
        case "SUM":
            if(value.outside==2 || value.type==6 ){
               if(obj.type==2){
                return true
            }else if(obj.type==3){
                if(!isNaN(obj.value)){
                    return true
                }else{
                    message["error"]("输入错误") 
                return false
                }
            }else if(obj.type==1){
                if(obj.formula=="CALCULATE" || obj.formula=="SUM" ||obj.formula=="DAYS" || obj.formula=="HOURS" || obj.formula=='YEARS' ){
                     return true 
                }else{
                    message["error"]("输入错误") 
                    return false
                }
            }
            }else {
                message["error"]("输入错误") 
                return false
            }
        break;
        case "CONCATENATE":
            if(value.outside==2 || value.type==6 ){
                return true
            }else{  
                message["error"]("输入错误") 
                return false
            }
        break;
        case "RMBUPPER" :
            if(!value.outside){
                message["error"]("该函数只能输入一个参数") 
                return false
            }
            if(value.outside==2){
                if(obj.type==2 ){
                    return  true
                }else if(obj.type==3){
                    if(isNaN(obj.value)){
                        message["error"]("输入错误") 
                        return false
                    }else{
                        let num=obj.value.split(".")
                        if(!num[1] || num[1].length<=4 ){
                            return true
                        }else{
                            message["error"]("最多保留四位小数") 
                            return false 
                        }
                    }
                }else{
                    message["error"]("输入错误") 
                    return false
                }
            }
        break ;
        case "DAYS" :
            if(obj.type==1){ 
                message["error"]("输入错误") 
                return false
            }else if(isDateString(obj.value)){
                return true
            }else{
                message["error"]("日期格式错误") 
                return false
            }
        break;
        case "HOURS" :
            if(obj.type==1){ 
                message["error"]("输入错误") 
                return false
            }else if(isDateTime(obj.value)){
                return true
            }else{
                message["error"]("日期格式错误") 
                return false
            }
        break;
        case 'YEARS':
            if(obj.type==1){
                message["error"]("输入错误") 
                return false
            }
            break
        case 'DATEDELTA':
            console.log(obj)
            if(obj.type==3){
                console.log(validDefaultTextValue4Number('int',obj.value.toString()))
                if(validDefaultTextValue4Number('int',obj.value.toString())){
                   return true 
                }else{
                    message["error"]("输入错误") 
                    return false
                }
            }else if(obj.type==1){
                message["error"]("输入错误") 
                return false
            }
            break;

    }

}
export let   isDateString= (sDate)=>{      
    var mp=/\d{4}-\d{2}-\d{2}/; 
    var matchArray = sDate.match(mp);     
    if (matchArray==null) return false;      
    var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31];     
    var iaDate = new Array(3);     
    var year, month, day;             
    iaDate = sDate.split("-");          
    year = parseFloat(iaDate[0])      
    month = parseFloat(iaDate[1])      
    day=parseFloat(iaDate[2])       
    if (year < 1900 || year > 2100) return false;       
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29  
    if (month < 1 || month > 12) return false;       
    if (day < 1 || day > iaMonthDays[month - 1]) return false;  
    return true;   
    }  
export let   isDateTime= (sDate)=>{      
        var mp=/^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/; 
        var r = sDate.match(mp);     
        //console.log(r)
        if(r==null)return false;
        r[2]=r[2]-1;
        var d= new Date(r[0]);
        if(d.getFullYear()!=r[1])return false;
        if(d.getMonth()!=r[2])return false;
        if(d.getDate()!=r[3])return false;
        if(d.getHours()!=r[4])return false;
        if(d.getMinutes()!=r[5])return false;
        return true;   
    }
export  let   initExpression = (arrExpression)=> { 
         //将中缀表达式转换为前缀表达式  
        var priority = {  
            'x': 2,  
            '÷': 2,  
            '+': 1,  
            '-': 1  
        }   
        var s1 = [], s2 = [], operator =(o)=> {  
            var last = s1[s1.length - 1];  
            if (s1.length == 0 || last == ')') {  
                s1.push(o);  
            } else if (priority[o] >= priority[last]) {  
                s1.push(o);  
            } else {  
                s2.push(s1.pop());  
                operator(o);  
            }  
        };  
        let getExpression= (arrExpression)=>{  
            s1.length = 0;  
            s2.length = 0;  
            for (var i = arrExpression.length - 1, o; i >= 0; i--) {  
                o = arrExpression[i]  
                if (!isNaN(o)) {  
                    s2.push(parseFloat(o));  
                } else {  
                    if (o == '+' || o == '-' || o == 'x' || o == '÷') {//运算符  
                        operator(o)  
                    } else {//括号  
                        if (o == ')') {//右括号  
                            s1.push(o)  
                        } else {//左括号  
                            var s = s1.pop();  
                            while (s != ')') {  
                                s2.push(s);  
                                s = s1.pop();  
                            }  
                        }  
                    }  
                }  
            }  
            if (s1.length > 0) {    
                while (s1[0] != undefined) {  
                    s2.push(s1.pop())  
                }  
            }  
            s1.length = 0;  
            return s2.slice();  
        }  
        return getExpression(arrExpression)
    }
export let  computeExpression = (prefixExpression)=> { 
    //计算前缀表达式 
    var s1 = [], result;  
    let getResult= (prefixExpression)=> {  
        s1.length = 0;  
        //计算  
        while (prefixExpression.length > 0) {  
            var o = prefixExpression.shift();  
            if (!isNaN(o)) {  
                s1.push(o);  
            } else {  
                switch (o) {  
                    case '+':  
                    {  
                        result = s1.pop() + s1.pop();  
                        break;  
                    }  
                    case '-':  
                    {  
                        result = s1.pop() - s1.pop();  
                        break;  
                    }  
                    case 'x':  
                    {  
                        result = s1.pop() * s1.pop();  
                        break;  
                    }  
                    case '÷':  
                    {  
                        result = s1.pop() / s1.pop();  
                        break;  
                    }  
                }  
                s1.push(result);  
            }  
            ////console.log(s2,s1)  
        }  
        return s1[0];  
    }  
    return getResult(prefixExpression)
}
//公式绑定 
export let changeFormula =(options,type)=>{
    let _this=options
    let {instance ,choseList} =_this.state 
    if(type){
        if(choseList.length>0){
            let liststr=JSON.stringify({formula:choseList})
            instance.defaultText=liststr 
        }else{
            instance.defaultText=""
        }
    _this.setState(preState=>preState,()=>{
        _this.props.onformulaChange &&  _this.props.onformulaChange.call(null,type)
    })
    }else{
        _this.props.onformulaChange && _this.props.onformulaChange.call(null,type)        
    }
}
const uniGuidFactory = () => {
    let uniMap = {};
    return () => {
      let guidVal = (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16)
                    .substring(1);
      while (uniMap[guidVal]) {
        guidVal = (((1 + Math.random()) * 0x10000) | 0)
          .toString(16)
          .substring(1);
      }
      uniMap[guidVal] = true;
      return guidVal;
    };
  };
export const guid = uniGuidFactory();