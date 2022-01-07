// 封装发送请求的函数
import config from './config'
function request(url,data={},method="GET"){
  return new Promise((resolve,reject) => {
    wx.request({
      url: config.host + url,
      method,
      data,
      header:{
        cookie:wx.getStorageSync('cookie_key')&&wx.getStorageSync('cookie_key').find(item => item.startsWith('MUSIC_U')) 
      },
      success:(res) => {
        // console.log(res)
        if(data.isLogin){
          // 再这里判断是不是登录
          // 如果是登录，需要保存cookies
          wx.setStorageSync('cookie_key', res.cookies)
        }
        resolve(res.data)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

export default request


