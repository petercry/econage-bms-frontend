/* eslint-disable */
const EcoUtil = function () {

};

EcoUtil.callBackFuncObj = {};
EcoUtil.addCallBackDialogFunc = (func,key) => {
    if (key) {
          EcoUtil.callBackFuncObj[key] = func;
    } else {
          EcoUtil.callBackFuncObj['ECO_DEFAULT'] = func;
    }
    //let oldCallBackDialogFunc = window.callBackDialogFunc;
    if (typeof window.callBackDialogFunc != 'function') {
          window.callBackDialogFunc = func;
    } else {
          window.callBackDialogFunc = function (obj) {
               Object.keys(EcoUtil.callBackFuncObj).forEach(function (key) {
                      EcoUtil.callBackFuncObj[key](obj);
               });
              // func(obj);
          }
    }
};

EcoUtil.addCkCallBack = (name)=> {
    // console.log('调用ckeditor 回写');
    let ckeditorCB = function (obj) {
       if (obj && obj.action == 'saveMyWorkflowCKAction') { // 我发起的流程回写
            for (var i = 0; i < obj.data.length; i++) {
                  let _data = obj.data[i];
                  let _html = "<a class='wfLink' onclick=contentBodyAction('showWorkFlow','" + _data.id + "')>" + _data.name + '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
                  CKEDITOR.instances[name].insertHtml(_html);
            }
        } else if (obj && obj.action == 'saveMyProcessflowCKAction') {// 我经办的流程回写
            for (var i = 0; i < obj.data.length; i++) {
                let _data = obj.data[i];
                let _html = "<a class='wfLink' onclick=contentBodyAction('showWorkFlow','" + _data.id + "')>" + _data.name + '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
                CKEDITOR.instances[name].insertHtml(_html);
            }
        } else if (obj && obj.action == 'saveMyDbflowCKAction') {// 待办流程的回写
            for (var i = 0; i < obj.data.length; i++) {
                let _data = obj.data[i];
                let _html = "<a class='wfLink' onclick=contentBodyAction('showWorkFlow','" + _data.requestId + "')>" + _data.name + '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
                CKEDITOR.instances[name].insertHtml(_html);
            }
        } else if (obj && obj.action == 'saveKnowledgeCKAction') {
            for (var i = 0; i < obj.data.length; i++) {
                let _data = obj.data[i];
                if (_data.type && _data.type != 'FOLDER') {
                    let _html = "<a class='wfLink' onclick=contentBodyAction('showKnowledge','" + _data.reqId + "','" + _data.id + "')>" + _data.title + '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
                    CKEDITOR.instances[name].insertHtml(_html);
                }
            }
        }
    }
    EcoUtil.addCallBackDialogFunc(ckeditorCB,'CKEDITOR' + name);
}


EcoUtil.toggleClass = (element, className)=>{
  if (!element || !className) {
      return;
  }
  element.className = className;
}


EcoUtil.setEcoCookie = (name,value)=>{
    let Days = 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString();
}

/*
EcoUtil.getEcoCookie = (name)=>{
    let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
*/
EcoUtil.getEcoCookie = (Name)=>{
				   let search = Name + '='
           console.log('获取cookie');
           console.log(document.cookie);
				   if (document.cookie.length > 0) {
				      let offset = document.cookie.indexOf(search)
				      if (offset != -1) {
				         offset += search.length
				         end = document.cookie.indexOf(';', offset)
				         if (end == -1) {
end = document.cookie.length
}
				         return unescape(document.cookie.substring(offset, end))
				      } else {
return ''
}
				   }
}


EcoUtil.delEcoCookie = (name)=>{
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = EcoUtil.getEcoCookie(name);
    if (cval != null) {
document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
}
}


EcoUtil.isDOMElement = (obj) => {
        return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));
}

EcoUtil.languageCookieToVue = (val) =>{
    let lang = val;
    if (lang == 'cn') {
lang = 'zh-CN'
} //中文
    else if (lang == 'jp') {
lang = 'ja'
} //日文
    return lang;
}

