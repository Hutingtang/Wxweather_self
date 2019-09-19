/**
 * 获取星期几
 */
export let oneDay = (year, month, date) => {
  let myDate = new Date();
  myDate.setFullYear(year, month, date);
  let week = myDate.getDay()
  switch (week) {
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
  }
}

export let lifestyleText = (data) => {
  let obj = {};
  switch (data.type) {
    case "comf":
      return obj = {
        name:'舒适度指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "cw":
      return obj = {
        name:'洗车指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "drsg":
      return obj = {
        name:'穿衣指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "flu":
      return obj = {
        name:'感冒指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "sport":
      return obj = {
        name:'运动指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "trav":
      return obj = {
        name:'旅游指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "uv":
      return obj = {
        name:'紫外线指数',
        brf: data.brf,
        txt: data.txt
      }
      break
    case "air":
      return obj = {
        name:'空气指数',
        brf: data.brf,
        txt: data.txt
      }
      break
  }
}