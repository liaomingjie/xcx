import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  // getPhone(event){
  //   // 通过event.target.id我们可以获取到当前这个元素的id值
  //   // 通过event.target.dataset.id我们可以获取当前这个元素的data-id的值
  //   // let phone = event.target.id
  //   // let phone1 = event.target.dataset.id
  //   // console.log(phone)
  //   // console.log(phone1)
  //   // 通过event.detail.value拿到input输入的值
  //   // console.log(event.detail.value)
  //   this.setData({
  //     phone:event.detail.value
  //   })
  // },

  // getPassword(event){
  //   this.setData({
  //     password:event.detail.value
  //   })
  // },
  // 把上面的两个函数合并写为一个函数处理
  // 需要用到标识数据 id
  handlerInput(event){
    let type = event.target.id
    this.setData({
      [type]:event.detail.value
    })
  },
  // 点击登录逻辑
  async login(){
    let {phone,password} = this.data
    if(!/^1[3-9]\d{9}$/.test(phone)){
      wx.showToast({
        title: '手机号码不合法！！！',
      })
      return 
    }

    if(!/^\w{6,20}$/.test(password)){
      wx.showToast({
        title: '密码不合法！！！',
      })
      return
    }

    // 发请求
    const result = await request('/login/cellphone',{phone,password,isLogin:true})
    if(result.code === 200){
      console.log(result)
      // 想办法把用户信息result.profile传递到个人中心去展示
      // 1、先把用户信息保存在storage里面,对象不需要转json串
      wx.setStorageSync('userInfo_key', result.profile)
      // 2、再跳转到个人中心页面
      wx.reLaunch({
        url: '/pages/center/center',
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号码有误！！！',
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码有误！！！',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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