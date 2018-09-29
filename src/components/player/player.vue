<template>
  <div class="player" v-show="playlist.length>0">
    <!-- <transition name="normal"> -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="currentSong.image" class="image" :class="cdCls">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <div class="middle-r"></div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper"></div>
          <div class="operators">
            <div class="icon i-left">
              <div class="icon-sequence"></div>
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
          <i :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
      </div>
    </transition>
    <!--在快速切换音乐,会出现加载不了src的资源,需要对audio的两个事件进行监听-->
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error"></audio>


  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import animations from 'create-keyframe-animation' // 为什么要引入第三方的js动画库来写css3动画,因为需要实现知道动画下（x,y)坐标,但是这里是动态生成的，需要通过js获取
  import { prefixStyle } from 'common/js/dom'
  const transform = prefixStyle('transform')
// const transitionDuration = prefixStyle('transitionDuration')
  export default {
      data() {
          return {
              songReady: false
          }
      },
      computed: {
          ...mapGetters([
              'fullScreen',
              'playlist',
              'currentSong',
              'playing',
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
          }
      },
      methods: {
          ...mapMutations(
              {
                  setFullScreen: 'SET_FULL_SCREEN',
                  setPlayingState: 'SET_PLAYING_STATE',
                  setCurrentIndex: 'SET_CURRENT_INDEX'
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
              this.setPlayingState(!this.playing)
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
          }
      },
      watch: {
          currentSong() {
              setTimeout(() => {
                  this.$refs.audio.play() // 监听currentSong变化时,audio标签没有立刻渲染,可以使用$nextClick函数，但是用setTimeout更好
              }, 20)
          },
          playing(newPlaying) {
              const audio = this.$refs.audio // 将audio的DOM保存起来
              setTimeout(() => {
                  newPlaying ? audio.play() : audio.pause()
              }, 20)
          }
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
      .middle-r
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 100%
        overflow hidden
    .bottom
      position absolute
      bottom 50px
      width:100%
      .dot-wrapper
        text-align center
        font-size 0
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
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
  @keyframes rotate
    0%
     transform rotate(0)
    100%
     transform rotate(360deg)

</style>