EcoUtil.languageVueToCookie = (val) =>{
    let lang = val;
    if (lang == 'zh-CN') {
lang = 'cn'
} //中文
    else if (lang == 'ja') {
lang = 'jp'
} //日文
    return lang;
}

EcoUtil.getSysvm = () =>{
    return window.parent.window.sysvm;
}


EcoUtil.objDeepCopy = (source)=> {
    if (source == null) {
        return null;
    }
  //  let sourceCopy = source instanceof Array ? [] : {};
    let sourceCopy = Array.isArray(source) ? [] : {};
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? EcoUtil.objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

EcoUtil.parseFloat = (v1)=>{
    let _v1 = 0;
    try {
        _v1 = parseFloat(v1);
        if (_v1.toString() == 'NaN') {
            _v1 = 0;
        }
    } catch (e) {}
    return _v1;
}


EcoUtil.addFloat = (v1,v2)=>{
    let re = 0;
    let _v1 = 0;
    let _v2 = 0;
    try {
        _v1 = parseFloat(v1);
        if (_v1.toString() == 'NaN') {
            _v1 = 0;
        }
    } catch (e) {}
    try {
         _v2 = parseFloat(v2);

         if (_v2.toString() == 'NaN') {
            _v2 = 0;
        }
    } catch (e) {}
    try {
        re = _v1 + _v2;
    } catch (e) {}
    return re;
}

EcoUtil.DX = (_numberValue)=> { //小写转大写
	 let numberValue = _numberValue;
	 let index_ = (numberValue + '').indexOf(',',0);
	 if (index_ > -1) {
		    numberValue = Number(numberValue.replace(/\,/g,''));
	 } else {
		    numberValue = Number(numberValue);
	 }
	 if (isNaN(numberValue)) {
		alert('请检查小写金额是否正确');
		return '';
	 }

    numberValue = new String(Math.round(numberValue * 100));
    let chineseValue = '';
	let String1 = '零壹贰叁肆伍陆柒捌玖';
	let String2 = '万仟佰拾亿仟佰拾万仟佰拾元角分';
	let len = numberValue.length;
	let Ch1;
	let Ch2;
	let nZero = 0;
	let String3;
	if (len > 15) {
		alert('超出计算范围');
		return '';
	}
	if (numberValue == 0) {
		chineseValue = '零元整';
		return chineseValue;
	}

	String2 = String2.substr(String2.length - len, len);
	for (let i = 0; i < len; i++) {
		String3 = parseInt(numberValue.substr(i, 1),10);
		if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15) ) {
			if ( String3 == 0 ) {
				Ch1 = '';
				Ch2 = '';
				nZero = nZero + 1;
			} else if ( String3 != 0 && nZero != 0 ) {
				Ch1 = '零' + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		} else {
			if ( String3 != 0 && nZero != 0 ) {
				Ch1 = '零' + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if ( String3 != 0 && nZero == 0 ) {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if ( String3 == 0 && nZero >= 3 ) {
				Ch1 = '';
				Ch2 = '';
				nZero = nZero + 1;
			} else {
				Ch1 = '';
				Ch2 = String2.substr(i, 1);
				nZero = nZero + 1;
			}
			if ( i == (len - 11) || i == (len - 3)) {
				Ch2 = String2.substr(i, 1);
			}
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	}
	if ( String3 == 0 ) {
		chineseValue = chineseValue + '整';
	}
	return chineseValue;
}


// EcoUtil.isNumber =  (value)=> {
//     if(value === "" ||value === 'undefined'){
//       return false;
//     }
//     if(value == 0){
//        return true;
//     }
//     var patrn = /^(-)?\d+(\.\d+)?$/;
//     if (patrn.exec(value) == null || value == "") {
//         return false
//     } else {
//         return true
//     }
// }


EcoUtil.isNumber = (value,type)=> {
    if (value == '' || value == null) {
        return true;
    }
    if (value === 'undefined') {
        return false;
    }
    if (value == 0) {
        return true;
    }

    let patrn = /^[-]?\d*(\.)?\d*$/g;
    if (type == 1) { //整数
        patrn = /^[-]?\d*$/g;
    } else if (type == 2) {
        patrn = /^\+?[1-9][0-9]*$/g
    }

    if (patrn.exec(value) == null || value == '') {
        return false
    } else {
        return true
    }
}


// EcoUtil.loadXML = (xmlFile) =>{
//     let  xmlDoc = null ;
//     // 判断浏览器的类型
//     // 支持IE浏览器
//      if ( ! window.DOMParser  &&  window.ActiveXObject){
//         let  xmlDomVersions  =  [ ' MSXML.2.DOMDocument.6.0 ' , ' MSXML.2.DOMDocument.3.0 ' , ' Microsoft.XMLDOM ' ];
//         for ( let  i = 0 ;i < xmlDomVersions.length;i ++ ){
//             try {
//                  xmlDoc  =   new  ActiveXObject(xmlDomVersions[i]);
//                 break ;
//             } catch (e){ }
//         }
//     }
//     // 支持Mozilla浏览器
//     else   if (document.implementation  &&  document.implementation.createDocument){
//              try {
//                  /*  document.implementation.createDocument('','',null); 方法的三个参数说明
//                  * 第一个参数是包含文档所使用的命名空间URI的字符串；
//                  * 第二个参数是包含文档根元素名称的字符串；
//                  * 第三个参数是要创建的文档类型（也称为doctype）
//                   */
//                 xmlDoc  =  document.implementation.createDocument( '' , '' , null );
//             } catch (e){}
//         }
//          else {
//              return   null ;
//         }

//          if (xmlDoc != null ){
//             xmlDoc.async  =   false ;
//             xmlDoc.load(xmlFile);
//         }
//          return  xmlDoc;
// }


EcoUtil.loadXML = (xmlString)=>{
    let xmlDoc = null;
    // 判断浏览器的类型
    // 支持IE浏览器
    if ( !window.DOMParser && window.ActiveXObject) { // window.DOMParser 判断是否是非ie浏览器
        let xmlDomVersions = [ ' MSXML.2.DOMDocument.6.0 ' , ' MSXML.2.DOMDocument.3.0 ' , ' Microsoft.XMLDOM ' ];
        for ( let i = 0; i < xmlDomVersions.length; i++ ) {
            try {
               xmlDoc = new ActiveXObject(xmlDomVersions[i]);
               xmlDoc.async = false;
               xmlDoc.loadXML(xmlString); // loadXML方法载入xml字符串
                break;
           } catch (e) {
           }
       }
   }
    // 支持Mozilla浏览器
    else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
        try {
            /*  DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
            * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
            * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
            * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
             */
           let domParser = new DOMParser();
           xmlDoc = domParser.parseFromString(xmlString,'text/xml');
       } catch (e) {
           console.log(e);
       }
   } else {
        return null;
   }

    return xmlDoc;
},

EcoUtil.getUID = ()=>{
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16|0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


EcoUtil.getFileSize = (fileByte)=>{
    let fileSizeByte = fileByte;
    let fileSizeMsg = '';
    if (fileSizeByte < 1048576) {
fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + 'KB';
} else if (fileSizeByte == 1048576) {
fileSizeMsg = '1MB';
} else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) {
fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + 'MB';
} else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) {
fileSizeMsg = '1GB';
} else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) {
fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
} else {
fileSizeMsg = '文件超过1TB';
}
    return fileSizeMsg;
}


