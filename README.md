# etekPlupload
## 对plupload进行修改，方便调用和使用回调函数
### 使用方法：
1，引入plupload.full.js库文件
2，如果是seajs项目，将etekPlupload-seajs.js放入自己项目的组件包。如果不是，则直接引入etekPlupload-object.js
3，如果是非seajs项目，这样初始化上传组件  

```
    var uploader=etekPlupload.makePlUpload({   
        buttonId:"btn_add", 
        uploadUrl:"action.php", 
        fileLimit: "jpg,gif,png,zip,rar", 
        fileMax:"2mb", 
        isAutoUpload:false,//是否选了文件后就自动提交
        multiFile:false,//手否支持多文件选择
        formName:"p_up[pic_url]",//提交到后台的字段名
        fileAdded:function(uploader,files){
            console.log(files[0].getNative());
            etekPlupload.previewImage(files[0],function(src){
                $("#img_pre").attr("src",src)
            });
        },
        success:function(data){
            console.log(data)
            $("#img_back_show").attr("src",data.pic);
            uploader.refresh();//重新初始化plupload
        },
        progress:function(uploader,files){
            $("#upload_progress").val(files.percent+"%");
        }
    });
    $("#btn_up").click(function(){
        uploader.start();
    })
```
如果是seajs项目，这样初始化上传组件  
```
var etekPlupload=require("../app/etekPlupload");  
var uploader=etekPlupload.makePlUpload({
            buttonId:"back_pro_pic_modify",
            uploadUrl:"/ajax/fileupload",
            fileLimit: "jpg,gif,png,zip,rar",
            fileMax:"2mb",
            isAutoUpload:false,
            multiFile:false,
            formName:"p_up[pic_url]",
            fileAdded:function(uploader,files){
                etekPlupload.previewImage(files[0],function(src){
                    $("#pro_img_pre").attr("src",src);
                });
            },
            success:function(data){
                var _jsonData=eval("("+data+")");
                $("#btn_sure_upload").removeAttr("disabled");
                setTimeout(function(){
                    $(".progress-bar b").css({"width":"0%"}).text("");
                    $(".progress-bar").hide();
                },1000)
                //alert(_jsonData.result);
                $("#pro_img_url").val(_jsonData.result);
                layer.msg("Upload success!");
                uploader.refresh();//重新初始化uploader
            },
            progress:function(uploader,files){
                $(".progress-bar").show();
                $(".progress-bar b").animate({"width":files.percent+"%"},20).text(files.percent+"%");
                $("#btn_sure_upload").attr("disabled","disabled");
            }
        });
        $("#btn_sure_upload").click(function(){
            uploader.start();
        })  
  ```  
  
### 使用方法：
	1，buttonId 触犯上传，弹出文件选择窗口的节点id，也可以是节点对象本身  
	2，uploadUrl，文件上传逻辑的controller或者请求链接。  
	3，fileLimit，限制文件上传的类型，多个类型用逗号隔开，
	4，fileMax，限制文件大小，单位为k mb gb。
	5，isAutoUpload，是否选择文件及上传。默认为true。
	6，multiFile，是否支持多文件选择。
	7，formName，文件文本框file的name属性值。
	8，fileAdded，文件选择完后执行的回调函数。
	9，success,文件上传完成后的回调函数（所有文件上传完成）。
	10，progress，文件上传进行中的监听函数。
### 以上回调函数参数说明  
	1，uploader，plupload对象。
	2，files，上传的文件队列。
	3，files.percent.上传的百分比，如50及上传了50%。
	4，uploader.start()，开始上传，当isAutoUpload为false时可以用它来手动开启上传。
	5，uploader.refresh(),重新初始化上传对象。
## 图片预览使用方法：  
	```
	etekPlupload.previewImage(file,function(src){
    $("#pro_img_pre").attr("src",src);
  });
  ```
  etekPlupload.previewImage第一个参数及是你要预览的图片文件，  
  第二个参数是解析完后的回调函数，参数src及是图片的路径，直接赋值给一个img节点的src属性即可预览
  
  
  
