
//let beforeUrl = 'http://192.168.1.140';
  let beforeUrl = 'http://localhost';

//let baseUrl = '/wh/servlet/AjaxV3Servlet';
  let baseUrl = 'http://192.168.0.15:80';

  let baseMainServerUrl = '/wh/servlet/MainServer';
//let baseMainServerUrl = beforeUrl+':9090/wh/servlet/MainServletV3TestAjaxServlet';

let rows = 30;
let sysEnv = 0; //0 测试 1 正式

export{
  rows,baseUrl,baseMainServerUrl,sysEnv
}
