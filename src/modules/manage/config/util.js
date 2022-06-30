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

  openAttach(fileHeaderId,model,fileBodyId,wxevent){
      var options = {};
      options.location = 'no';
      window.open('/wh/jsp/mobileIonic/app/templates/app/docviewMobile_app_idocviewDo.jsp?fileHeaderId='+fileHeaderId+'&model='+model+'&fileBodyId='+fileBodyId, '_blank');
  },

  openAttachWF(id,parentId,fileName,docType,viewType,wxevent,opform){
      var options = {};
      options.location = 'no';
      window.open('/wh/jsp/mobileIonic/app/templates/app/docviewMobile_app_idocviewDo.jsp?id='+id+'&parentId='+parentId+'&fileName='+fileName+'&docType='+docType+'&viewType='+viewType, '_blank');
  }

}
