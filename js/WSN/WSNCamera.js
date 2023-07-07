var WSNCamera = function (myZCloudID, myZCloudKey) {
    this.uid = myZCloudID;
    this.key = myZCloudKey;
    this.saddr = "zhiyun360.com:8002";
    var myCamera = new camera();

    myCamera.initZCloud(myZCloudID, myZCloudKey);

    //云服务初始化
    this.initZCloud = function (myZCloudID, myZCloudKey) {
        myCamera.initZCloud(myZCloudID, myZCloudKey);
    }
    //设置服务器地址
    this.setServerAddr = function (saddr) {
        this.saddr = saddr;
        myCamera.setServerAddr(saddr);
    }
    //摄像头初始化
    this.initCamera = function (gwip, cam) {
        myCamera.initCamera(gwip, cam);
    }

    //将视频图像在指定标签id显示
    this.setDiv = function (divID) {
        myCamera.setDiv(divID);
    }



    //改变分辨率:F3系列 val=0,640*480;val=1,320*240;
    // F系列 val=2,160*120;val=8,320*240;val=32,640*480
    this.setResolution = function (val) {
        myCamera.setResolution(val);
    }
    //打开摄像头
    this.openVideo = function () {
        myCamera.openVideo();
    }

    //关闭摄像头
    this.closeVideo = function () {
        myCamera.closeVideo();
    }

    //摄像头控制
    this.control = function (cmd) {
        if (cmd == "UP") myCamera.ptzUpSubmit(); //向上
        if (cmd == "DOWN") myCamera.ptzDownSubmit(); //向下
        if (cmd == "LEFT") myCamera.ptzLeftSubmit();	//向左
        if (cmd == "RIGHT") myCamera.ptzRightSubmit();	//向右
        if (cmd == "HPATROL") myCamera.ptzHorizonSubmit();	//水平扫航
        if (cmd == "VPATROL") myCamera.ptzVerticalSubmit();	//垂直扫航
        if (cmd == "360PATROL") myCamera.ptzVHSubmit();	//360°扫航
    }

    //截屏
    this.snapshot = function () {
        myCamera.snapshot();
    }
}