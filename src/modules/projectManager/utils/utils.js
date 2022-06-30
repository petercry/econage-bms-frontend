export const getApiBaseUrl = () => {
    //在项目卡片下 走不同的接口地址
   if(window.location.hash.indexOf('templatesCard') > -1){
       return '/extend/faw/pm-model';
   }else if(window.location.hash.indexOf('projectCard') > -1){
       return '/extend/faw/pm';
   }else{
       return '/extend/faw/pm-base';
   }
}
