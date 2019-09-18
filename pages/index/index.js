const app = getApp()
import {
    getLiveWeather,
    getHourlyWeather,
    getNextWeather
} from '../../utils/api'

import {
    oneDay
} from '../../utils/util'
//Page Object
Page({
    data: {
        curLocation: '沙坪坝',
        tmp: 20,
        fl: 18,
        latitude: 0, //经度
        longitude: 0, //维度
        cond_txt: '晴',
        today_weekend: '星期三',
        tmp_max: 0, //今日最高温度
        tmp_min: 0, //今日最低温度
        daily_hour_arr: [], //今日小时天气
        next_tmp_arr: [], //后面的天气预报
        imageSrc:`https://cdn.heweather.com/cond_icon/100.png`,
    },
    onLoad() {
        this.initPosition()
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
    }
});