import config from './config'

const {
    WEATHER_API_KEY
} = config;

const weatherUrl = 'https://free-api.heweather.net/s6/weather/now'

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