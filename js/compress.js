
var UploadCompress = function(obj){
    this.clickCase = document.querySelectorAll(obj.clickCase)[0];
    this.fileEle = document.querySelectorAll(obj.fileEle)[0];
    this.maxHeight = obj.maxHeight || 1000;
    this.maxWidth = obj.maxWidth || 1000;
    this.callback = obj.callback;
    this.threshold = obj.threshold || 204800;
};

UploadCompress.prototype.init = function(){
    var _self = this;

    this.clickCase.addEventListener("click",function(){
        _self.fileEle.click();
    })

    this.fileEle.addEventListener("change",function(){
        var picFile = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(picFile);
        reader.onload = function (f) {
            var res = this.result;
            var img = new Image();
            if (res.length <= _self.threshold) {
                _self.toPreviewer(res);
                return;
            }
            img.onload = function () {
                _self.compress(img, picFile.type);
                img = null;
            };
            img.src = res;
        }
    });
};

UploadCompress.prototype.compress = function(img,fileType){
    var canvas = document.createElement("canvas"),
        rotateshow,
        _self = this;
    EXIF.getData(img, function () {
        EXIF.getAllTags(img);
        Orientation = EXIF.getTag(img, 'Orientation');
        switch (Orientation) {
            case 6:
                rotateshow = _self.rotateImg(img, 'left', canvas, fileType);
                break;
            case 8:
                rotateshow = _self.rotateImg(img, 'right', canvas, fileType);
                break;
            case 3:
                _self.rotateImg(img, 'right', canvas, fileType);
                rotateshow = _self.rotateImg(img, 'right', canvas, fileType);
                break;
            default:
                rotateshow = img.src;
        }
        _self.smallMin(rotateshow);
    });
}

UploadCompress.prototype.rotateImg = function(img, direction, canvas, fileType){
    var min_step = 0;
    var max_step = 3;

    if (img == null)return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;
    //var step = img.getAttribute('step');
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
    return canvas.toDataURL(fileType, 0.75);
};

UploadCompress.prototype.smallMin = function(src){
    var _self = this;
    var MAX_HEIGHT = this.maxHeight;
    var MAX_WIDTH = this.maxWidth;
    var image = new Image();
    image.onload = function () {
        var canvas = document.createElement("canvas");
        if (image.width > MAX_WIDTH){
            image.height *= MAX_WIDTH / image.width;
            image.width = MAX_WIDTH;
        }

        if (image.height > MAX_HEIGHT) {
            image.width *= MAX_HEIGHT / image.height;
            image.height = MAX_HEIGHT;
        }

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        _self.toPreviewer(canvas.toDataURL());
    };
    image.src = src;
}

UploadCompress.prototype.clearData = function(){
    this.fileEle.value = '';
};

UploadCompress.prototype.toPreviewer = function(res){
    this.callback(res);
};
