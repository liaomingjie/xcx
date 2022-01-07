import request from '../../utils/request'
let startY = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    recordList:[],
    translateY:'',
    transition:'',
  },
  // 处理覆盖盒子向下拖拽回弹的效果
  handlerStart(event){
    // 手指按下拿到手指的起始位置
    startY = event.changedTouches[0].clientY
    // 清除过度
    this.setData({
      transition:''
    })
  },
  handlerMove(event){
    // 手指移动拿到手指移动后结束的位置
    let endY = event.changedTouches[0].clientY
    let disY = endY - startY
    
    if(disY < 0){
      disY = 0
    }else if(disY > 300){
      disY = 300
    }

    this.setData({
      translateY:disY + 'rpx'
    })
  },
  handlerEnd(event){
    this.setData({
      translateY:0,
      // 设置过度
      transition:'transform 1s'
    })
  },

  // 点击头像去往登录页
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },


  // 获取用户的播放记录
  async getReacordList(){
    const result = await request('/user/record',{uid:this.data.userInfo.userId,type:0})
    if(result.code === 200){
      // console.log(result)
      this.setData({
        recordList: result.allData.slice(0,15).map(item => {
          return {
            id:item.song.al.id,
            songImg:item.song.al.picUrl
          }
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo_key')
    this.setData({
      userInfo
    })

    if(userInfo.nickname){
      this.getReacordList()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})