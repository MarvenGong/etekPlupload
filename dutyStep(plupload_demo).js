// JavaScript Document
//任务步骤的操作
function checkStepTab(e){
	$(".duty_step_wraper").hide();
	$(".duty_step_wraper").eq($(e).index()).show();
	$(".cpinfo ul li").removeClass("cur");
	$(".cpinfo ul li a").removeClass("close");
	var _c=$(".cpinfo ul li").size();
	$(e).addClass("cur");
	if($(e).index()==_c-1&&$(e).index()!=0){
		$(e).find("a").addClass("close");
	}
}
var makePlUploadOption={
		//buttonId:"",点击选择图片的按钮或者节点对象
		//uploadUrl:"",接受上传图片请求的controller
		//fileAdded:function(){}图片选择后执行的回调函数
		//success:function(){}图片上传成功执行的回调函数
		//error:function(){}图片上传失败执行的回调函数
	}
function makePlUpload(makePlUploadOption){
	
	var ie = window.attachEvent;
    var runtimesStr = ie ? "silverlight,html4" : "html5,flash";
    var uploader = new plupload.Uploader({
        runtimes : runtimesStr,
        filters: {
            mime_types : [ //只允许上传图片;
                { title : "Image files", extensions : "jpg,gif,png" }
            ],
            max_file_size : '1024kb', //最大只能上传2M的文件
            prevent_duplicates : true //不允许选取重复文件
        },
        browse_button : makePlUploadOption.buttonId, //触发文件选择对话框的按钮，为那个元素id
        url :"/dev/mydev/imageUpload", //makePlUploadOption.uploadUrl, //服务器端的上传页面地址
        flash_swf_url : 'js/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
        silverlight_xap_url : 'js/Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
    });
    //在实例对象上调用init()方法进行初始化
    uploader.init();
    //绑定各种事件，并在事件监听函数中做你想做的事
    uploader.bind('FilesAdded',function(uploader,files){
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    });
    uploader.bind('UploadProgress',function(uploader,file){
        //每个事件监听函数都会传入一些很有用的参数，
        //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
    });
    uploader.bind('Error',function(uploader,errObject){
        alert(errObject.message);
    });
    uploader.bind('FilesAdded',function(){
        uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
		makePlUploadOption.fileAdded();
        /*$("#recipeImg").css("display", "");
        $("#recipeImg").attr("src","/images/loading.gif");*/
    });
    uploader.bind('FileUploaded',function(a1, a2, rsp){
        if(rsp.status != 200)
        {
            alert("图片上传失败:" + rsp.status + "，请重试");
            makePlUploadOption.error();
            return false;
        }
        var jssImgUrl = rsp.response;
		makePlUploadOption.success(jssImgUrl);
        /*$("#recipeImg").css("display", "");
        $("#recipeImg").attr("src",jssImgUrl);
        $("#upload-input-id").val(jssImgUrl);
        // 隐藏图片提示;
        $("#recipeImgTips").hide();*/
        // 隐藏虚线图片框;
        // $("#recipeImgPick").css("display", "none");
    });
}
function deleteStep(e){
	if($(e).parent().index()!=1){
		$(e).parent().prev("li").addClass("cur");
		$(e).parent().prev("li").find("a").addClass("close");
	}
	$(".duty_step_wraper").eq($(e).parent().index()).prev(".duty_step_wraper").show();
	$(".duty_step_wraper").eq($(e).parent().index()).remove();
	$(e).parent().remove();
}	
$(document).ready(function(e) {
	
	/*
	 *四个参数，像下面这样赋值，
	 *buttonId表示控件的id
	 *uploadUrl上传图片的controller
	 *fileAdded图片选择好了之后执行的效果，比如说叉叉控件消失，出现loading效果
	 *success图片上传完成后执行的效果，比如说jssUrl赋值给制定的文本框
	*/
	makePlUpload({
		buttonId:"recipePhoto",
		uploadUrl:"/dev/mydev/imageUpload",
		fileAdded:function(){
			$("#recipePhoto").hide();
			$("#recipeImg").css("display", "");
	        $("#recipeImg").attr("src","/images/loading.gif");
		},
		success:function(data){
			$("#upload-input-id").val(data);
			$("#recipeImg").attr("src",data);
		},
		error:function(){
			$("#recipePhoto").show();
			$("#recipeImg").css("display", "none");
	        $("#recipeImg").attr("src","");
		}
	});
	$(".recipeEditStepImg").live("click",function(){
		$(this).next("span").click();
	})
	$(".recipeStepImgChoose").not(".disable").each(function(index, ele) {
		makePlUpload({
			buttonId:$(ele).attr("id"),
			uploadUrl:"/dev/mydev/imageUpload",
			fileAdded:function(){
				$(ele).hide();
				$(ele).prev(".taskImg").css("display", "");
		        $(ele).prev(".taskImg").attr("src","/images/loading.gif");
			},
			success:function(data){
				$(ele).next().val(data);
				$(ele).prev(".taskImg").attr("src",data);
			},
			error:function(){
				$(ele).show();
				$(ele).prev(".taskImg").css("display", "none");
		        $(ele).prev(".taskImg").attr("src","");
			}
		});
    });	
    $("#btn_step_add").click(function(){
		//先移除已经有的tab的关闭按钮，再添加tab
		$(".cpinfo ul li").removeClass("cur");
		$(".cpinfo ul li a").removeClass("close");
		//创建标签
		var newTabIndexLi=$('<li class="cur" onClick="checkStepTab(this)"></li>');
		
		var tabLength=$(".cpinfo ul li").size();
		if(tabLength>=20){
			return;
		}else{
			switch(tabLength){
				case 1:
					newTabIndexLi.html("步骤二");
					break;
				case 2:
					newTabIndexLi.html("步骤三");
					break;
				case 3:
					newTabIndexLi.html("步骤四");
					break;
				case 4:
					newTabIndexLi.html("步骤五");
					break;
				case 5:
					newTabIndexLi.html("步骤六");
					break;
				case 6:
					newTabIndexLi.html("步骤七");
					break;
				case 7:
					newTabIndexLi.html("步骤八");
					break;
				case 8:
					newTabIndexLi.html("步骤九");
					break;
				case 9:
					newTabIndexLi.html("步骤十");
					break;
				case 10:
					newTabIndexLi.html("步骤十一");
					break;
				case 11:
					newTabIndexLi.html("步骤十二");
					break;
				case 12:
					newTabIndexLi.html("步骤十三");
					break;
				case 13:
					newTabIndexLi.html("步骤十四");
					break;
				case 14:
					newTabIndexLi.html("步骤十五");
					break;
				case 15:
					newTabIndexLi.html("步骤十六");
					break;
				case 16:
					newTabIndexLi.html("步骤十七");
					break;
				case 17:
					newTabIndexLi.html("步骤十八");
					break;
				case 18:
					newTabIndexLi.html("步骤十九");
					break;
				case 19:
					newTabIndexLi.html("步骤二十");
					break;
			}
			var newTabA=$('<a class="close" onclick="deleteStep(this)" href="javascript:;"></a>');
			newTabIndexLi.append(newTabA).appendTo($(".cpinfo ul.tab"));
			
			//添加标签页并显示
			$(".duty_step_wraper").hide();
			var _duty_step=$(".duty_step_wraper_model").clone(true);
			_duty_step.removeClass("duty_step_wraper_model").addClass("duty_step_wraper");
			_duty_step.find("input").val("");
			_duty_step.find("input").eq(0).attr("placeHolder","步骤"+(tabLength+1));
			//为图片选择控件绑定制定id
			var _thisStepImgId="recipeStepImg"+(tabLength+1);
			
			_duty_step.find(".recipeStepImgChoose").attr("id",_thisStepImgId).removeClass("disable");
			
			
			_duty_step.show();
			$(".cpinfo").append(_duty_step);
			//步骤节点生成完成，调用plupload方法，让图片选择生效
			
			makePlUpload({
				buttonId:_thisStepImgId,
				uploadUrl:"/dev/mydev/imageUpload",
				fileAdded:function(){
					$("#"+_thisStepImgId).hide();
					$("#"+_thisStepImgId).prev(".taskImg").show();
					$("#"+_thisStepImgId).prev(".taskImg").attr("src","/images/loading.gif");
				},
				success:function(data){
					$("#"+_thisStepImgId).next().val(data);
					$("#"+_thisStepImgId).prev(".taskImg").attr("src",data);
				},
				error:function(){
					$("#"+_thisStepImgId).show();
					$("#"+_thisStepImgId).prev(".taskImg").hide();
					$("#"+_thisStepImgId).prev(".taskImg").attr("src","");
				}
			});
		}
	});
});