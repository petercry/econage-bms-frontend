const TIMELIMIT = 300000;//过期时间
Storage.prototype.setExpire = (key, value) => {
	let obj = {
	data: value,
	time: Date.now(),
	expire: TIMELIMIT
	};
	//localStorage 设置的值不能为对象,转为json字符串
	localStorage.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getExpire = (key) => {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time >= val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
}
const EcoToken = {
    fileManager:{
        getTempToken(){
            let temptoken = localStorage.getExpire("file-manager-temptoken");
            if(!temptoken){
                this.refresh();//重新获取一遍
                return localStorage.getExpire("file-manager-temptoken");//在重新拿一遍
            }else{
                return temptoken;
            }
        },
        setTempToken(token){
            localStorage.setExpire("file-manager-temptoken",token);
        },
        refresh(){
            let that = this;
            var xhr = new XMLHttpRequest();
            xhr.open('get', "/api/file-manager/download-tmp-token", false);
            xhr.setRequestHeader("eco-auth-token", EcoToken.getToken());
            xhr.onload = function(){
                if(xhr.status == "200"){
                    that.setTempToken(xhr.response);
                }
            }
            xhr.send();
            
        },
        
    }
};
EcoToken.getToken = () => {
    let token = sessionStorage.getItem("ecoToken");
    if (!token) {
    token = localStorage.getItem("ecoToken");
    }
    return token;
}
EcoToken.fileManager.getTempToken();
export default EcoToken