<template>
    <div class="cirleSelect">
        <div class="user-contain">
            <div  v-on:mouseenter="setItemClose(index,true)" @mouseleave="setItemClose(index,false)" class="user-pick" v-for="(item,index) in tags" :key="index">
                <el-tooltip  effect="dark" :content=" ((item.orgId == -1 && item.roleDef)?'全局角色':item.orgPath)+(item.roleDef?' ('+item.roleDef+')':'')" placement="bottom">
                    
                    <div class="user-logo">
                        <div @click="removeTag($event,index)" class="logo-mask" v-show="item.close">
                        <i class="iconfont icon iconshanchudelete30"></i>
                        </div>
                       {{filterNameTwoW(getOrgPathFilter(item.orgPath),item.roleDef)}}
                    </div>
                </el-tooltip>
            </div>

            <div class="user-add-btn" @click="selectOrgPick">
                <i class="iconfont icon iconicon-test "></i>
            </div>
        
        </div>
    </div>
</template>
<script>
import {EcoUserPick} from '@/components/orgPick/EcoUserPick.js'
import {EcoUtil} from '@/components/util/main.js'

import axios from "axios";
import qs from "qs";

axios.interceptors.request.use(function (config) {
    if(config.url && (config.url.indexOf('/login') == -1 && config.url.indexOf('/dingding-login')== -1 )){
        config.headers['eco-auth-token'] =  sessionStorage.getItem('ecoToken');
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
let baseUrl = "";
if(window.sysSetting && window.sysSetting.baseUrl){
    baseUrl = window.sysSetting.baseUrl;
}else if(window.parent.sysSetting && window.parent.sysSetting.baseUrl){
    baseUrl = window.parent.sysSetting.baseUrl;
}else {
    baseUrl = '/api'
}
export default{
  name:'circleSelect',
   props:{
       data:String,
       multiple:Boolean,
       initOptions:{
           type:Object,
           default:function(){
               return {};
           }
       },
       initDataArray:{
           type:Array,
           default:function(){
               return [];
           }
       },
       initDataStr:{
           type:String,
           default:function(){
               return null;
           }
       },
       placeholder:String,
  },
    data(){
        return {
            tags: [],
            options:{
                selectNum:2,  //1为单选，2为多选
                selectType:'User', //Dept-User-Role-userGroup 
                maxOrgPathLevel:0, //显示的层级
                idSplit:'|'
            },
            orgRoleMap:null
        }
    },
    created(){
     
    },
    mounted(){
        this.init();
    },
   computed:{
    
   },
   methods: {
            init(){
                this.tags = [];
                this.initOptionsFunc();
                if(this.initDataStr){
                      this.initDataStrFunc(this.initDataStr);
                }
            },

            /*初始化配置信息*/
            initOptionsFunc(){
                for(let key in this.initOptions){
                    this.options[key] = this.initOptions[key];
                }
            },

            //初始化选中的数据 array
            initDataArrayFunc(initDataList){
                this.initDataFunc(initDataList);
            },

             //初始化选中的数据 str
            initDataStrFunc(initDataStr){
                    if(initDataStr){
                        let _selectInitStr = initDataStr.split(this.options.idSplit);
                        let _initDataList = [];
                        (_selectInitStr).forEach((item)=>{
                                try{
                                    let _item = JSON.parse(item);
                                    if((typeof _item) == 'string'){
                                         _initDataList.push({orgId:_item});
                                    }else if((typeof _item) == "object"){
                                         _initDataList.push(JSON.parse(item));
                                    }
                                }catch(e){
                                    console.log(e);
                                }
                                
                                if ( item.indexOf('{') == -1 ){
                                    _initDataList.push({orgId:item});
                                }
                        });
                        this.initDataFunc(_initDataList);
                    }else{
                        this.tags = [];
                    }
            },

            /*初始化*/
            initDataFunc(_initDataList){
                    if(!this.checkTags(_initDataList)){
                         this.initDataFuncDone(_initDataList);
                    }
             },


            initDataFuncDone(_initDataList){

                for(let i = 0;i<_initDataList.length;i++){
                    if(_initDataList[i].type == 'USERGROUP'){
                        if(!_initDataList[i].linkId){
                            _initDataList[i].linkId = _initDataList[i].orgId;
                        }
                    }
                }

                this.tags = [];
                let _ucValueSelected = [];
                let _ucSelectedTags = [];
                let _initOrgMap = {};
                let _that = this;
                        
                if(_initDataList && _initDataList.length > 0){
                        for(let i = 0;i<_initDataList.length;i++){
                             _initOrgMap[_initDataList[i].orgId+(_initDataList[i].role?'-'+_initDataList[i].role:'')] = _initDataList[i]; //存储已选择的数据
                        }

                        axios.post(baseUrl+'/org/tree-select/member-text-show',_initDataList,{
                                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                                traditional:true
                        }).then((response)=>{

                            for(let i = 0;i<response.data.length;i++){
                                _initDataList[i].orgText = response.data[i];
                                _initDataList[i].orgPath = response.data[i]
                            }

                          
                        
                            (_initDataList).forEach((item)=>{ //循环已选择的
                                    let _initOneItem = null;
                                    if(item.type == "USERGROUP"){
                                        _initOneItem = EcoUtil.objDeepCopy(item); //拷贝节点数据
                                        _initOneItem.orgText = item.orgText;
                                        _initOneItem.orgPath = item.orgPath;
                                    
                                    }else if(item.role && item.orgId == -1){ //全局角色组
                                        
                                        _initOneItem = {};
                                        _initOneItem.type = 'ROLE';
                                        _initOneItem.orgId = '-1';
                                        _initOneItem.linkId = '-1';
                                        _initOneItem.orgText = item.orgText;
                                        _initOneItem.orgPath = item.orgPath;
                                        _initOneItem.role = item.role;
                                        _initOneItem.roleDef =  item.orgText;
                                    
                                    }else{
                                        _initOneItem = EcoUtil.objDeepCopy(item); //拷贝节点数据
                                    }
                                                
                                    if(_initOneItem){
                                            /*如果原数据有角色，填充角色*/
                                             if(_initOrgMap[item.orgId+(item.role?'-'+item.role:'')] && _initOrgMap[item.orgId+(item.role?'-'+item.role:'')].role){
                                            
                                                try{
                                                    if(item.orgId == -1){ //全局角色
                                                        _initOneItem.roleDef = item.orgText.indexOf('(')==0?item.orgText.substring(item.orgText.indexOf('(')+1,item.orgText.length-1):item.orgText;
                                                        _initOneItem.orgText = _initOneItem.roleDef;
                                                    }else{
                                                        _initOneItem.roleDef = item.orgText.substring(item.orgText.indexOf('(')+1,item.orgText.length-1);
                                                        _initOneItem.orgText = item.orgText.substring(0,item.orgText.indexOf('('));
                                                    }
                                                }catch(e){
                                                    console.log(e);
                                                }
                                                _initOneItem.orgPath = _initOneItem.orgText;
                                            }
                                            _that.tags.push(_initOneItem);
                                     }
                            })

                          
                        });
                    }
            },


            checkTags(initDataList){
                let isSame = true;
                if(initDataList.length == this.tags.length){
                    for(let i = 0;i<initDataList.length;i++){
                        if(initDataList[i].orgId != this.tags[i].orgId){
                            isSame = false;
                            break;
                        }
                    }
                }else{
                    isSame = false;
                }
                return isSame;
            },
       
            selectOrgPick(){
                let _key = EcoUtil.getUID();
                let _keyData = {};
                _keyData.options = EcoUtil.objDeepCopy(this.options);
                _keyData.initDataList = []; 

                (this.tags).forEach((item)=>{
                    _keyData.initDataList.push({
                            linkId:item.linkId,
                            orgId:item.orgId,
                            type:item.type,
                            role:item.role
                    });
                })

             

                EcoUtil.getSysvm().setTempStore(_key,_keyData); //设置临时数据
                let that  = this;
                let callBack = function(callObj){
                    that.tags = callObj.itemArray;
                    that.emitFunc();
                   
                }
                
                EcoUserPick.searchReceiver(_key,callBack);
            },

            removeTag(e,index){
                    e.stopPropagation();
                    this.tags.splice(index, 1);
                    this.emitFunc();
            },

            
            getOrgPathFilter(orgPath){
                    if(orgPath){
                         if(this.options.maxOrgPathLevel == -1){
                            return orgPath;
                        }else{
                            let _orgPathArray = orgPath.split("-");
                            let _length = _orgPathArray.length;
                            let _startLength = (_length <= this.options.maxOrgPathLevel)?0:( _length- (this.options.maxOrgPathLevel+1));
                            let _reOrgPathArray = [];
                            for(let i = _startLength;i<_length;i++){
                                _reOrgPathArray.push(_orgPathArray[i]);
                            }
                            return _reOrgPathArray.join('-');
                        }
                    }else{
                        return '';
                    }
                   
            },

    filterNameTwoW(orgPath,roleDef){
        let _name = orgPath;
        if(roleDef){
            _name = roleDef;
        }

        let checkNick = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]","gm");
        _name = _name.replace(checkNick,'');

        if(_name && _name.length > 2){
            return _name.substring(_name.length-2);
        }else{
            return _name;
        }
    },

    setItemClose(idx,flag){
        this.$set(this.tags[idx],'close',flag);
    },

            emitFunc(){
                    let _itemArray = [];
                    let _idArray = [];
                    let _nameStr = [];
                    let _orgIdStr = [];
         
                    (this.tags).forEach((item)=>{
                            let _oneItem = {};

                            _oneItem.type = item.type ;
                            _oneItem.orgId = item.orgId;
                            _oneItem.linkId = item.linkId;
                            _oneItem.role = item.role;
                            
                            _itemArray.push(_oneItem);
                            _idArray.push(JSON.stringify(_oneItem));
                            _nameStr.push(this.getOrgPathFilter(item.orgPath || item.name));
                            _orgIdStr.push(item.orgId);
                    })
                    
                    let _data = {};
                    _data.itemArray = _itemArray;
                    _data.id = _idArray.join("|");
                    _data.name = _nameStr.join(",");
                    _data.orgId = _orgIdStr.join(",");

                
                    this.$emit('callBack',_data);
            }
  },
  watch: {

        initDataArray(newValue,oldValue){
            this.initDataArrayFunc(newValue);
        },

        initDataStr(newValue,oldValue){
            this.initDataStrFunc(newValue);
        },

        initOptions:{
            deep:true,
            handler(newValue,oldValue){
                 this.initOptionsFunc();
            }
        }
  },
  filters:{
      filterName(value){
          if(!value) return '';
          let str = value.replace(/[(|)]/g,'');
          return str.substring(str.length-2);
      }
  }
 
}
</script>
<style scoped>
.cirleSelect{
    border: 1px solid #e8e8e8;
    background-color: #fafafa;
    padding: 16px;
}
.cirleSelect::after,.cirleSelect::before{
    content: '';
    display: table;
}
.user-contain{
    width:100%;
}
.user-contain::after,.user-contain::before{
    content: '';
    display: table;
}
.user-contain::after{
    clear: both;
}
.cirleSelect .user-pick{
    float: left;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.cirleSelect .user-add-btn{
    float: left;
    height: 38px;
    width: 38px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border: 1px solid #e8e8e8;
    border-radius: 50%;
    margin-right: 8px;
    margin-bottom: 8px;
    margin-top: 8px;
    background-color: #f5f5f5;
    cursor: pointer;
}
.cirleSelect .user-add-btn .iconicon-test{
    font-size: 18px;
    color: #bebebe;
}
.cirleSelect .user-logo{
      height: 38px;
    width: 38px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #1ba5fa;
    font-size: 14px;
    color: #ffffff;
    margin-right: 8px;
    margin-bottom: 8px;
    margin-top: 8px;
    cursor: pointer;
    position: relative;
}
.cirleSelect .logo-mask{
    height: 38px;
    width: 38px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 11;
}
.cirleSelect .logo-mask .icon{
      color: #e03a3a;
    font-size: 12px;
    line-height: 12px;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    right: -2px;
    background-color: #ffffff;
}
</style>
