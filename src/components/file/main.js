import axios from 'axios'

const EcoFile = function() {

};
const ecoAgentTypeStorageParamName = "ecoAgentType";

EcoFile.getAgentType = () =>{
    let agentType = window.sessionStorage.getItem(ecoAgentTypeStorageParamName);
    if(!agentType){
        agentType = window.localStorage.getItem(ecoAgentTypeStorageParamName);
    }
    if(!agentType){
     //   agentType = "browser";
    }
    return agentType;
}

EcoFile.openFileHeaderByView = (fileHeaderId,fileName) => {
    try{
        let _url = "/fileManager/file_preview.html?fileHeaderId="+fileHeaderId+"&fileName="+encodeURIComponent(fileName);
        if(EcoFile.getAgentType() == "browser"){
            window.open(_url);
        }else{
            if(window.parent && window.parent.dd){
                let dd_url = (_url.indexOf('/')==0?location.origin:'')+_url+'&ddtab=true&ecoToken='+sessionStorage.getItem('ecoToken');//要打开链接的地址
                if (window.parent.dd.env.platform == "notInDingTalk") {
                    try{
                        window.parent.openLink(dd_url).then(res => {}).catch(err => {
                            window.open(_url)
                        })
                    }catch(e){
                        window.open(_url)
                    }
                }else{
                    if(window.parent.sysSetting && window.parent.sysSetting.docViewMaxDialog){
                        window.parent.window.sysvm.openMaxDialog('',_url);
                    }else{
                        window.parent.dd.biz.util.openLink({
                            url:dd_url,
                            onSuccess : function(result) { },
                            onFail : function(err) {}
                        })
                    }
                }
            }else{
              window.open(_url);
            }
        }

    }catch(e){
      console.log(e);
    }
};

EcoFile.openFileHeaderByEdit = (fileHeaderId,fileName) => {
    // try{
    //     let _url = "/fileManager/file_edit.html?fileHeaderId="+fileHeaderId+"&fileName="+encodeURIComponent(fileName);
    //     window.open(_url);
    // }catch(e){
    //   console.log(e);
    // }

    let url = "/fileManager/file_edit.html?fileHeaderId="+fileHeaderId+"&fileName="+encodeURIComponent(fileName);
    if(window.sysSetting && window.sysSetting.ngrootUrl){
        url = window.sysSetting.ngrootUrl + url;
    }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){
        url = window.parent.sysSetting.ngrootUrl + url;
    }
    let dd_url = (url.indexOf('/')==0?location.origin:'')+url+'&ddtab=true&ecoToken='+sessionStorage.getItem('ecoToken');
    if(EcoFile.getAgentType() == "browser"){
        window.open(dd_url)
    }else{
        if(window.parent && window.parent.dd){
            if (window.parent.dd.env.platform == "notInDingTalk") {

                try{
                    window.parent.openLink(dd_url).then(res => {

                    }).catch(err => {
                        window.open(url);
                    })
                }catch(e){
                    window.open(url);
                }

            }else{
                window.parent.dd.biz.util.openLink({
                    url:dd_url,//要打开链接的地址
                    onSuccess : function(result) { },
                    onFail : function(err) {alert(JSON.stringify(err))}
                })
            }
        }else{
            window.open(url);
        }
    }
};


EcoFile.openFileHeaderByDownload = (fileHeaderId,fileName) => {
    /*不用ajax下载*/
    // EcoFile.downloadFileAjax(fileHeaderId,fileName);
    // console.log("document.docviewform:" + document.docviewform.length + "##" + document.docviewform.outerHTML);
    try{
        document.docviewform.action = "/fileManager/file_download.html";
        document.docviewform.fileHeaderId.value = fileHeaderId;
        document.docviewform.fileName.value = fileName;
        document.docviewform.target = "docviewIframe";
        document.docviewform.submit();
    }catch(e){
        console.log(e);
    }
};



EcoFile.openFileHeadersByDownloadAll = (fileIds,expectedName) => {
    try{
        document.docviewform.action = "/fileManager/file_downloadAll.html";
        document.docviewform.fileHeaderIds.value = fileIds;
        document.docviewform.expectedName.value = expectedName;
        document.docviewform.target = "docviewIframe";
        document.docviewform.submit();
    }catch(e){}
};


