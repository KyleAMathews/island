$(function(){$(".classysocial").ClassySocial();});$.meLoadingBar={show:function(name,modal){name=name||'progress_bar_animation';var div=$('#progress_bar_animation');if(div.length==0){var img='<img class="progress_bar_icon" src="/static/homepage/media/progress-bar-animation.gif" style="opacity: 0.0; position: fixed; left: 50%; top: 50%; margin-top: -10px; margin-left: -110px; z-index: 100002;"/>';if(!modal){div=$('<div id="progress_bar_animation">'+img+'</div>');}else{div=$('<div id="progress_bar_animation" style="background-color: rgba(240, 240, 240, 0); position: fixed; height: 100%; width: 100%; z-index: 100001;">'+img+'</div>');}
$('body').prepend(div);div.find('.progress_bar_icon').animate({opacity:0.9},300);}
var name_array=div.data('progress_bar_names')||[];if($.inArray(name,name_array)<0){name_array.push(name);}
div.data('progress_bar_names',name_array);return name;},isShowing:function(){return $('#progress_bar_animation').length>0;},hide:function(name){var div=$('#progress_bar_animation');if(div.length>0){name=name||'progress_bar_animation';var name_array=div.data('progress_bar_names')||[];var index=$.inArray(name,name_array);if(index>=0){name_array.splice(index,1);div.data('progress_bar_names',name_array);}
if(name_array.length==0){div.find('.progress_bar_icon').animate({opacity:0.0},300,function(){div.remove();});}}
return name;},}
$.meDialog={open:function(options){options=$.extend(true,{url:null,id:'island-dialog',title:'island',width:'500px',idBody:null,ajax:{},width:'400px',height:false,modal:{keyboard:false,backdrop:'static',},buttons:{},},options);if(options.idBody==null){options.idBody=options.id+'_body';}
$.meLoadingBar.show();if(String(options.width).indexOf('%')<0){var width=parseInt(options.width)||500;options.width=Math.min(width,$(window).width())+'px';}
options.ajax.error=$.isArray(options.ajax.error)?options.ajax.error:options.ajax.error?[options.ajax.error]:[];options.ajax.error.unshift(function(xhr,status,msg){$.meLoadingBar.hide();$.meDialog.topMessage('An error occurred loading the dialog from the server: '+msg,4000,'danger');});options.beforeShow=function(msg,status,xhr){$.meLoadingBar.hide();if(xhr.getResponseHeader('me-response-type')!=null){if(xhr.getResponseHeader('me-response-type')=='success'){$.meDialog.topMessage(msg,4000,'success');}else if(xhr.getResponseHeader('me-response-type')=='warning'){$.meDialog.topMessage(msg,4000,'warning');}else{$.meDialog.topMessage(msg,4000,'danger');}
return false;}};options.ajax.success=$.isArray(options.ajax.success)?options.ajax.success:options.ajax.success?[options.ajax.success]:[];options.ajax.success.unshift(function(){$.meLoadingBar.hide();});options.onShow=function(dlg){dlg.on('shown.bs.modal',function(){var dlgHeight=dlg.find('.modal-dialog').outerHeight(true)+24;if(dlgHeight>$(window).height()){var bodyHeight=dlg.find('.modal-body').outerHeight(true);dlg.find('.modal-body').height($(window).height()-(dlgHeight-bodyHeight));}});};$.loadmodal(options);},close:function(dialog,options){options=$.extend({delay:0,reload:false,},options);elem=$(dialog).closest('.modal');if(elem.length>0){function closeNow(){elem.modal('hide');if(options.reload){window.location.reload();}}
if(options.delay&&options.delay>0){elem.powerTimer({delay:options.delay,func:closeNow,});}else{closeNow();}}},confirm:function(title,message,buttons,width,modal_options){width=width||500;buttons=buttons||{};modal_options=$.extend(true,{keyboard:false,backdrop:'static',closeButton:false,},modal_options);var div=$(['<div class="modal fade confirm-modal">','  <div class="modal-dialog modal-lg">','    <div class="modal-content">','      <div class="modal-header">',modal_options.closeButton?'        <button class="close" data-dismiss="modal" type="button">x</button>':'','        <h4 class="modal-title">'+title+'</h4>','      </div>','      <div class="modal-body">','        <div class="modal-body-inner"></div>',!$.isEmptyObject(buttons)?'        <div class="modal-footer"></div>':'','      </div>','    </div>','  </div>','</div>',].join('\n'));div.find('.modal-body-inner').html(message);div.find('.modal-dialog').css('width',width);if(div.find('.modal-footer').length>0){var button_class='btn btn-primary';$.each(buttons,function(key,func){var button=$('<button class="'+button_class+'">'+key+'</button>');div.find('.modal-footer').append(button);button.on('click.modal-footer',function(evt){if(func){func(evt);}
div.modal('hide');});button_class='btn btn-default';});}
div.on('hidden.bs.modal',function(e){div.remove();});$('body').append(div);div.modal(modal_options);},yesno:function(title,message,yes_callback,no_callback,width){$.meDialog.confirm(title,message,{Yes:yes_callback,No:no_callback,},width);},message:function(title,message,callback,width){$.meDialog.confirm(title,message,{OK:callback,},width,{backdrop:true,keyboard:true,});},message2:function(title,message,width){$.meDialog.confirm(title,message,{},width,{backdrop:true,keyboard:true,closeButton:true,});},input:function(title,message,initial,callback,width){var content=$(['<div class="input-container">','<div class="input-message"></div>','<div class="input-control"><input type="text" /></div>','</div>',].join('\n'));content.find('.input-message').html(message);if(initial!=undefined){content.find('.input-control').find('input').val(initial);}
$.meDialog.confirm(title,content,{Submit:function(e){if(callback){callback(e,content.find('.input-control').find('input').val());}},Cancel:function(e){if(callback){callback(e,undefined);}},},width);$('.confirm-modal').on('shown.bs.modal',function(){$(this).find('.input-control').find('input').select();});},topMessage:function(html,duration,type){var dlg=$('<div class="Dialogs_topMessage"></div>');dlg.hide();$('#header_message_center').append(dlg);type=typeof type=='undefined'?'warning':type;var msgType="alert-"+type;var alert=$('<div class="alert '+msgType+'"></div>');alert.append('<button type="button" class="close" data-dismiss="alert">&times;</button>');alert.append(html)
dlg.html(alert);dlg.fadeIn(600);duration=duration||4000;dlg.powerTimer({delay:duration,func:function(){dlg.fadeOut(600,function(){dlg.remove();});}});return dlg;},}
$(function(){$(document).off('ajaxSend.island_custom').on('ajaxSend.island_custom',function(e,xhr,options){if(options.progressBarName!==false){options.progressBarName=$.meLoadingBar.show(options.progressBarName);}}).off('ajaxComplete.island_custom').on('ajaxComplete.island_custom',function(e,xhr,options){if(options.progressBarName!==false){$.meLoadingBar.hide(options.progressBarName);}
if(xhr.getResponseHeader('me_topmessage_success')!=null){$.meDialog.topMessage(xhr.getResponseHeader('me_topmessage_success'),4000,'success')}
if(xhr.getResponseHeader('me_topmessage_warning')!=null){$.meDialog.topMessage(xhr.getResponseHeader('me_topmessage_warning'),4000,'warning')}
if(xhr.getResponseHeader('me_topmessage_error')!=null){$.meDialog.topMessage(xhr.getResponseHeader('me_topmessage_error'),4000,'danger')}});});$(function(){jQuery.fn.loadReplace=function(url,data,callback){return this.each(function(){var elem=$(this);$.ajax({url:url,type:'POST',dataType:'html',data:data,success:function(html,status,xhr){elem.children().each(function(){$(this).detach();});elem.replaceWith(html);if(callback){callback(this);}},error:function(xhr,status,errorStr){$.meDialog.topMessage("An error occurred while loading data from the server: "+errorStr,4000,"danger");},});return this;});};});