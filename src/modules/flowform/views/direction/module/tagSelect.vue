<template>
    <div class="tagSelect">
        <label v-if="label">{{label}}</label>
        <div class="el-customDiv" @click="selectOrgPick">
            <div class="selectDiv">
                <span v-show="tags.length==0" class="placeholder" >{{placeholder}}</span>
                    <el-tag
                                v-for="(tag,index) in tags"
                                :key="tag.orgId"
                                closable
                                size="mini"

                                @close="removeTag($event,index)"
                                :type="tag.type">
                         {{  ((tag.orgId == -1 && tag.roleDef)?'全局角色':getOrgPathFilter(tag.orgPath|| tag.name))+ (tag.roleDef?' ('+tag.roleDef+')':'')}}
                    </el-tag>
            </div>
            <i class="iconfont icon icontongxunlu"></i>
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
  name:'tagSelect',
  props:{
       label: {
          type: String,
          default:function(){
              return '';
          }
       },
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

                if(window.sysEnv === 0){
                    EcoUserPick.searchReceiverByEnv(_key,callBack);
                }else{
                    EcoUserPick.searchReceiver(_key,callBack);
                }

               
            },

            removeTag(e,index){
                    e.stopPropagation();
                    this.tags.splice(index, 1);
                    this.emitFunc();
            },

            clearTag(){
                this.tags = [];
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
  }
}
</script>
<style scoped>
.tagSelect{
   display: inline-block;
   cursor: pointer;
}
.tagSelect .selectDiv{
    padding-right: 28px;
    display: inline-block;
    width: calc(100% - 22px);
}
.tagSelect .iconfont{
    position: absolute;
    color: #1ba5fa;
    right: 8px;
    top: 6px;
    font-size: 20px;
    line-height: 20px;
    cursor: unset;
}
.tagSelect .el-tag--mini{
    padding: 0 3px;
    line-height: 22px;
    margin-right: 3px;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fafafa;
    border-color:#e8e8e8;
    /* max-width: 150px; */
    position: relative;
    padding-right: 15px;
    
    white-space: normal;
    min-height: 22px;
    height: auto;
}
.selectDiv .placeholder{
    margin-left: 10px;
    font-size: 13px;
    display: inline-block;
    position: absolute;
    top: 0px;
}
</style>