EcoUtil.SectionToChinese = (section)=>{
    let chnNumChar = ['零','一','二','三','四','五','六','七','八','九'];
    let chnUnitSection = ['','万','亿','万亿','亿亿'];
    let chnUnitChar = ['','十','百','千'];

    let strIns = '', chnStr = '';
    let unitPos = 0;
    let zero = true;

    while (section > 0) {
        let v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }

        unitPos++;
        section = Math.floor(section / 10);
    }

    return chnStr;
}


EcoUtil.NumberToChinese = (num)=>{
            let chnNumChar = ['零','一','二','三','四','五','六','七','八','九'];
            let chnUnitSection = ['','万','亿','万亿','亿亿'];
            let chnUnitChar = ['','十','百','千'];
			let unitPos = 0;
			let strIns = '', chnStr = '';
            let needZero = false;

			if (num === 0) {
			    return chnNumChar[0];
			}

            while (num > 0) {
			        let section = num % 10000;
			        if (needZero) {
			            chnStr = chnNumChar[0] + chnStr;
			        }

                    strIns = EcoUtil.SectionToChinese(section);
                    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
			        chnStr = strIns + chnStr;
			        needZero = (section < 1000) && (section > 0);
			        num = Math.floor(num / 10000);
			        unitPos++;
              }

			  return chnStr;
}


