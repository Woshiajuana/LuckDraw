/**
 * Created by 2144 on 2017/2/13.
 * ajuanLuckDraw-1.0.js版本
 * author：ChenZhigang
 * email：zhigang.chen@owulia.com
 * personal：http://www.owulia.com
 * github: https://github.com/Woshiajuana
 * company：http://www.2144.cn
 * 功能：
 *     图片轮播，兼容各大IE浏览器，原生js编写（在使用_a库的情况下）
 * 特别说明：
 *     _a对象，全名是Ajuan，是本人写的一个仿zepto的精简js库，如果在引用了该库的前提下，
 *     会优先使用该库，如果没有该库，则会使用jquery，没有jquery则会使用zepto库。
 * ajuanLuckDraw-1.0.js库：
 *     github: https://github.com/Woshiajuana/LuckDraw
 * Ajuan.js库：
 *     github: https://github.com/Woshiajuana/Ajuan
 */
;(function (win,doc,_a,undefined) {
    var option,                     //变量用于配置参数
        DEFAULT = {                 //默认配置参数
            index: 1,               //当前转动位置，初始化为0
            count:'',               //总共有多少个位置，这个默认是当前子个数
            sonName:'.luck-item',   //子个数的名称，可以填元素标签名或class类名，默认是'.luck-item'
            speed:200,              //初始转动速度
            cycle: 50,              //转动基本次数：即至少需要转动多少次再进入抽奖环节
            active:'active',        //滚动到的样式
            prize:'',               //中奖号
            attr:'data-id',         //中奖对应的属性名
            isAllSonForEle:true     //所有的元素参数名称是否属于主体DOM的子元素，默认为true
        };
    //构造函数
    function AjuanLuckDraw(ele,opt){
        option = opt || DEFAULT;
        this.boxEle = _a(ele);                                                      //主体元素
        this.index = option.index || DEFAULT.index;                                 //当前转动位置，初始化为0
        this.count = option.count;                                                  //总共有多少个位置，这个默认是当前子个数
        this.sonName = option.sonName || DEFAULT.sonName;                           //子个数的名称，可以填元素标签名或class类名，默认是'.luck-item'
        this.speed = option.speed || DEFAULT.speed;                                 //初始转动速度
        this.cycle = option.cycle || DEFAULT.cycle;                                 //转动基本次数：即至少需要转动多少次再进入抽奖环节
        this.active = option.active || DEFAULT.active;                              //选中样式
        this.attr = option.attr || DEFAULT.attr;                                    //中奖对应的属性名
        this.isAllSonForEle = option.isAllSonForEle || DEFAULT.isAllSonForEle;      //所以用到的元素是否是主体元素的子元素
        this.callback = option.callback;                                            //回调函数
    }
    //原型
    AjuanLuckDraw.prototype = {
        //初始化函数
        init: function () {
            achieveData(this);  //获取数据
            return this;
        },
        //开始函数，num是停在哪个位置上
        start: function (num) {
            start(this,num);
            return this;
        }
    };
    //开始转动
    function start(that,num){
        if(that.status) return;
        that.status = true;
        that.times = 0;                                 //初始化次数
        that.speed = that.initialSpeed;                 //初始化速度
        setPrizeId(that,num);                           //设置中奖ID
        autoRoll(that,num);                             //循环转动
    }
    //转动一次的方法
    function rollFun(that){
        var itemEle = _a(that.sonName + '-' + that.index);
        itemEle[0] && itemEle.removeClass(that.active);
        that.index++;
        if(that.index > that.count) that.index = that.initial;
        _a(that.sonName + '-' + that.index).addClass(that.active);
    }
    //循环转动
    function autoRoll(that,num){
        that.times++;
        rollFun(that);
        if(that.times > that.cycle + 10 && that.index == that.prize){
            if(that.timer) clearTimeout(that.timer);
            that.callback && that.callback();
            that.status = false;
        }else{
            if(that.times <= that.cycle){
                that.speed -= 10;
            }else{
                if (that.times > that.cycle + 10) {
                    that.speed += 110;
                } else {
                    that.speed += 20;
                }
            }
            if(that.speed < 40){
                that.speed = 40;
            }
            that.timer = setTimeout(autoRoll,that.speed,that,num);
        }
    }
    //设置中奖号码
    function setPrizeId(that,num){
        that.sonEleArr.each(function (index, item) {
            var attr = item.getAttribute(that.attr);
            if(attr){
                attr = attr.split('-');
                if(attr[1] == num)
                    that.prize = attr[0];
            }
        });
    }
    //获取数据
    function achieveData(that){
        //获取总元素
        that.sonEleArr = that.isAllSonForEle ? that.boxEle.find(that.sonName) : _a(that.sonName);
        //获取总个数
        that.count = that.count || that.sonEleArr.length;
        //记录初始位置
        that.initial = that.index;
        //纪录初始速度
        that.initialSpeed = that.speed;
    }
    //判断是否为amd，并且把AjuanLuckDraw暴露出去
    if(typeof define === 'function' && define.amd){
        define('AjuanLuckDraw',[],function(){return AjuanLuckDraw});
    }else{
        //绑定AjuanLuckDraw
        _a.fn.AjuanLuckDraw = function(options){
            var list = [];
            this.each(function(i, me){
                list.push(new AjuanLuckDraw(me, options).init());
            });
            return list;
        };
    }
})(this,document,window.Ajuan || window.jQuery || window.Zepto);