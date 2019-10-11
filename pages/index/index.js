const app = getApp()
import {
    getLiveWeather,
    getHourlyWeather,
    getNextWeather,
    getLifeStyle
} from '../../utils/api'

import {
    oneDay,
    lifestyleText
} from '../../utils/util'
//Page Object
Page({
    data: {
        curLocation: '',
        tmp: 20,
        fl: 18,
        latitude: 0, //经度
        longitude: 0, //维度
        cond_txt: '',
        today_weekend: '',
        tmp_max: 0, //今日最高温度
        tmp_min: 0, //今日最低温度
        daily_hour_arr: [], //今日小时天气
        next_tmp_arr: [], //后面的天气预报
        imageSrc: ``,
        daily_obj: {}, //日常指数
        lifestyle: [], //生活指数
        height: '', //高度
        animationData: {}, //动画对象
    },
    onLoad() {
        this.initPosition()
        /**
         * todo 开启转发
         */
        wx.showShareMenu({
            withShareTicket: true
        })
        wx.getSystemInfo({
            success: (result) => {
                this.setData({
                    height: result.windowHeight
                })
            },
            fail: () => {},
            complete: () => {}
        });
    },
    /**
     * TODO 监听下拉刷新
     */
    onPullDownRefresh() {
        this.initPosition()
        wx.stopPullDownRefresh()
    },
    /**
     * todo 初始化地理位置
     */
    initPosition() {
        wx.showLoading({
            title: '获取地理位置中',
        })
        wx.getLocation({
            type: 'wgs84',
            altitude: false,
            success: (result) => {
                wx.hideLoading();
                this.liveWeather(result);
            },
            fail: () => {},
            complete: () => {}
        });

    },
    /***
     * TODO 获取地理位置
     */
    getPosition() {
        wx.chooseLocation({
            success: (result) => {
                let {
                    latitude,
                    longitude,
                    name
                } = result;
                this.setData({
                    latitude,
                    longitude,
                    curLocation: name
                })
                wx.showLoading({
                    title: '加载中',
                })
                this.liveWeather(result);

            },
            fail: () => {
                wx.showToast({
                    title: '选择位置失败',
                    icon: 'none',
                    duration: 1000
                })
            },
        });
    },
    /**
     * todo 获取天气
     */
    liveWeather(result = {}) {
        //实况天气
        getLiveWeather(result, data => {
            let {
                tmp,
                fl,
                cond_txt,
                cond_code
            } = data.data.HeWeather6[0].now || {}
            let {
                location
            } = data.data.HeWeather6[0].basic || {};
            let curLocation = `${location}`;
            let date = new Date();
            let today_weekend = oneDay(date.getFullYear(), date.getMonth(), date.getDate());
            let imageSrc = `https://cdn.heweather.com/cond_icon/${cond_code}.png`;
            if (cond_code) {
                this.startAnimation(); //开始动画
            }
            this.setData({
                tmp,
                fl,
                cond_txt,
                curLocation,
                today_weekend,
                imageSrc
            })
            wx.hideLoading()
        })
        //小时
        getHourlyWeather(result, data => {
            let daily_hour_arr = data.data.HeWeather6[0].hourly || [];
            daily_hour_arr.forEach((item) => {
                let time = item.time.split(' ');
                item['time'] = time[1];
            })
            this.setData({
                daily_hour_arr
            })
        })
        //多日
        getNextWeather(result, data => {
            let today_tmp_max = data.data.HeWeather6[0].daily_forecast[0].tmp_max || 0;
            let today_tmp_min = data.data.HeWeather6[0].daily_forecast[0].tmp_min || 0;
            let daily_obj = data.data.HeWeather6[0].daily_forecast[0] || {};
            this.setData({
                daily_obj
            })
            this.setData({
                tmp_max: today_tmp_max,
                tmp_min: today_tmp_min
            })
            let next_tmp_arr = data.data.HeWeather6[0].daily_forecast
            let temp_arr = next_tmp_arr.shift();
            next_tmp_arr.forEach((ele, index) => {
                if (ele.date) {
                    let date = new Date(ele.date);
                    let weekend = oneDay(date.getFullYear(), date.getMonth(), date.getDate());
                    ele["weekend"] = weekend;
                }
            })
            this.setData({
                next_tmp_arr
            })
        })
        // 生活指数
        getLifeStyle(result, data => {
            let lifestyleArr = data.data.HeWeather6[0].lifestyle || [];
            let daily_lifestyle_arr = [];
            lifestyleArr.forEach((item) => {
                daily_lifestyle_arr.push(lifestyleText(item));
            })
            this.setData({
                lifestyle: daily_lifestyle_arr
            })
        })
    },
    /**
     * TODO 开始动画，z轴旋转图片
     */
    startAnimation() {
        //step 完成一组动画
        //export 清除动画数据
        let animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease'
        })
        this.animation = animation
        animation.rotateY(360).step();
        let n = 0;
        this.setData({
            animationData: animation.export()
        })
        setInterval(function () {
            n++;
            if (n % 2 === 0) {
                animation.rotateY(360 * n).scale(1.2).step();

            } else {
                animation.rotateY(360 * n).scale(1).step();
            }
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 2000);
    }
});