EcoUtil.PrefixInteger = (num, length)=>{
    return (Array(length).join('0') + num).slice(-length);
}
EcoUtil.filterSpecialCode = (str) =>{
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(str) || regCn.test(str)) {
        return false;
    }
    return true;
}
EcoUtil.filterSpecialCodeFix = (str) =>{
    let regEn = /[`~!@#$%^&*+<>?{}\/;'[\]]/im,
    regCn = /[·！#￥；‘、|《。》？、【】[\]]/im;
    if (regEn.test(str) || regCn.test(str)) {
        return false;
    }
    return true;
}

EcoUtil.deleteAttrInObject = (data,attrs) =>{
    let array = ['createDate','createUser','modDate','modUser'];
    if (typeof data != 'object') {
return data;
}
    if (attrs instanceof Array) {
        array = array.concat(attrs);
    } else if (typeof attrs == 'string') {
        array = array.concat(attrs.split(','));
    }
    for (let i = 0; i < array.length; i++) {
        if (data.hasOwnProperty(array[i])) {
            delete data[array[i]];
        }
    }
    return data;
}
//获取url中的参数
EcoUtil.url2json = (url) =>{
    let index = -1,
        str = '',
        arr = [],
        length = 0,
        res = {};
    if (url.indexOf('?') != -1) {
        index = url.indexOf('?');
        str = url.substring(index + 1);
        arr = str.split('&');
        length = arr.length;
        for (let i = 0; i < length; i++) {
            res[arr[i].split('=')[0]] = arr[i].split('=')[1];
        }
    } else {
        res = {};
    }
    return res;
}
//校验请求地址
EcoUtil.requestCheckByWhiteList = (url) => {
    //不需要带header的请求地址
    let baseUrl = '';
    if (window.sysSetting && window.sysSetting.baseUrl) {
        baseUrl = window.sysSetting.baseUrl;
    } else if (window.parent.sysSetting && window.parent.sysSetting.baseUrl) {
        baseUrl = window.parent.sysSetting.baseUrl;
    } else {
        baseUrl = '/api'
    }
    const whiteList = [
        baseUrl + '/public/setting/union',
        baseUrl + '/login/sso/edd'
    ]
    return whiteList.indexOf(url) == -1
}
EcoUtil.IsPC = ()=>{
    let userAgentInfo = navigator.userAgent;
    let Agents = ['Android', 'iPhone','SymbianOS', 'Windows Phone','iPad', 'iPod'];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}


EcoUtil.getBaseUrl = ()=>{
    let baseUrl = '';
    if (window.sysSetting && window.sysSetting.baseUrl) {
        baseUrl = window.sysSetting.baseUrl || '/api';
    } else if (window.parent.sysSetting && window.parent.sysSetting.baseUrl) {
        baseUrl = window.parent.sysSetting.baseUrl || '/api';
    } else {
        baseUrl = '/api'
    }
    return baseUrl;
}

EcoUtil.getNGRootUrl = ()=>{
    let ngrootUrl = '';
    if (window.sysSetting && window.sysSetting.ngrootUrl) {
        ngrootUrl = window.sysSetting.ngrootUrl || '';
    } else if (window.parent.sysSetting && window.parent.sysSetting.ngrootUrl) {
        ngrootUrl = window.parent.sysSetting.ngrootUrl || '';
    } else {
        ngrootUrl = ''
    }
    return ngrootUrl;
}


EcoUtil.beforeAjaxDoAction = ()=>{
    /*刷新系统访问时间*/
    try {
        if (window.parent) {
            window.parent.window.visitServerTime = new Date().getTime();
        }
    } catch (e) { }
}


EcoUtil.getOrgPathFilter = (orgPathName,maxOrgPathLevel)=>{
    if (orgPathName) {
        if (maxOrgPathLevel == 0) {
            return orgPathName;
        } else if (maxOrgPathLevel && maxOrgPathLevel != 0) {
            maxOrgPathLevel = maxOrgPathLevel - 1;
            let _orgPathArray = orgPathName.split('-');
            let _length = _orgPathArray.length;
            let _startLength = (_length <= maxOrgPathLevel) ? 0 : ( _length - (maxOrgPathLevel + 1));
            let _reOrgPathArray = [];
            for (let i = _startLength; i < _length; i++) {
                _reOrgPathArray.push(_orgPathArray[i]);
            }
            return _reOrgPathArray.join('-');
        } else {
            return orgPathName;
        }
    } else {
        return '';
    }
}


EcoUtil.formatNumberThousandthPercentile  = (num) =>{
    // return (num+ '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
    num = num + '';
    if (!num.includes('.')) {
        num += '.'
    }
    return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ',';
    }).replace(/\.$/, '');

}


EcoUtil.dynamicLoading = {
    css: function(path,callback,action){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        if(typeof(callback)!="undefined"){
            if(link.readyState){
                link.onreadystatechange=function(){
                    if(link.readyState == "loaded" || link.readyState == "complete"){
                        link.onreadystatechange=null;
                        callback();
                    }
                }
            }else{
                link.onload=function(){
                    callback();
                }
            }
        }
        link.href = path;
        if(action == 'before'){
            head.insertBefore(link,head.childNodes[0]);
        }else{
            head.appendChild(link);
        }
    },
    js: function(path){
      if(!path || path.length === 0){
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.src = path;
      script.type = 'text/javascript';
      head.appendChild(script);
    }
}
EcoUtil.getFileTypeIcon = (fileType) => {
    if (fileType === 'doc' || fileType === 'docx') {
        return 'icon-word';
    } else if (fileType === 'png' || fileType === 'jpg' || fileType === 'bmp' || fileType === 'gif') {
        return 'icon-img';
    } else if (fileType === 'exl' || fileType === 'exls') {
        return 'icon-excel';
    } else if (fileType === 'ppt' || fileType === 'pptx') {
        return 'icon-ppt';
    } else if (fileType === 'pdf') {
        return 'icon-pdf';
    } else if (fileType === 'txt') {
        return 'icon-text';
    } else if (fileType === 'zip' || fileType === 'rar') {
        return 'icon-zip';
    } else if (fileType === 'mp4' || fileType === 'wmv' || fileType === 'rm' || fileType === 'rmvb' || fileType === 'mov' || fileType === 'avi' || fileType === 'flv') {
        return 'icon-video';
    } else if (fileType === 'mp3' || fileType === 'ram' || fileType === 'wav' || fileType === 'au') {
        return 'icon-video';
    } else {
        return 'icon-default';
    }
}

EcoUtil.chcekFormat =  (value,type) => {

    if(type == 'mail'){
        let _reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(_reg.test(value)){
            return {status:0,msg:'邮箱格式正确'};
        }else{
            return {status:1,msg:'邮箱格式错误'};
        }
    }else if(type == 'cardID'){
        let _reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(_reg.test(value)){
            return {status:0,msg:'身份证号码格式正确'};
        }else{
            return {status:1,msg:'身份证号码格式错误'};
        }
    }else if(type == 'mobilePhone'){
        let _reg = /^1\d{10}$/;
        if(_reg.test(value)){
            return {status:0,msg:'手机号码格式正确'};
        }else{
            return {status:1,msg:'手机号码格式错误'};
        }
    }else if(type == 'workPhone'){
        let _reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if(_reg.test(value)){
            return {status:0,msg:'座机号码格式正确'};
        }else{
            return {status:1,msg:'座机号码格式错误'};
        }
    }else if(type == 'zipCode'){
        let _reg = /^[1-9][0-9]{5}$/;
        if(_reg.test(value)){
            return {status:0,msg:'邮政编码格式正确'};
        }else{
            return {status:1,msg:'邮政编码格式错误'};
        }
    }

    return {status:0}

}



export default EcoUtil;
export { EcoUtil };
