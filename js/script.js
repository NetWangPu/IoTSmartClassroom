/**
 * 信息配置
 */

//手动自动模式全局配置
var isAuto = false;
//自动模式下的温度阈值
var autoTemperature = 30;

var myZCloudID = "829544767503"; // 智云帐号
var myZCloudKey =
  "CQQIAwcMAwAHBwIHQxBPVFhdU19DFwoTDAULAwMMAwMOBRwTGlxYWFEWDRYVWUVAURBEWw"; // 智云密钥
var SensorA = "00:12:4B:00:25:45:8D:9F"; // 节点MAC地址
var SensorB = "00:12:4B:00:25:45:6F:45"; // 节点MAC地址
var SensorC = "00:12:4B:00:25:45:6D:6C"; // 节点MAC地址
var rtc = new WSNRTConnect(myZCloudID, myZCloudKey); // 创建数据连接服务对象
/**
 * 与智云服务连接，并监听和解析实时数据并显示
 */
$(function () {
  rtc.setServerAddr("api.zhiyun360.com"); // 设置服务器地址
  rtc.connect(); // 数据推送服务连接
  rtc.onConnect = function () {
    // 调用方法并传递消息内容作为参数
    addLogMessage("开始连接");
    // 连接成功回调函数
    rtc.sendMessage(SensorA, "{A0=?,A1=?,A2=?,A3=?,A4=?}"); // 查询温湿度、灯光初始值
    rtc.sendMessage(SensorB, "{D1=?}"); // 查询温湿度、灯光初始值
    rtc.sendMessage(SensorC, "{V0=2,V0=?}"); // 查询温湿度、灯光初始值
    $("#ConnectState").text("数据服务连接成功！");
    addLogMessage("连接成功!");
  };
  rtc.onConnectLost = function () {
    // 数据服务掉线回调函数
    $("#ConnectState").text("数据服务掉线！");
    addLogMessage("连接掉线!");
  };
  rtc.onmessageArrive = function (mac, dat) {
    addLogMessage("收到来自节点" + mac + " >>> " + dat);
    // 消息处理回调函数
    console.log(mac + " >>> " + dat);
    //解析回调的消息
    if (mac == SensorA) {
      addLogMessage("收到A节点消息：" + dat);
      // 判断是否是节点的数据
      // 接受到数据{A0=33.4,A1=33.8,A2=223.3,A3=31,A4=973.3}
      if (dat[0] == "{" && dat[dat.length - 1] == "}") {
        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2); // 截取{}内的字符串
        var its = dat.split(","); // 以‘,’来分割字符串
        for (var x in its) {
          // 循环遍历
          var t = its[x].split("="); // 以‘=’来分割字符串
          if (t.length != 2) continue; // 满足条件时结束当前循环
          // 截取A0的值
          if (t[0] == "A0") {
            // 判断参数A0
            var tem = parseFloat(t[1]); // 读取温度数据
            $("#temperature-value").text(tem + "℃"); // 在页面显示温度数据
            if (isAuto) {
              if (tem > autoTemperature) {
                //发送指令
                rtc.sendMessage(SensorB, "{OD1=8,D1=?}");
                // rtc.sendMessage(SensorB, "{OD1=32,D1=?}");
                console.log("fan-toggle-button");
                //切换按钮状态 fan-status 更换内容为风扇状态：关闭
                $("#fan-status").text("风扇状态：开启");
                addLogMessage("打开风扇指令已发送(自动触发)");
              } else {
                //发送指令
                rtc.sendMessage(SensorB, "{CD1=8,D1=?}");
                // rtc.sendMessage(SensorB, "{CD1=32,D1=?}");
                console.log("fan-toggle-button");
                //切换按钮状态 fan-status 更换内容为风扇状态：开启
                $("#fan-status").text("风扇状态：关闭");
                addLogMessage("关闭风扇指令已发送(自动触发)");
              }
            }
          }
          if (t[0] == "A1") {
            // 判断参数A1
            var tem = parseFloat(t[1]); // 读取温度数据
            $("#humidity-value").text(tem + "%"); // 在页面显示温度数据
          }
          if (t[0] == "A2") {
            // 判断参数A2
            var hum = parseFloat(t[1]); // 读取湿度数据
            $("#light-intensity-value").text(hum + "Lux"); // 在页面显示湿度数据
          }
          if (t[0] == "A3") {
            // 判断参数A2
            var hum = parseFloat(t[1]); // 读取湿度数据
            $("#air-quality-value").text(hum + "ppm"); // 在页面显示湿度数据
          }
          if (t[0] == "A4") {
            // 判断参数A2
            var hum = parseFloat(t[1]); // 读取湿度数据
            $("#air-pressure-value").text(hum + "hPa"); // 在页面显示湿度数据
          }
        }
      }
    } else if (mac == SensorB) {
      addLogMessage("收到B节点消息：" + dat);
      // 接受到数据{D1=3}
      // if (dat[0] == "{" && dat[dat.length - 1] == "}") {
      //   // 判断字符串首尾是否为{}
      //   dat = dat.substr(1, dat.length - 2); // 截取{}内的字符串
      //   var its = dat.split(","); // 以‘,’来分割字符串
      //   for (var x in its) {
      //     // 循环遍历
      //     var t = its[x].split("="); // 以‘=’来分割字符串
      //     if (t.length != 2) continue; // 满足条件时结束当前循环
      //     // 截取A0的值
      //     if (t[0] == "D1") {
      //       // 判断参数D1
      //       var LightStatus = parseInt(t[1]); // 根据D1的值来进行开关的切换
      //       if ((LightStatus & 0x03) == 0x03) {
      //         $("#btn_img").attr("src", "images/an-on.png");
      //       } else if ((LightStatus & 0x03) == 0) {
      //         $("#btn_img").attr("src", "images/an-off.png");
      //       }
      //     }
      //   }
      // }
    } else if (mac == SensorC) {
      addLogMessage("收到C节点消息：" + dat);
      if (dat[0] == "{" && dat[dat.length - 1] == "}") {
        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2); // 截取{}内的字符串
        var its = dat.split(","); // 以‘,’来分割字符串
        for (var x in its) {
          // 循环遍历
          var t = its[x].split("="); // 以‘=’来分割字符串
          if (t.length != 2) continue; // 满足条件时结束当前循环
          // 截取A0的值
          if (t[0] == "A0") {
            // 判断参数A0
            var tem = parseFloat(t[1]); // 读取温度数据
            console.log("是否有人", tem);
            if (tem == 0) {
              $("#ishavePeople").text("无人");
            }
            if (tem == 1) {
              $("#ishavePeople").text("有人");
            }
          }
        }
      }
    }
  };
});

