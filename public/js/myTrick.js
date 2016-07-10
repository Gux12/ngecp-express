// 1.1 判断图片是否加载完毕
// 
// 
// 
// 
var t_img; // 定时器
var isLoad = true; // 控制变量

// 判断图片加载的函数
function isImgLoad(callback) {
    // 注意我的图片类名都是cover，因为我只需要处理cover。其它图片可以不管。
    // 查找所有封面图，迭代处理
    $('img').each(function() {
        // 找到为0就将isLoad设为false，并退出each
        if (this.height === 0) {
            isLoad = false;
            return false;
        }
    });
    // 为true，没有发现为0的。加载完毕
    if (isLoad) {
        clearTimeout(t_img); // 清除定时器
        // 回调函数
        callback();
        // 为false，因为找到了没有加载完成的图，将调用定时器递归
    } else {
        isLoad = true;
        t_img = setTimeout(function() {
            isImgLoad(callback); // 递归扫描
        }, 100); // 我这里设置的是500毫秒就扫描一次，可以自己调整
    }
}



// 1.2 全站智能跳转
$(document).ready(function() {
    $('#search').focus();
    $('#search').keydown(function(event) {
        /* Act on the event */
        if (event.keyCode == 13) {
            var desireText = $(this).val();
            var desireType;
            var diy;
            var result = {
                'diyGoods': '',
                'diyKey': '',
                'diy': '',
                'desireType': '',
                'desireTypeKey': '',
            };
            if (diy = detectCloth(desireText)) {
                result.diy = "可定制";
                result.diyKey = diy;
                result.diyGoods = "服装";
            } else if (diy = detectCar(desireText)) {
                result.diy = "可定制";
                result.diyKey = diy;
                result.diyGoods = "汽车";
            } else if (diy = detectSheep(desireText)) {
                result.diy = "不可定制";
                result.diyKey = diy;
                result.diyGoods = "羊肉";
            } else {
                result.diy = "none";
            }
            if (desireType = detectReserve(desireText)) {
                result.desireType = "预定";
                result.desireTypeKey = desireType;
            } else if (desireType = detectImmediate(desireText)) {
                result.desireType = "即时";
                result.desireTypeKey = desireType;
            } else if (desireType = detectCycle(desireText)) {
                result.desireType = "周期";
                result.desireTypeKey = desireType;
            } else {
                result.desireType = "none";
            }
            fadeHello(analysis(result));
        }
    });

    function detectCloth(string) {
        var patt_cloth = [new RegExp("衣"), new RegExp("服"), new RegExp("装"), new RegExp("西服"), new RegExp("西装"), new RegExp("恤"), new RegExp("衫"), new RegExp("裤"), new RegExp("外套")];
        for (var i = patt_cloth.length - 1; i >= 0; i--)
            if (patt_cloth[i].test(string)) return patt_cloth[i];
        return false;
    }

    function detectCar(string) {
        var patt_car = [new RegExp("车"), new RegExp("奥迪"), new RegExp("宝马"), new RegExp("奔驰"), new RegExp("现代"), new RegExp("北汽"), new RegExp("兰博基尼")];
        for (var i = patt_car.length - 1; i >= 0; i--)
            if (patt_car[i].test(string)) return patt_car[i];
        return false;
    }

    function detectSheep(string) {
        var patt_sheep = [new RegExp("羊肉"), new RegExp("羊")];
        for (var i = patt_sheep.length - 1; i >= 0; i--)
            if (patt_sheep[i].test(string)) return patt_sheep[i];
        return false;
    }

    function detectReserve(string) {
        var patt_reserve = [new RegExp("明天"), new RegExp("后天"), new RegExp("大后天"), new RegExp("明早"), new RegExp("明晚"), new RegExp("下周"), new RegExp("下个月"), new RegExp("明年")];
        for (var i = patt_reserve.length - 1; i >= 0; i--)
            if (patt_reserve[i].test(string)) return patt_reserve[i];
        return false;
    }

    function detectImmediate(string) {
        var patt_immediate = [new RegExp("今天"), new RegExp("尽快"), new RegExp("马上"), new RegExp("立马"), new RegExp("现在"), new RegExp("下午"), new RegExp("中午")];
        for (var i = patt_immediate.length - 1; i >= 0; i--)
            if (patt_immediate[i].test(string)) return patt_immediate[i];
        return false;
    }

    function detectCycle(string) {
        var patt_cycle = [new RegExp("每周"), new RegExp("每天"), new RegExp("每小时"), new RegExp("每月"), new RegExp("每年"), new RegExp("每半个月")];
        for (var i = patt_cycle.length - 1; i >= 0; i--)
            if (patt_cycle[i].test(string)) return patt_cycle[i];
        return false;
    }

    function fadeHello(callback) {
        $('#hello1').animo({
            animation: 'fadeOut',
            duration: 1,
            keep: true
        });
        $('#hello2').animo({
            animation: 'fadeOut',
            duration: 1,
            keep: true
        });
        $('#hello-input').animo({
            animation: 'fadeOut',
            duration: 1,
            keep: true
        }, callback);
    }

    function analysis(result) {
        $('#hello1').remove();
        $('#hello2').remove();
        $('#hello-input').remove();
        if (result.diy != "none") {
            $('#indexPanel').append('<h3 class="hide" id="h31">检测到关键字<kbd>' + result.diyKey + '</kbd>商品类型<kbd>' + result.diyGoods + '</kbd></h3>');
            $('#indexPanel').append('<h3 class="hide" id="h32">商品<kbd>' + result.diy + '</kbd></h3>');
            if (result.desireType != "none") {
                $('#indexPanel').append('<h3 class="hide" id="h33">检测到关键字<kbd>' + result.desireTypeKey + '</kbd></h3>');
                $('#indexPanel').append('<h3 class="hide" id="h34">需求类型为<kbd>' + result.desireType + '需求</kbd></h3>');
                $('#indexPanel').append('<h3 class="hide" id="h35">需求分析为<kbd>' + result.diy + result.desireType + '需求(ง •̀_•́)ง</kbd></h3>');
                if (result.diyGoods == "服装") {
                    $('#indexPanel').append('<h3 class="hide" id="h36">身高<kbd>' + '175cm</kbd>' + ' 体重<kbd>' + '45kg</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h37">胸围<kbd>' + '25cm</kbd>' + ' 腰围<kbd>' + '21cm</kbd>' + ' 臀围<kbd>' + '23cm</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h38">风格偏好<kbd>' + '极简/中国风/牛仔/英伦/韩系/OL</kbd></h3>');
                }
                if (result.diyGoods == "汽车") {
                    $('#indexPanel').append('<h3 class="hide" id="h36">收入水平<kbd>' + '中等偏上</kbd>' + ' 当前状况<kbd>' + '存款盈余</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h37">品牌商偏好<kbd>' + '北京汽车/北京现代/丰田/本田/一汽大众/宝马/奔驰/保时捷</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h38">类型偏好<kbd>' + '商务车/轿车/越野车/跑车</kbd></h3>');
                }
                if (result.diyGoods == "羊肉") {
                    $('#indexPanel').append('<h3 class="hide" id="h36">评价偏好<kbd>' + '销量/价格/速度</kbd></h3>');
                }
            } else {
                $('#indexPanel').append('<h3 class="hide" id="h33">需求分析为<kbd>' + result.diy + '未知需求(ง •̀_•́)ง</kbd></h3>');
                if (result.diyGoods == "服装") {
                    //                    $('#indexPanel').append('<h3 class="hide" id="h36">三维信息 </h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h34">身高<kbd>' + '175cm</kbd>' + ' 体重<kbd>' + '45kg</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h35">胸围<kbd>' + '25cm</kbd>' + ' 腰围<kbd>' + '21cm</kbd>' + ' 臀围<kbd>' + '23cm</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h36">风格偏好<kbd>' + '极简/中国风/牛仔/英伦/韩系/OL</kbd></h3>');
                }
                if (result.diyGoods == "汽车") {
                    $('#indexPanel').append('<h3 class="hide" id="h34">收入水平<kbd>' + '中等偏上</kbd>' + ' 当前状况<kbd>' + '存款盈余</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h35">品牌商偏好<kbd>' + '北京汽车/北京现代/丰田/本田/一汽大众/宝马/奔驰/保时捷</kbd></h3>');
                    $('#indexPanel').append('<h3 class="hide" id="h36">类型偏好<kbd>' + '商务车/轿车/越野车/跑车</kbd></h3>');
                }
                if (result.diyGoods == "羊肉") {
                    $('#indexPanel').append('<h3 class="hide" id="h34">评价偏好<kbd>' + '销量/价格/速度</kbd></h3>');
                }
            }

        } else {
            $('#indexPanel').append('<h3 class="hide" id="h31">您需要的商品我们这儿没有( >﹏<。)</h3>');
        }
        if (result.diyGoods == "汽车")
            animateAllH3(1, function() {
                $('#indexPanel').append('<br><a id="enter" class="button button-glow button-rounded button-jumbo button-highlight hide">进入选购</a>');
                $('#enter').removeClass('hide');
                $('#enter')[0].href = "desire_car_display.html";
                $('#enter').focus();
            });
        if (result.diyGoods == "羊肉")
            animateAllH3(1, function() {
                $('#indexPanel').append('<br><a id="enter" class="button button-glow button-rounded button-jumbo button-highlight hide">进入选购</a>');
                $('#enter').removeClass('hide');
                $('#enter')[0].href = "smart_chain_fresh.html";
                $('#enter').focus();
            });
        if (result.diyGoods == "服装") {
            animateAllH3(1, function() {
                $('#indexPanel').append('<br><a id="enter" class="button button-glow button-rounded button-jumbo button-highlight hide">进入选购</a>');
                $('#enter').removeClass('hide');
                $('#enter')[0].href = "desire_cloth_style_display.html";
                $('#enter').focus();
            });
        }
        if (result.diy == "none") {
            animateAllH3(1, function() {
                $('#indexPanel').append('<br><a id="return" class="button button-glow button-rounded button-jumbo button-action hide">返回</a>');
                $('#return').removeClass('hide');
                $('#return')[0].href = "index.html";
                $('#return').focus();
            });
        }
    }

    function animateAllH3(pos, callback) {
        if ($('#h3' + pos).length) {
            $('#h3' + pos).removeClass('hide');
            $('#h3' + pos).animo({
                animation: 'rubberBand',
                duration: 1,
                timing: "easy-in"
            }, function() {
                animateAllH3(pos + 1, callback);
            });
        } else {
            callback();
        }
    }
});
