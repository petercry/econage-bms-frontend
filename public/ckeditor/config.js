/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config
    config.plugins = 'dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,notification,button,toolbar,clipboard,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,copyformatting,div,resize,elementspath,enterkey,entities,popup,filetools,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastetools,pastefromgdocs,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,tableselection,undo,lineutils,widgetselection,widget,notificationaggregator,uploadwidget,uploadimage,wsc';
    config.skin = 'moono-lisa';
    config.language = 'zh-cn';
    config.uiColor = '#efefef';
  //  config.width = '98%';
  //  config.height = '300px';
    config.resize_enabled = false;
    config.filebrowserUploadUrl = '/api/file-manager/uploader/chunk/merge/ckeditor';
    config.filebrowserImageUploadUrl = '/api/file-manager/uploader/chunk/merge/ckeditor';
    config.fileTools_requestHeaders = {

      'eco-auth-token': window.EcoToken.getToken()
    };
    config.modularInnerId = "";
    config.filebrowserWindowWidth = '1024px';
    config.filebrowserWindowHeight = '768px';
    config.extraPlugins = 'jwplayer';

	config.toolbar_ScheduleOP = [ [ 'Styles', 'Format', 'Font', 'FontSize', ],
			[ 'Bold', 'Italic', 'Underline', 'StrikeThrough' ],
			[ 'Undo', 'Redo' ],
			[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull' ],
			[ 'TextColor', 'BGColor' ] ];
	config.toolbar_RSF = [ [ 'Source' ],[ 'Styles', 'Format', 'Font', 'FontSize','lineheight' ],
			[ 'Bold', 'Italic', 'Underline', 'StrikeThrough' ],
			[ 'Undo', 'Redo' ],
			[ 'Link', 'Unlink', 'Anchor' ],
			[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull' ],
			[ 'Indent', 'Outdent', 'NumberedList', 'BulletedList' ],
			[ 'TextColor', 'BGColor', '-', 'Image', 'Html5video','Table','HorizontalRule']];
	config.toolbar_RSF_MAIL = [ [ 'Source' ], [ 'Styles', 'Format', 'Font', 'FontSize' ],
			[ 'Bold', 'Italic', 'Underline', 'StrikeThrough' ],
			[ 'Undo', 'Redo' ],
			[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull' ],
			[ 'TextColor', 'BGColor' ] ];
	config.toolbar_RSF_EXT = [
			[ 'Bold', 'Italic', 'Underline', 'StrikeThrough' ],
			[ 'Undo', 'Redo' ],
			[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull' ],
			[ 'TextColor', 'BGColor' ] ];
	config.toolbar_Basic = [ [ 'Bold', 'Italic', '-', 'OrderedList',
		'UnorderedList', '-', 'Link', 'Unlink', '-' ] ];
	config.toolbar_BBS = [ [ 'Styles', 'Format', 'Font', 'FontSize','jwplayer'],
			[ 'Bold', 'Italic', 'Underline', 'StrikeThrough' ],
			[ 'Undo', 'Redo' ],
			[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull' ],
			[ 'TextColor', 'BGColor' ], [ 'Table', 'Smiley', 'Image' ] ];

	config.toolbar_FlowForm = [ [ 'Styles', 'Format', 'Font', 'FontSize','lineheight' ], [ 'Bold', 'Italic', '-', 'OrderedList',
		'UnorderedList', '-', 'Link', 'Unlink', '-', 'About' ] ];

    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
    config.removeButtons = 'Underline,Subscript,Superscript,Styles';

    //设置支持字体
    config.font_names='宋体/SimSun;仿宋/FangSong;仿宋_GB2312/FangSong_GB2312;黑体/SimHei;楷体/KaiTi;楷体_GB2312/KaiTi_GB2312;'+
		'微软雅黑/Microsoft YaHei;隶书/LiSu;幼圆/YouYuan;Arial;Arial black;'+
		'Andale mono;Comic sans ms;Helvetica;Impact;Times;Times New Roman;Verdana';

    // Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';


    // Simplify the dialog windows.
    config.removeDialogTabs = 'image:advanced;link:advanced';

    //config.filebrowserImageUploadUrl = "/HmCode/Shop/upload";//上传图片的地址
    //config.filebrowserHtml5videoUploadUrl = "/HmCode/Shop/uploads";//上传视频的地址
    // config.extraPlugins=['linkbutton','lineheight','html5video'];
    // config.extraPlugins='linkbutton';		//引入自定义组件
    config.extraPlugins='relevanceButton';
    config.extraPlugins += (config.extraPlugins ? ',lineheight' : 'lineheight');
    config.extraPlugins += (config.extraPlugins ? ',html5video' : 'html5video');
    config.extraPlugins += (config.extraPlugins ? ',selectProcessFlow' : 'selectProcessFlow');
    config.extraPlugins += (config.extraPlugins ? ',selectDbFlow' : 'selectDbFlow');
    config.extraPlugins += (config.extraPlugins ? ',selectKnowledge' : 'selectKnowledge');

    config.extraPlugins += ',image2';

    config.image_previewText = ' ';//设置图片预览默认值为' '
    config.allowedContent = true;


};