EcoFile.openFileByPdfJs = (fileHeaderId,model) => {
    
    var token = sessionStorage.getItem("ecoToken");
    if (!token) {
        token = localStorage.getItem("ecoToken");
    }
    let baseUrl = '';
    if(window.sysSetting && window.sysSetting.baseUrl){
        baseUrl = window.sysSetting.baseUrl;
    }else if(window.parent.sysSetting && window.parent.sysSetting.baseUrl){
        baseUrl = window.parent.sysSetting.baseUrl;
    }else{
        baseUrl = "/api"
    }
    axios.get(baseUrl+"/file-manager/download-tmp-token",{
        params:{
            time:new Date().getTime()
        },
        headers:{
            'eco-auth-token':token,
        }
    }).then(res => {
        let tempToken = res.data;

        let fileUrl = encodeURIComponent(window.location.origin+baseUrl+'/file-manager/safe/download?mt-token='+tempToken+'&file-header-Id='+fileHeaderId);
        let url = "/assets/pdfjs/web/viewer.html?file="+fileUrl;
        if(window.sysSetting && window.sysSetting.ngrootUrl){
            url = window.sysSetting.ngrootUrl + "/assets/pdfjs/web/viewer.html?file="+fileUrl;
        }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){
            url = window.parent.sysSetting.ngrootUrl + "/assets/pdfjs/web/viewer.html?file="+fileUrl;
        }else{

        }
        let is_window_open = false;
        if(window.sysSetting && window.sysSetting.hasOwnProperty('fileWindowOpen')){
            is_window_open = window.sysSetting.fileWindowOpen;
        }else if(window.parent.sysSetting && window.parent.sysSetting.hasOwnProperty('fileWindowOpen')){
            is_window_open = window.parent.sysSetting.fileWindowOpen;
        }
        let dd_url = (url.indexOf('/')==0?location.origin:'')+url+'&ddtab=true&ecoToken='+sessionStorage.getItem('ecoToken');
      
        if(is_window_open || EcoFile.getAgentType() == "browser"){
            window.open(url)
        }else{
            if(window.parent && window.parent.dd){
                if (window.parent.dd.env.platform == "notInDingTalk") {
                    try{
                        window.parent.openLink(dd_url).then(res => {}).catch(err => {
                            window.open(url)
                        })
                    }catch(e){
                        window.open(url)
                    }

                }else{

                    window.parent.dd.biz.util.openLink({
                        url:dd_url,
                        onSuccess : function(result) { },
                        onFail : function(err) {}
                    })
                }
            }else{
                window.open(url)
            }
        }


    });
};
/*签章*/
EcoFile.onFileBySignature = (fileHeaderId,fileName,modelInnerId) => {
    var token = sessionStorage.getItem("ecoToken");
    if (!token) {
        token = localStorage.getItem("ecoToken");
    }
    let baseUrl = '';
    if(window.sysSetting && window.sysSetting.baseUrl){
        baseUrl = window.sysSetting.baseUrl;
    }else if(window.parent.sysSetting && window.parent.sysSetting.baseUrl){
        baseUrl = window.parent.sysSetting.baseUrl;
    }else{
        baseUrl = "/api"
    }
    axios.get(baseUrl+"/file-manager/download-tmp-token",{
        params:{
            time:new Date().getTime()
        },
        headers:{
            'eco-auth-token':token,
        }
    }).then(res => {
        let tempToken = res.data;
        let fileUrl = encodeURIComponent(window.location.origin+baseUrl+'/file-manager/safe/download?mt-token='+tempToken+'&file-header-Id='+fileHeaderId);
        
        let url = "/assets/pdfjsSignature/viewer.html?fileHeaderId="+fileHeaderId+"&fileName="+encodeURIComponent(fileName);
        if(window.sysSetting && window.sysSetting.ngrootUrl){
            url = window.sysSetting.ngrootUrl + "/assets/pdfjsSignature/viewer.html?&fileHeaderId="+fileHeaderId+"&fileName="+encodeURIComponent(fileName);
        }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){
            url = window.parent.sysSetting.ngrootUrl + "/assets/pdfjsSignature/viewer.html?fileHeaderId="+fileHeaderId+"&fileName="+encodeURIComponent(fileName);
        }else{

        }

       
        let is_window_open = true;
        if(window.sysSetting && window.sysSetting.hasOwnProperty('fileWindowOpen')){
            is_window_open = window.sysSetting.fileWindowOpen;
        }else if(window.parent.sysSetting && window.parent.sysSetting.hasOwnProperty('fileWindowOpen')){
            is_window_open = window.parent.sysSetting.fileWindowOpen;
        }
        let dd_url = (url.indexOf('/')==0?location.origin:'')+url+'&ddtab=true&ecoToken='+sessionStorage.getItem('ecoToken');
       
        if( (is_window_open || EcoFile.getAgentType() == "browser")){
            window.open(url);
        }else{
           
            if(window.parent && window.parent.dd){
               
                if (window.parent.dd.env.platform == "notInDingTalk") {
                    try{
                        window.parent.openLink(dd_url).then(res => {}).catch(err => {
                            window.open(url)
                        })
                    }catch(e){
                        window.open(url)
                    }
                }else{
               
                    window.parent.dd.biz.util.openLink({
                        url:dd_url,
                        onSuccess : function(result) { },
                        onFail : function(err) {}
                    })
                }
            }else{
                window.open(url)
            }
        }
    });

    return ;
    let url = "/assets/isignature/sign.html?fileId="+fileHeaderId+"&modelInnerId="+modelInnerId+"&fileName="+encodeURIComponent(fileName);
    if(window.sysSetting && window.sysSetting.ngrootUrl){
        url = window.sysSetting.ngrootUrl + url;
    }else if(window.parent.sysSetting && window.parent.sysSetting.ngrootUrl){
        url = window.parent.sysSetting.ngrootUrl + url;
    }
    let dd_url = (url.indexOf('/')==0?location.origin:'')+url+'&ddtab=true&ecoToken='+sessionStorage.getItem('ecoToken');
    let is_window_open = true;
    if(window.sysSetting && window.sysSetting.hasOwnProperty('fileWindowOpen')){
        is_window_open = window.sysSetting.fileWindowOpen;
    }else if(window.parent.sysSetting && window.parent.sysSetting.hasOwnProperty('fileWindowOpen')){
        is_window_open = window.parent.sysSetting.fileWindowOpen;
    }
    if(is_window_open || EcoFile.getAgentType() == "browser"){
        window.open(dd_url)
    }else{
        if(window.parent && window.parent.dd){
            if (window.parent.dd.env.platform == "notInDingTalk") {

                try{
                    window.parent.openLink(dd_url).then(res => {

                    }).catch(err => {

                        window.open(url,'','height=800,width=1600,status=yes,scrollbars=yes,resizable=yes');
                    })
                }catch(e){
                    window.open(url,'','height=800,width=1600,status=yes,scrollbars=yes,resizable=yes');
                }

            }else{
                window.parent.dd.biz.util.openLink({
                    url:dd_url,//要打开链接的地址
                    onSuccess : function(result) { },
                    onFail : function(err) {alert(JSON.stringify(err))}
                })
            }
        }else{
            window.open(url,'','height=800,width=1600,status=yes,scrollbars=yes,resizable=yes');
        }
    }

};

