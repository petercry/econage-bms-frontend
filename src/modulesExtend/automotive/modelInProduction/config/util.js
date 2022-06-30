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
  initStatus(prop){
      var status =  this.formData[prop];
      var text='';
      if(prop==='deptStatus'){
          text = (this.formData.deptNameLeader||'暂无')+'-'+(this.formData.deptLeaderPerson||'暂无');
      }else if(prop=='standardRegulationStatus'){
          text = (this.formData.deptRegulationLeader||'暂无')+'-'+ (this.formData.regulationLeaderPerson||'暂无');
      }else{
        text = (this.formData.engineerDeptLeader||'暂无')+'-'+ (this.formData.engineerLeaderPerson||'暂无');
      }
      for(var key in this.$store.state.resultEnumList){
           if(key === status){
              text+=("-"+this.$store.state.resultEnumList[key]);
           }
      } 
      this.formData[prop+'Text']=text;
  },
  restData(data, type) {
    let str = '';
    if (!data) {
      return '';
    }
    if (type === 'applicable') {
      //是否适用
      this.$store.state.isApplicable.forEach((item)=>{
           if(data == item.id){
              str =  item.text;
           }
      })
    }else if(type === 'available'){
      this.$store.state.available.forEach((item)=>{
          if(data == item.id){
            str =  item.text;
          }
      })
    }else if(type === 'modelList'){
       //适用车型
        if(typeof data === 'string'){
          data = [data];
        }
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
      }else if(type==='powerList'){
        //动力类型
        if(typeof data === 'string'){
          data = [data];
        }
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
      }else if(type === 'dischargeStage'){
         //排放阶段
         this.$store.state.dischargeStageList.forEach((item)=>{
            if(data == item.id){
              str =  item.text;
            }
         })
      }else if(type==='modelName'){
        //车型名称
        this.$store.state.modelNameList.forEach((item)=>{
          if(data == item.id){
            str =  item.text;
          } 
        })
      }else if(type==='copeStatus'){
          for(var key in this.$store.state.copeStatus){
            if(key === data){
              str = this.$store.state.copeStatus[key];
            }
          }
      }else if(type==='status'){
        for(var key in this.$store.state.statusList){
          if(key === data){
            str = this.$store.state.statusList[key];
          }
        }
      }else if(type==='spotInRegulationStatus'){
        for(var key in this.$store.state.spotInRegulationStatus){
          if(key === data){
            str = this.$store.state.spotInRegulationStatus[key];
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
      } else if (type === 'standardStatus') {
        this.$store.state.standardState.forEach((item) => {
          if (item.id === data) {
            str = item.text;
          }
        })
      }else if(type === 'spotCheckStatus'){
          for(var key in this.$store.state.spotCheckStatus){
             if(key === data){
                str = this.$store.state.spotCheckStatus[key];
             }
          }
      }else if(type==='respond'){
          for(var key in this.$store.state.respondList){
              if(key === data){
                str = this.$store.state.respondList[key];
              }
          }
      }else if(type==='major'){
          this.$store.state.professionList.forEach(item=>{
             if(item.id == data){
               str=item.text;
             }
          })
      }else if(type==='accordWith'){
          for(var key in this.$store.state.dfHandlingInterfaceList){
            if(key === data){
              str = this.$store.state.dfHandlingInterfaceList[key];
            }
          }
      }
      return str;
  }



}
