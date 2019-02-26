$(function () {
    $('#upload').on('change',function () {
        var filePath = $(this).val(), //获取input的value,里面是文件的路径
            fileFormat = filePath.substring(filePath.lastIndexOf('.')).toLowerCase(),
            imgBase64 = '', //存储图片的base64
            maxSize = 2*1024*1024,
            fileObj = document.getElementById('upload').files[0]; //上传文件的对象,要这样写才行，用jquery写法获取不到对象
            console.log(fileObj.size)
        //检查文件格式
        if(!fileFormat.match(/.png|.jpg|.jpeg|.gif/)){
            alert('文件类型错误,文件格式必须为:png/jpg/jpeg!')
            return;
        }
        if(fileObj.size > maxSize){
            //调用函数,对图片进行压缩
            compress(fileObj,function (imgBase64) {
                imgBase64 = imgBase64;
                $('#viewImg').attr('src',imgBase64);
            })
        }else{
            directTurnIntoBase64(fileObj,function (imgBase64) {
                imgBase64 = imgBase64;
                $('#viewImg').attr('src',imgBase64);
                console.log('大小没超过2M,不同进行压缩')
            });
        }


    });

    //不对图片进行压缩
    function directTurnIntoBase64(fileObj,callback) {
        var r = new FileReader();
        //转成base64
        r.onload = function () {
            imgBase64 = r.result;
         //   console.log(imgBase64);
            callback(imgBase64)
        }
        r.readAsDataURL(fileObj);//转成base64格式
    }

    //对图片进行压缩

    function compress(fileObj,callback) {
        if(typeof (FileReader) === 'undefined'){
            console.log("当前浏览器内核不支持base64图片压缩")
            directTurnIntoBase64(fileObj,callback);
        }else{
            try{
                var reader = new FileReader();
                reader.onload = function (e) {
                    var image = $('<img/>');
                    image.load(function () {
                        var squareW = 700,//定义画布大小,也就是图片压缩之后的像素
                            squareH = 600,
                            canvas = document.createElement('canvas'),
                            context = canvas.getContext('2d'),
                            imageWidth = 0, //压缩图片大小
                            imageHeight = 0,
                            offsetX = 0,
                            offsetY = 0,
                            data = '';
                            canvas.width = squareW;
                            canvas.height = squareH;
                            context.clearRect(0,0,squareW,squareH);

                        if(this.width > squareW){
                            imageWidth = Math.round(squareW);
                            imageHeight = squareH;
                            offsetX = Math.round((imageWidth-squareW)/2);
                        }else{
                            imageHeight = Math.round(squareH);
                            imageWidth = squareW;
                            offsetY = Math.round((imageHeight - squareH)/2)
                        }
                        context.drawImage(this,offsetX,offsetY,imageWidth,imageHeight);
                        var data = canvas.toDataURL('image/jpeg')
                        callback(data)
                    });
                    image.attr('src',e.target.result)
                };
                reader.readAsDataURL(fileObj);
            }catch (e) {
                console.log('压缩失败!')
                //调用不压缩方法
                directTurnIntoBase64(fileObj,callback)
            }
        }
    }
})

