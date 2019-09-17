const app = getApp()
import {
    getLiveWeather
} from '../../utils/api'
//Page Object
Page({
    data: {
        curLocation: '沙坪坝',
        tmp: 20,
        fl: 18,
        latitude: 0, //经度
        longitude: 0, //维度
        cond_txt: '晴'
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
     * todo 获取实况天气
     */
    liveWeather(result = {}) {
        getLiveWeather(result, data => {
            let {
                tmp,
                fl,
                cond_txt,
            } = data.data.HeWeather6[0].now || {}
            let {
                location
            } = data.data.HeWeather6[0].basic || {};
            let curLocation = `${location}`;
            this.setData({
                tmp,
                fl,
                cond_txt,
                curLocation
            })
            wx.hideLoading()
        })
    }
});