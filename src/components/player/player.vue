<template>
  <div class="player" v-show="playlist.length>0">
    <!-- <transition name="normal"> -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" >
                <img :src="currentSong.image" class="image" :class="cdCls">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">
                   {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow ==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow ==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"  @precentChange="onProgressBarChange" ></progress-bar>
            </div>
            <span class="time time-r">{{_format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <!-- changeMode和modeIcon 都是通过mixin传进来的 -->
            <div class="icon i-left" @click="changeMode">
              <div :class="modeIcon"></div>
            </div>
            <div class="icon i-left">
              <div @click="prev"  class="icon-prev" :class="disableCls"></div>
            </div>
            <div class="icon i-center" :class="disableCls">
              <div @click="togglePlaying" :class="playIcon"></div>
            </div>
            <div class="icon i-right">
              <div @click="next" class="icon-next" :class="disableCls"></div>
            </div>
            <div class="icon i-right">
              <div class="icon-not-favorite"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" :class="cdCls">
            <img :src="currentSong.image" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc"v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <div class="icon-playlist"></div>
        </div>
      </div>
    </transition>

    <playlist ref="playlist"></playlist>
    <!--在快速切换音乐,会出现加载不了src的资源,需要对audio的两个事件oncanplay和onerror进行监听-->
    <audio ref="audio"
           :src="currentSong.url"
           @ended="end"
           @timeupdate="updateTime"
           @canplay="ready"
           @error="error">
    </audio>


  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import animations from 'create-keyframe-animation' // 为什么要引入第三方的js动画库来写css3动画,因为需要实现知道动画下（x,y)坐标,但是这里是动态生成的，需要通过js获取
  import Lyric from 'lyric-parser' // 作者自己写的第三方库
  import Scroll from 'base/scroll/scroll'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import Playlist from '../playlist/playlist'
  import {playerMixin} from 'common/js/mixin'
  import { prefixStyle } from 'common/js/dom'
  import { playMode } from 'common/js/config'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  // 下面代码中大量没有定义的变量或者方法都是基于mixins,所以找不到定义去mixins里找
  export default {
      mixins: [playerMixin],
      data() {
          return {
              songReady: false, // <aduio></aduio>里监听oncanplay事件,完成后才可点击
              currentTime: 0,
              radius: 32,
              currentLyric: null,
              currentLineNum: 0,
              currentShow: 'cd',
              playingLyric: ''
          }
      },
      created() {
          this.touch = {}
      },
      computed: {
          ...mapGetters([
              'fullScreen',
              'currentIndex'
          ]),
          playIcon() {
              return this.playing ? 'icon-pause' : 'icon-play'
          },
          miniIcon() {
              return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
          },
          cdCls() {
              return this.playing ? 'play' : 'play pause'
          },
          disableCls() {
              return this.songReady ? '' : 'disable'
          },
          percent() {
              return (this.currentTime) / (this.currentSong.duration)
          }
      },
      methods: {
          ...mapMutations({
              setFullScreen: 'SET_FULL_SCREEN',
              setPlayingState: 'SET_PLAYING_STATE'
          }),
          back() {
              this.setFullScreen(false)
          },
          open() {
              this.setFullScreen(true)
          },
          enter(el, done) {
              const {x, y, scale} = this._getPosAndScale()
              let animation = {
                  0: {
                      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                  },
                  60: {
                      transform: `translate3d(0, 0, 0) scale(1.1)`
                  },
                  100: {
                      transform: `translate3d(0, 0, 0) scale(1)`
                  }
              }
              animations.registerAnimation({
                  name: 'move',
                  animation,
                  presets: {
                      duration: 400,
                      easing: 'linear'
                  }
              })
              animations.runAnimation(this.$refs.cdWrapper, 'move', done)
          },
          afterEnter() {
              animations.unregisterAnimation('move')
              this.$refs.cdWrapper.style.animation = ''
          },
          leave(el, done) {
              this.$refs.cdWrapper.style.transition = 'all 0.4s'
              const {x, y, scale} = this._getPosAndScale()
              this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
              this.$refs.cdWrapper.addEventListener('transitionend', done)
          },
          afterLeave() {
              this.$refs.cdWrapper.style.transition = ''
              this.$refs.cdWrapper.style[transform] = ''
          },
          _getPosAndScale() {
              const targetWidth = 40
              const paddingLeft = 40
              const paddingBottom = 30
              const paddingTop = 80
              const width = window.innerWidth * 0.8
              const scale = targetWidth / width
              const x = -(window.innerWidth / 2 - paddingLeft)
              const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
              return {
                  x, y, scale
              }
          },
          togglePlaying() {
              if (!this.songReady) { return }
              this.setPlayingState(!this.playing)
              this.currentLyric && this.currentLyric.togglePlay() // Lyric类提供实例方法togglePlay
          },
          next() {
              if (!this.songReady) { return }
              let index = this.currentIndex + 1 < this.playlist.length ? this.currentIndex + 1 : 0
              this.setCurrentIndex(index)
              !this.playing && this.togglePlaying() // 如果存在暂停状态,恢复播放状态
              this.songReady = false
          },
          prev() {
              if (!this.songReady) { return }
              let index = (this.currentIndex - 1 > -1) ? this.currentIndex - 1 : this.playlist.length - 1
              this.setCurrentIndex(index)
              !this.playing && this.togglePlaying()
              this.songReady = false
          },
          ready() {
              this.songReady = true
          },
          error() {
              this.songReady = true
          },
          end() {
              this.mode === playMode.loop ? this.loop() : this.next()
          },
          loop() {
              this.$refs.audio.currentTime = 0
              this.$refs.audio.play()
              this.currentLyric && this.currentLyric.seek(0) // Lyric类提供实例方法seek,歌词回到最初
          },
          /**
           * 监听<audio>的ontimeupdate事件
           * **/
          updateTime(e) {
              this.currentTime = e.target.currentTime // currentTime 属性返回视频/音频（audio/video）当前播放位置
          },
          _format(interval) {
              interval = interval | 0 // 向下取整
              const minute = interval / 60 | 0
              const second = this._pad(interval % 60)
              return `${minute}:${second}`
          },
          _pad(num, n = 2) {
              let len = num.toString().length
              while (len < n) {
                  num = '0' + num
                  len++
              }
              return num
          },
          /**
           * 监听自定义接受百分比事件,并赋值给<audio>里currentTime属性
           * **/
          onProgressBarChange(percent) {
              const currentTime = this.currentSong.duration * percent
              this.$refs.audio.currentTime = currentTime
              if (!this.playing) {
                  this.togglePlaying()
              }
              this.currentLyric && this.currentLyric.seek(currentTime * 1000)
          },
          async getLyric() {
              const lyric = await (this.currentSong._getLyric()) // _getLyric是封装Class Song创建的实例方法
              console.log('lyric' + lyric)
              this.currentLyric = new Lyric(lyric, this.handleLyric) // Lyric类第二个参数是回调函数
              if (this.playing) {
                  this.currentLyric.play() // Lyric类提供实例方法play
              }
          },
          handleLyric({lineNum, txt}) {
              this.currentLineNum = lineNum
              const scrollList = this.$refs.lyricList
              if (lineNum > 5) {
                  let lineEl = this.$refs.lyricLine[lineNum - 5]
                  scrollList.scrollToElement(lineEl, 1000) // scroll组件或者说scroll类提供的实例方法
              } else {
                  scrollList.scrollTo(0, 0, 1000)
              }
              this.playingLyric = txt
          },
          middleTouchStart(e) {
              this.touch.flag = true
              const touched = e.touches[0]
              this.touch.startX = touched.pageX
              this.touch.startY = touched.pageY
          },
          middleTouchMove(e) {
              if (!this.touch.flag) {
                  return
              }
              const touched = e.touches[0]
              const deltaX = touched.pageX - this.touch.startX
              const deltaY = touched.pageY - this.touch.startY

              if (Math.abs(deltaY) > Math.abs(deltaX)) {
                  return
              }
              const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
              const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
              this.touch.percent = Math.abs(offsetWidth) / window.innerWidth
              // DOM的操作
              const lyricListDom = this.$refs.lyricList.$el
              const middleLDom = this.$refs.middleL
              lyricListDom.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
              lyricListDom.style[transitionDuration] = 0
              middleLDom.style.opacity = 1 - this.touch.percent
              middleLDom.style[transitionDuration] = 0
          },
          middleTouchEnd() {
              let offsetWidth
              let opacity
              if (this.currentShow === 'cd') {
                  console.log('从右向左滑动' + this.touch.percent)
                  if (this.touch.percent > 0.1) {
                      offsetWidth = -window.innerWidth
                      opacity = 0
                      this.currentShow = 'lyric'
                  } else {
                      offsetWidth = 0
                      opacity = 1
                  }
              } else {
                  console.log('从左向右滑动' + this.touch.percent)
                  if (this.touch.percent < 0.9) {
                      offsetWidth = 0
                      opacity = 1
                      this.currentShow = 'cd'
                  } else {
                      opacity = 0
                      offsetWidth = -window.innerWidth
                  }
              }
              // DOM的操作
              const time = 300
              const lyricListDom = this.$refs.lyricList.$el
              const middleLDom = this.$refs.middleL
              lyricListDom.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
              lyricListDom.style[transitionDuration] = `${time}ms`
              middleLDom.style.opacity = opacity
              middleLDom.style[transitionDuration] = `${time}ms`
          },
          showPlaylist() {
              this.$refs.playlist.show()
          }
      },
      watch: {
          currentSong(newSong, oldSong) {
              if (!newSong.id) {
                  return
              }
              if (newSong.id === oldSong.id) {
                  return
              }
              if (this.currentLyric) {
                  this.currentLyric.stop() // Lyric类提供实例方法stop,销毁对象,具体要看文档
              }
              setTimeout(() => {
                  this.$refs.audio.play() // 监听currentSong变化时,audio标签没有立刻渲染,可以使用$nextClick函数，但是用setTimeout更好
                  this.getLyric()
              }, 1000) // 从20改为1000是考虑微信浏览器前后台切换的因素
          },
          playing(newPlaying) {
              const audio = this.$refs.audio // 将audio的DOM保存起来
              setTimeout(() => {
                  newPlaying ? audio.play() : audio.pause()
              }, 20)
          }
      },
      components: {
          ProgressBar,
          ProgressCircle,
          Scroll,
          Playlist
      }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 150
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity .6
      filter blur(20px)
    .top
      position relative
      margin-bottom 25px;
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
        font-size $font-size-large
        color $color-text
      .subtitle
        line-height 20px
        text-align center
        font-size: $font-size-medium
        color $color-text
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          box-sizing border-box
          height 100%
          .cd
            width 100%
            height 100%
            border-radius 50%
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              box-sizing border-box
              border-radius 50%
              border 10px solid  rgba(255, 255, 255, 0.1)
              &.play
                animation rotate 20s linear infinite
              &.pause
                animation-play-state paused
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0
          overflow hidden
          text-align center
          .playing-lyric
           height 20px
           line-height 20px
           font-size $font-size-medium
           color hsla(0,0%,100%,.5)
      .middle-r
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          margin 0 auto
          width 80%
          overflow hidden
          text-align center
          .text
            line-height 32px
            color $color-text-l
            font-size $font-size-medium
            &.current
              color $color-text

    .bottom
      position absolute
      bottom 50px
      width:100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background hsla(0,0%,100%,.5)
          &.active
            width 20px
            border-radius 5px
            background hsla(0,0%,100%,.5)
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time
          color $color-text
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.i-left
            text-align right
          &.i-center
            text-align center
            padding 0 20px
          &.i-right
            text-align  left
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top,.bottom
        transition all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
    &.normal-enter,&.normal-leave-to
      opacity 0
      .top
        transform  translate3d(0,-100px,0)
      .bottom
        transform translate3d(0,100px,0)
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition all 0.4s
    &.mini-enter,&.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      height 40px
      padding 0 10px 0 20px
      .imgWrapper
        height 100%
        width 100%
        &.play
          animation rotate 20s linear infinite
        &.pause
          animation-play-state paused
        img
         border-radius 50%
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        font-size $font-size-medium
        color $color-text
      .desc
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-d
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0
  @keyframes rotate
    0%
     transform rotate(0)
    100%
     transform rotate(360deg)

</style>