/**
 *
 * 点击按钮发送指令
 */
// {CD1=XXX,D1=?}
// {OD1=XXX,D1=?} {D1=XX}
// CD1 表示位清零，OD1 表示位置一；
// D1 的 bit 位控制设备：
// bit4：LED1 的开关，0 表示关，1 表示开
// bit5：LED2 的开关，0 表示关，1 表示开
$("#led1-on").click(function () {
  rtc.sendMessage(SensorB, "{OD1=16,D1=?}");
  rtc.sendMessage(SensorB, "{OD1=32,D1=?}");
  console.log("led1-on");
  addLogMessage("打开LED指令已发送");
});
$("#led1-off").click(function () {
  rtc.sendMessage(SensorB, "{CD1=16,D1=?}");
  rtc.sendMessage(SensorB, "{CD1=32,D1=?}");
  console.log("led1-off");
  addLogMessage("关闭LED指令已发送");
});

//检测auto-mode和manual-mode谁被选择设置isAuto
$("#auto-mode").click(function () {
  isAuto = true;
  console.log("auto-mode");
  addLogMessage("自动模式");
});
$("#manual-mode").click(function () {
  isAuto = false;
  console.log("manual-mode");
  addLogMessage("手动模式");
});

//手动模式下可直接控制风扇 自动模式下不可以
$("#fan-on-button").click(function () {
  if (isAuto) {
    alert("自动模式下不可控制风扇");
  } else {
    //发送指令
    rtc.sendMessage(SensorB, "{OD1=8,D1=?}");
    // rtc.sendMessage(SensorB, "{OD1=32,D1=?}");
    console.log("fan-toggle-button");
    //切换按钮状态 fan-status 更换内容为风扇状态：关闭
    $("#fan-status").text("风扇状态：开启");
    addLogMessage("打开风扇指令已发送");
  }
});
$("#fan-off-button").click(function () {
  if (isAuto) {
    alert("自动模式下不可控制风扇");
  } else {
    //发送指令
    rtc.sendMessage(SensorB, "{CD1=8,D1=?}");
    // rtc.sendMessage(SensorB, "{CD1=32,D1=?}");
    console.log("fan-toggle-button");
    //切换按钮状态 fan-status 更换内容为风扇状态：开启
    $("#fan-status").text("风扇状态：关闭");
    addLogMessage("关闭风扇指令已发送");
  }
});

//检测threshold-input的值 并设置autoTemperature
$("#threshold-input").change(function () {
  autoTemperature = $("#threshold-input").val();
  console.log("autoTemperature", autoTemperature);
  addLogMessage("温度阈值已设置为：" + autoTemperature);
});

// // 创建一个新的日志项
// var newLogItem = $(
//   '<div class="log-item">2019-01-01 12:00:00: 新消息内容</div>'
// );

// // 将新的日志项添加到日志内容区域
// $(".log-content").append(newLogItem);

// // 自动滚动到最新的日志项
// $(".log-content").scrollTop($(".log-content")[0].scrollHeight);
function addLogMessage(message) {
  // 获取当前日期和时间
  var currentDate = new Date();
  var formattedDate =
    currentDate.getFullYear() +
    "-" +
    (currentDate.getMonth() + 1) +
    "-" +
    currentDate.getDate();
  var formattedTime =
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();
  var dateTime = formattedDate + " " + formattedTime;

  // 创建一个新的日志项
  var newLogItem = $(
    '<div class="log-item">' + dateTime + ": " + message + "</div>"
  );

  // 将新的日志项添加到日志内容区域
  $(".log-content").append(newLogItem);

  // 自动滚动到最新的日志项
  $(".log-content").scrollTop($(".log-content")[0].scrollHeight);
}
