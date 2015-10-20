/**
 * Created by MarvenGong of etekcity on 2015/10/20.
 */
var etekPlupload={
    makePlUpload:function(makePlUploadOption){
        var ie = window.attachEvent;
        var runtimesStr = ie ? "silverlight,html4" : "html5,flash";

        var uploader = new plupload.Uploader({
            runtimes : runtimesStr,
            rename:true,
            dragdrop:true,
            multi_selection:makePlUploadOption.multiFile,
            formName:makePlUploadOption.formName,//提交到后台的字段名
            filters: {
                mime_types : [ //只允许上传图片;
                    { title : "Image files", extensions :makePlUploadOption.fileLimit}
                ],
                max_file_size : makePlUploadOption.fileMax, //最大只能上传多大的文件
                prevent_duplicates : true //不允许选取重复文件
            },
            browse_button : makePlUploadOption.buttonId, //触发文件选择对话框的按钮，为那个元素id
            url :makePlUploadOption.uploadUrl, //服务器端的上传页面地址"/dev/mydev/imageUpload", //
            flash_swf_url : 'Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
            silverlight_xap_url : 'Moxie.xap' //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
        });
        //在实例对象上调用init()方法进行初始化
        uploader.init();
        //绑定各种事件，并在事件监听函数中做你想做的事
        uploader.bind('FilesAdded',function(uploader,files){

            makePlUploadOption.fileAdded(uploader,files);
            if(makePlUploadOption.isAutoUpload){
                uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
            }
        });
        uploader.bind('UploadProgress',function(uploader,file){
            makePlUploadOption.progress(uploader,file);
        });
        uploader.bind('Error',function(uploader,errObject){
            alert(errObject.message);
        });
        uploader.bind('FileUploaded',function(a1, a2, rsp){
            if(rsp.status != 200)
            {
                alert("图片上传失败:" + rsp.status + "，请重试");
                makePlUploadOption.error();
                return false;
            }else{
                var data = rsp.response;
                makePlUploadOption.success(data);
            }
        });
        return uploader;
    },
    /*生成预览图*/
    previewImage:function(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
        if (!file || !/image\//.test(file.type)) return; //确保文件是图片
        if (file.type == 'image / gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function () {
                callback(fr.result);
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        }else{
            var preloader = new mOxie.Image();
            preloader.onload = function () {
                //preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
                var imgsrc = preloader.type == 'image / jpeg' ? preloader.getAsDataURL('image / jpeg',80 ) :
                    preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                callback && callback(imgsrc); //callback传入的参数为预览图片的url
                preloader.destroy();
                preloader = null;
            };
            preloader.load(file.getSource());
        }
    }
}
