# compress
这个插件主要为了解决IOS图片上传时候翻转的问题

### 使用流程

>1.定义一个UploadCompress对象
构造UploadCompress对象时接受一个包含参数的对象
```
var upload = new UploadCompress({
    clickCase: "#addImg",
    fileEle: "#imgFile",
    maxHeight: 600,
    maxWidth: 600,
    threshold: 300000,
    callback: function(res){
    }
});

```
clickCase：必填，绑定点击的元素。<br>
fileEle: 必填，存放文件的元素。<br>
callback: 必填，压缩完的回调函数，接受一个参数（压缩后的base64位图片）<br>
threshold: 选填，上传文件大小的阈值，如果没超过这个值，就不压缩（默认200000）<br>
maxWidth: 选填，压缩后图片最大的宽度(默认1000px)<br>
maxHeight: 选填，压缩后图片最大的高度(默认1000px)<br>


>2.调用初始化
```
    upload.init();
```
生成的对象初始化了以后才能有效果

### 注意事项

1.会优先判断文件大小的阈值，再去判断压缩图片的宽度和高度大小<br>
2.添加完参数后的对象要初始化一下（upload.init();）<br>
3.若图片文件太大可能压缩会有一定延迟;<br>
4.不依赖jquery插件<br>
5.使用前要引用exif.js这个插件<br>