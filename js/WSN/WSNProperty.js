function WSNProperty(myZCloudID, myZCloudKey) {
	var thiz = this;
	thiz.aid = myZCloudID;
	thiz.xKey = myZCloudKey;
	thiz.saddr = "api.zhiyun360.com";
	
	thiz.setIdKey = function(uid, key) {
		thiz.uid = uid;
		thiz.key = key;		
	};
	
	thiz.initZCloud = function(uid, key) {
		thiz.uid = uid;
		thiz.key = key;		
	};
	
	thiz.setServerAddr = function(addr) {
		thiz.saddr = addr.replace('//', '')
		if (thiz.saddr.indexOf(':') > -1) {
			thiz.saddr = thiz.saddr.split(':').filter(item => {
				return item.length > 10 && item
			})[0]
		}
	};
	
	thiz.get = function(){
		var cb =null;
		var name = null;
		
		if (arguments.length == 1) {cb = arguments[0];}
		else {name = arguments[0]; cb = arguments[1];}

		let url = null
		if (window.location.protocol === 'https:') {
			url = "https://" + thiz.saddr + ":28090" + "/v2/feeds/" + thiz.aid + "/propertys";
		} else {
			url = "http://" + thiz.saddr + ":8080" + "/v2/feeds/" + thiz.aid + "/propertys";
		}

		if (name) {
			url = url + "/"+name;
		}
		$.ajax({
			type: "GET",
	    	url: url,
	    	dataType:"text",
	    	beforeSend: function( xhr ) {
				xhr.setRequestHeader("X-ApiKey", thiz.xKey);
			},
	    	success: function(data) {
	        	cb(data);
	    	}
    	});
	};
	thiz.put = function(name,value, cb) {
		let url = null
		if (window.location.protocol === 'https:') {
			url = "https://" + thiz.saddr + ":28090" + "/v2/feeds/" + thiz.aid + "/propertys/" + name;
		} else {
			url = "http://" + thiz.saddr + ":8080" + "/v2/feeds/" + thiz.aid + "/propertys/" + name;
		}
		$.ajax({
			type: "PUT",
	    	url: url,
	    	dataType:"text",
	    	data:value,
	    	beforeSend: function( xhr ) {
				xhr.setRequestHeader("X-ApiKey", thiz.xKey);
			},
	    	success: function(data) {
	        	cb(data);
	    	}
    	});	
	};
}