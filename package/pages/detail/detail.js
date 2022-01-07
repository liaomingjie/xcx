import request from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    songId:'',
    songDetail:{},
    songUrl:'',
    startTime:'00:00',
    endTime:'00:00',
    width:''
  },

  // 点击播放按钮
  handleMusicPlay(){
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    this.playOrPauseMusic()
  },

  // 控制音乐的播放和暂停
  playOrPauseMusic(){
    let isPlay = this.data.isPlay
    if(isPlay){
      this.player.play()
    }else{
      this.player.pause()
    }
  },


  // 根据歌曲的id请求获取歌曲的详情
  async getSongDetail(){
    const result = await request('/song/detail',{ids:this.data.songId})
    if(result.code === 200){
      console.log(result)
      this.setData({
        songDetail:{
          name:result.songs[0].name,
          picUrl:result.songs[0].al.picUrl
        }
      })

      // 动态设置navBar头部的歌曲名称
      wx.setNavigationBarTitle({
        title: this.data.songDetail.name,
      })
    }
  },


  // 根据歌曲的id获取歌曲的播放地址
  async getSongUrl(){
    const result = await request('/song/url',{id:this.data.songId})
    if(result.code === 200){
      // console.log(result)
      this.setData({
        songUrl:result.data[0].url
      })
    }
  },

  // 点击上一曲和下一曲
  handleSwitch(event){
    let type = event.target.id
    PubSub.publish('songType',type)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // console.log(options)
    // 刚跳转过来，保存歌曲的id
    this.setData({
      songId:options.songId,
      isPlay:true
    })
    // 保存完id之后发请求获取歌曲详情
    await this.getSongDetail()
    // 获取到歌曲的详情之后，再去获取歌曲的播放地址
    await this.getSongUrl()

    // 自动播放音乐
    this.player = wx.getBackgroundAudioManager()
    this.player.src = this.data.songUrl
    this.player.title = this.data.songDetail.name


    // 监听系统播放器的播放状态
    this.player.onPlay(() => {
      this.setData({
        isPlay:true
      })
    })

    // 监听系统播放器的暂停状态
    this.player.onPause(() => {
      this.setData({
        isPlay:false
      })
    })

    // 歌曲播放完成自动播放下一曲
    this.player.onEnded(() => {
      PubSub.publish('songType','next')
    })


    // 监听音乐的播放进度
    this.player.onTimeUpdate(() => {
      // console.log(this.player.currentTime,this.player.duration)
      let startTime = moment(this.player.currentTime * 1000).format('mm:ss')
      let endTime = moment(this.player.duration * 1000).format('mm:ss')

      let width = this.player.currentTime * 450 / this.player.duration + 'rpx'

      this.setData({
        startTime,
        endTime,
        width
      })
    })


    // 订阅
    PubSub.subscribe('songId',async (msg,songId) => {
      this.setData({
        songId:songId,
        isPlay:true
      })
      // 保存完id之后发请求获取歌曲详情
      await this.getSongDetail()
      // 获取到歌曲的详情之后，再去获取歌曲的播放地址
      await this.getSongUrl()
  
      // 自动播放音乐
      this.player = wx.getBackgroundAudioManager()
      this.player.src = this.data.songUrl
      this.player.title = this.data.songDetail.name
    })
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