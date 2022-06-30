// import $store from '../store'
export default {
  getAttachIcon (type){
      let ext = type.toLowerCase();
      if(ext == "doc"){
          return "icon-DOC";
      }else if(ext == "docx"){
          return "icon-docx";
      }else if(ext == "exl"){
          return "icon-exl";
      }else if(ext == "exls"){
         return "icon-XLSX";
      }else if(ext == "ppt"){
        return "icon-ppt";
      }else if(ext == "pptx"){
         return "icon-pptx";
      }else if(ext == "pdf"){
        return "icon-pdf";
      }else if(ext == "txt"){
        return "icon-txt";
      }else{
        return "icon-ziyuan";
      }
  },

  filterDom(html){
      let _contentEl = document.createElement('div');
      _contentEl.innerHTML = html;
      let tags = _contentEl.getElementsByTagName('*');
      for (let i = 0; i < tags.length; i++) {
          if(tags[i].nodeName=="A"){
              let _tempHref = tags[i].getAttribute('href');
              tags[i].setAttribute('attHref',_tempHref);
              tags[i].setAttribute('href','javascript:void(0)');
          }
          tags[i].removeAttribute('style');
      }
      return _contentEl.innerHTML;
  },
  restData(data, type) {
    let str = '';
    if (!data) {
      return '';
    }
    if (type === 'status') {
      for (var key in this.$store.state.statusSet.statusMap) {
        if (data == key) {
          str = this.$store.state.statusSet.statusMap[key]
        }
      }
    } else if (type == 'actionType') {
      for (var key in this.$store.state.statusSet.actionTypeMap) {
        if (data == key) {
          str = this.$store.state.statusSet.actionTypeMap[key]
        }
      }
    } else if (type == 'category') {
        this.$store.state.typeList.forEach((item) => {
        if (item.id === data) {
          str = item.text;
        }
      })
    } else if (type === 'subCategory') {
      for(var key in this.$store.state.subClassList){
        this.$store.state.subClassList[key].forEach(item=>{
          if (item.id === data) {
            str = item.text;
          }
        })
       }
    }else if (type === 'standardStatus') {
      this.$store.state.standardState.forEach((item) => {
        if (item.id === data) {
          str = item.text;
        }
      })
    }else if(type === 'nature'){
      this.$store.state.natureList.forEach((item)=>{
         if(item.id === data){
           str = item.text;
         }
      })
    }else if(type === 'applicableType'){
      this.$store.state.vehicleList.forEach((item)=>{
        if(item.id === data){
          str = item.text;
        }
     })
    }else if(type === 'certificationTypeItems'){
      data.forEach((item,index)=>{
        this.$store.state.authenticationList.forEach((item2)=>{
            if(item===item2.id){
                if(index===0){
                  str+=item2.text;
                }else{
                  str+=('、'+item2.text); 
                }
            }
        })
      }) 
    }else if(type === 'carModelItems'){
      data.forEach((item,index)=>{
        this.$store.state.applicableModels.forEach((item2)=>{
            if(item===item2.id){
                if(index===0){
                  str+=item2.text;
                }else{
                  str+=('、'+item2.text); 
                }
            }
        })
      }) 
    }else if(type==='powerTypeItems'){
      data.forEach((item,index)=>{
        this.$store.state.powerType.forEach((item2)=>{
            if(item===item2.id){
                if(index===0){
                  str+=item2.text;
                }else{
                  str+=('、'+item2.text); 
                }
            }
        })
      })
    }else if(type==='gasFuelItems'){
      data.forEach((item,index)=>{
        this.$store.state.gasList.forEach((item2)=>{
            if(item===item2.id){
                if(index===0){
                  str+=item2.text;
                }else{
                  str+=('、'+item2.text); 
                }
            }
        })
      })
    }else if(type==='pJView'){
      if(typeof data ==='string'){
        data = data.split(',');
      }
      data.forEach((item,index)=>{
         this.$store.state.deliverable.forEach(item2=>{
            if(item===item2.id){
              if(index===0){
                str+=item2.text;
              }else{
                str+=('、'+item2.text); 
              }
            }
         })
      })
    }else if(type==='requestType'){
       this.$store.state.RegulatoryRequirementsType.forEach(item=>{
         if(data===item.id){
           str=item.text;
         }
       })
    }else if(type=='articleCategory'){
      this.$store.state.articleType.forEach(item=>{
        if(data===item.id){
          str=item.text;
        }
      })
    }else if(type=='profession'){
       this.$store.state.professionList.forEach(item=>{
        if(data===item.id){
          str=item.text;
        }
      })
    }
    return str;
  },
  getApiBaseUrl(fromPage,isEdit){
     //列表三种状态 编制 审批 完成 完成状态下修改只能走临时表(temp)
     //formPage ( organization approve finish )
     //isEdit (!=='viewCase') 查看操作正式和临时表数据一致
     return (fromPage==='finishList' && isEdit)?'/dongfeng/thinktank/structurebase/temp/':'/dongfeng/thinktank/structurebase/'
  }
}
