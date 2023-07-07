function WSNHistory(myZCloudID, myZCloudKey) {
    var thiz = this;
    thiz.uid = myZCloudID;
    thiz.key = myZCloudKey;
    thiz.saddr = "api.zhiyun360.com";

    thiz.setIdKey = function (uid, key) {
        thiz.uid = uid;
        thiz.key = key;
    };

    thiz.initZCloud = function (uid, key) {
        thiz.uid = uid;
        thiz.key = key;
    };

    thiz.setServerAddr = function (addr) {
		thiz.saddr = addr.replace('//', '')
		if (thiz.saddr.indexOf(':') > -1) {
			thiz.saddr = thiz.saddr.split(':').filter(item => {
				return item.length > 10 && item
			})[0]
		}
    };
    thiz.query = function (channel, start, end, interval, cb) {
        var url, addr, q;
        if (window.location.protocol === 'https:') {
            addr = "https://" + thiz.saddr + ":28090"
        } else {
            addr = "http://" + thiz.saddr + ":8080"
        }
        if (arguments.length == 1) {
            url = addr + "/v2/feeds/" + thiz.uid;
            cb = arguments[0];
        } else if (arguments.length == 2) {
            url = addr + "/v2/feeds/" + thiz.uid + "/datastreams/" + channel;
            cb = arguments[1];
        } else if (arguments.length == 4) {
            q = "start=" + start + "&end=" + end;
            url = addr + "/v2/feeds/" + thiz.uid + "/datastreams/" + channel + "?" + q;
            cb = arguments[3];
        } else if (arguments.length == 5) {
            q = "start=" + start + "&end=" + end + "&interval=" + interval;
            url = addr + "/v2/feeds/" + thiz.uid + "/datastreams/" + channel + "?" + q;
            cb = arguments[4];
        } else {
            return;
        }
        //console.log(url);
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-ApiKey", thiz.key);
            },
            success: function (data) {
                cb(data);
            }
        });
    };
    thiz.queryLast = function (channel, cb, pa) {
        let url = null
        if (window.location.protocol === 'https:') {
            url = "https://" + thiz.saddr + ":28090" + "/v2/feeds/" + thiz.uid + "/datastreams/" + channel;
        } else {
            url = "http://" + thiz.saddr + ":8080" + "/v2/feeds/" + thiz.uid + "/datastreams/" + channel;
        }
        if (pa) {
            url += "?" + pa;
        }
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-ApiKey", thiz.key);
            },
            success: function (data) {
                cb(data);
            }
        });
    };
    thiz.queryLast1H = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=1hour");
    };
    thiz.queryLast6H = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=6hours");
    };
    thiz.queryLast12H = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=12hours");
    };
    thiz.queryLast1D = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=1day");
    };
    thiz.queryLast5D = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=5days");
    };
    thiz.queryLast14D = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=14days");
    };
    thiz.queryLast1M = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=1month");
    };
    thiz.queryLast3M = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=3months");
    };
    thiz.queryLast6M = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=6months");
    };
    thiz.queryLast1Y = function (channel, cb) {
        thiz.queryLast(channel, cb, "duration=1year");
    };
}

