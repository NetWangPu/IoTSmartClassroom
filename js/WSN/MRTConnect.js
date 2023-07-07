var MRTConnect = function() {
	var thiz = this;
    thiz.aid2rtc = {};
    thiz.mac2rtc = {};
    
    thiz.__onMessageRecv = function(rtc, addr, data) {
        var d=new Date();
        var time=d.toLocaleDateString()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        rtc.macs[addr] = {
            'time': time,
            'data':data
        }
        thiz.mac2rtc[addr] = rtc;
        if (thiz.onmessageArrive){
            thiz.onmessageArrive(addr, data);
        }
    }
    
    thiz.onmessageArrive = null;
    
    thiz.addAidKey = function(aid, key, server) {
        if (thiz.aid2rtc[aid] == null){
            var rtc = new WSNRTConnect();
            rtc.macs = {};
            rtc.connected = false;
            rtc.setIdKey(aid, key);
            if (server) {
                rtc.setServerAddr(server);
            }

            rtc.onConnect = function(){
                rtc.connected = true;
            }
            rtc.onmessageArrive = function(addr, data){
                thiz.__onMessageRecv(rtc, addr, data);
            }
            rtc.onConnectLost = function(){
                rtc.connected = false;
                if (rtc.running) {
                    setTimeout(function(){
                        if (rtc.running){
                            delete thiz.aid2rtc[rtc.uid];
                            for (var k in rtc.macs) {
                                if (thiz.mac2rtc[k] == rtc){
                                    delete thiz.mac2rtc[k]
                                };
                            }
                            //reconnect
                            var n_rtc = new WSNRTConnect();
                            n_rtc.macs = {};
                            n_rtc.connected = false;
                            n_rtc.setIdKey(rtc.uid, rtc.key);
                            n_rtc.setServerAddr(rtc.saddr);
                            n_rtc.onConnect = rtc.onConnect;
                            n_rtc.onmessageArrive = rtc.onmessageArrive;
                            n_rtc.onConnectLost = rtc.onConnectLost;
                            rtc = n_rtc;
                            thiz.aid2rtc[rtc.uid] = rtc;
                            rtc.running = true;
                            rtc.connect();
                        }
                    }, 5000);
                }
            }
            thiz.aid2rtc[aid] = rtc;
            rtc.running = true;
            rtc.connect();
        }
    }
    thiz.delAid  = function(aid){
        if (thiz.aid2rtc[aid] != null){
            var rtc = thiz.aid2rtc[aid];
            rtc.running = false;
            rtc.disconnect()
            for (var k in rtc.macs) {
                if (thiz.mac2rtc[k] == rtc){
                    delete thiz.mac2rtc[k]
                };
            }
            delete thiz.aid2rtc[aid] 
        }
    }
    
    thiz.getDeviceByAid = function(aid){
        if (thiz.aid2rtc[aid] != null){
            var rtc = thiz.aid2rtc[aid];
            return rtc.macs;
        }
    }
    thiz.sendMessageByAid = function(aid, addr, msg){
        if (thiz.aid2rtc[aid] != null){
            var rtc = thiz.aid2rtc[aid];
            if (rtc.connected) {
                rtc.sendMessage(addr, msg);
            }
        }
    }
    
    thiz.sendMessage = function(addr, msg){
        if (thiz.mac2rtc[addr]) {
            var rtc = thiz.mac2rtc[addr];
            if (rtc.connected) {
                rtc.sendMessage(addr, msg);
            }
        }
    }
};