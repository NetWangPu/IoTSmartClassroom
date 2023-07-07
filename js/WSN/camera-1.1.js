//使用对象来建立摄像头的各种控制
function camera() {
    //属性
    var thiz = this;
    thiz.id;
    thiz.key;
    thiz.cam_divid;
    thiz.camip;
    thiz.camid;
    thiz.img;
    thiz.src;
    thiz.camType;
    thiz.saddr = "api.zhiyun360.com:8002";

    //云服务初始化
    thiz.initZCloud = function (id, key) {
        thiz.id = id;
        thiz.key = key;
    }
    //设置服务器地址
    thiz.setServerAddr = function (saddr) {
        thiz.saddr = saddr;
    }
    //摄像头初始化
    thiz.initCamera = function (gwip, cam) {
        thiz.camip = gwip;
        thiz.camid = cam;

        thiz.img = new Image();

        thiz.camType = "ZCamera";

    }

    //设置视频图像显示的标签id
    thiz.setDiv = function (divID) {
        thiz.cam_divid = divID;
        $("#" + divID).hide();
    }


    thiz.__getZCameraAddr = function () {
            //当网关地址为空时，使用外网地址进行摄像头初始化
        if(!thiz.camip) {
            thiz.camip = "zxbeegw" + thiz.id + ".zhiyun360.com"
        }
        return [thiz.camip, thiz.camid];
    }

    //视频开
    thiz.openVideo = function () {
        $("#" + thiz.cam_divid).show();
        var ac = thiz.__getZCameraAddr();
        thiz.src = "http://" + ac[0] + "/stream/" + encodeURIComponent(ac[1]);
        console.log(thiz.src);
        $("#" + thiz.cam_divid).attr("src", thiz.src);
        thiz.img.onerror = thiz.takeError;
    }
    //视频关闭
    thiz.closeVideo = function () {
        thiz.src = "";
        $("#" + thiz.cam_divid).attr("src", thiz.src);
        $("#" + thiz.cam_divid).hide();

        if (thiz.camType == "ZCamera") {
            return;
        }
        thiz.img.onerror = null;
        thiz.img.onload = null;
    }

    function ptz(x, y, z) {
        var ac = thiz.__getZCameraAddr()
        $.ajax({
            type: "post",
            url: "http://" + ac[0] + "/ptz/relativemove/" + encodeURIComponent(ac[1]),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ x: x, y: y, z: z }),
            success: function (data, status) {
                console.log(status);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }

    //向上
    thiz.ptzUpSubmit = function () {
        ptz(0, 0.05, 0)
    }
    //向下
    thiz.ptzDownSubmit = function () {
        ptz(0, -0.05, 0)
    }
    //向左
    thiz.ptzLeftSubmit = function () {
        ptz(-0.05, 0, 0)
    }
    //向右
    thiz.ptzRightSubmit = function () {
        ptz(0.05, 0, 0)
    }

    //截屏
    thiz.snapshot = function () {
        var ac = thiz.__getZCameraAddr()
        var imgURL = "http://" + ac[0] + "/snapshot/" + encodeURIComponent(ac[1]);;
        var oPop = window.open(imgURL, "mysnapshot", "width=640,height=480,top=100,left=400");
    }


}