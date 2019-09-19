import config from './config'

const {
    WEATHER_API_KEY
} = config;

const weatherUrl = 'https://free-api.heweather.net/s6/weather/now';
const hourlyWeatherUrl = 'https://free-api.heweather.net/s6/weather/hourly';
const dailyWeatherUrl = 'https://free-api.heweather.net/s6/weather/forecast';
const lifeStyleUrl = 'https://free-api.heweather.net/s6/weather/lifestyle';

//获取现在天气
export let getLiveWeather = (data,success={},fail={}) => {
    let {
        latitude,
        longitude
    } = data;
    return wx.request({
        url: weatherUrl,
        data: {
            location: `${latitude},${longitude}`,
            lang: 'zh',
            unit: 'm',
            key: WEATHER_API_KEY
        },
        header: {
            'content-type': 'application/json'
        },
        success,
        fail
    });
}
// 小时天气
export let getHourlyWeather = (data,success={},fail={})=>{
    let {
        latitude,
        longitude
    } = data;
    return wx.request({
        url: hourlyWeatherUrl,
        data: {
            location: `${latitude},${longitude}`,
            lang: 'zh',
            unit: 'm',
            key: WEATHER_API_KEY
        },
        header: {
            'content-type': 'application/json'
        },
        success,
        fail
    });
}
// 接下来的天气
export let getNextWeather = (data,success={},fail={})=>{
    let {
        latitude,
        longitude
    } = data;
    return wx.request({
        url: dailyWeatherUrl,
        data: {
            location: `${latitude},${longitude}`,
            lang: 'zh',
            unit: 'm',
            key: WEATHER_API_KEY
        },
        header: {
            'content-type': 'application/json'
        },
        success,
        fail
    });
}
// 生活指数

export let getLifeStyle = (data,success={},fail={})=>{
    let {
        latitude,
        longitude
    } = data;
    return wx.request({
        url: lifeStyleUrl,
        data: {
            location: `${latitude},${longitude}`,
            lang: 'zh',
            unit: 'm',
            key: WEATHER_API_KEY
        },
        header: {
            'content-type': 'application/json'
        },
        success,
        fail
    });
}