/*签章*/
EcoFile.openFileByUkeySeal = (fileHeaderId,model,uKeyBaseInfo) => {
    let fileUrl = encodeURIComponent(window.location.origin+"/wh/servlet/FileDownload?model="+model+"&fileHeaderId="+fileHeaderId);
    let url = uKeyBaseInfo.ukeySealServiceHost+"/index.html?file="+fileUrl+'&destFile='+uKeyBaseInfo.ukeySealDefaultSavePath;
    window.uKeyWindow = window.open(url,'','height=800,width=830,status=yes,scrollbars=yes,resizable=yes');
};

EcoFile.openFileByUkeyDeal = (fileHeaderId,model,uKeyBaseInfo) => {
    let fileUrl = encodeURIComponent(window.location.origin+"/wh/servlet/FileDownload?model="+model+"&fileHeaderId="+fileHeaderId);
    let url = uKeyBaseInfo.ukeySealServiceHost+"/client.html?opt=postil&file="+fileUrl+'&destFile='+uKeyBaseInfo.ukeySealDefaultSavePath;
    window.uKeyWindow = window.open(url,'','height=800,width=830,status=yes,scrollbars=yes,resizable=yes');
};

EcoFile.downloadFileAjax = (fileHeaderId,fileName) => {
        var token = sessionStorage.getItem("ecoToken");
        if (!token) {
            token = localStorage.getItem("ecoToken");
        }
        let baseUrl = '';
        if(window.sysSetting && window.sysSetting.baseUrl){
            baseUrl = window.sysSetting.baseUrl;
        }else if(window.parent.sysSetting && window.parent.sysSetting.baseUrl){
            baseUrl = window.parent.sysSetting.baseUrl;
        }else{
            baseUrl = "/api"
        }
        axios.get(baseUrl+"/file-manager/download/"+fileHeaderId,{
            params:{
                time:new Date().getTime()
            },
            headers:{
                'eco-auth-token':token,
            },
            responseType:'blob',
        }).then(res => {
            var blob = new Blob([res.data], { type: 'application/octet-stream' });
            EcoFile.downloadFile(blob, fileName);
        }).catch(e => {});
};


EcoFile.downloadFile = (blob, name)=>{
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
        return;
    }
    var WURL = window.URL || window.webkitURL;
    // 转为url:"blob:null/4b27d1aa-d7dc-4c91-a6f8-60f0a1b26134"
    var bloburl = WURL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
        //  释放对象
        WURL.revokeObjectURL(bloburl);
    } else {
        location.href = bloburl;
    }
};


EcoFile.getAuthToken = ()=>{
    var token = sessionStorage.getItem("ecoToken");
    if (!token) {
        token = localStorage.getItem("ecoToken");
    }
    return token;
};


EcoFile.getUploadFileType = ()=>{
        let _fileType = [];
        _fileType.push("doc");
        _fileType.push("docx");
        _fileType.push("xls");
        _fileType.push("xlsx");
        _fileType.push("ppt");
        _fileType.push("pptx");
        _fileType.push("pdf");
        _fileType.push("txt");
        _fileType.push("jpg");
        _fileType.push("jpeg");
        _fileType.push("gif");
        _fileType.push("png");
        _fileType.push("bmp");
        _fileType.push("tif");
        _fileType.push("zip");
        _fileType.push("rar");
        _fileType.push("tar");
        _fileType.push("7z");

        return _fileType;
};

export default EcoFile;
export { EcoFile };
