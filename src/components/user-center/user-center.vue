<template>
 <transition name="slide">
  <div class="user-center">
    <div class="back" @click.stop="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches
        :currentIndex="currentIndex"
        :switches="switches">
      </switches>
    </div>
    <div class="play-btn">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <div class="list-scroll">
        <div class="list-inner">

        </div>
      </div>
    </div>
    <div class="no-result-wrapper"></div>

  </div>
 </transition>
</template>

<script type="text/ecmascript-6">
 import Switches from 'base/switches/switches.vue'
 import Scroll from 'base/scroll/scroll'
// import { ERR_OK } from 'api/config'
export default {
     data() {
         return {
             currentIndex: 0,
             switches: [
                 {name: '我喜欢的'},
                 {name: '最近听的'}
             ]
         }
     },
     methods: {
         back() {
             this.$router.back()
         }
     },
     components: {
         Switches,
         Scroll
     }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slide-enter-active,.slide-leave-active
    transition:all 0.3s
  .slide-enter, .slide-leave-to
    transform:translate3d(100%,0,0)
  .user-center
    position fixed
    top 0
    bottom 0
    z-index 100
    width 100%
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size 22px
        color $color-theme
    .switches-wrapper
      margin 10px 0 30px
    .play-btn
      box-sizing border-box
      width 135px
      padding 7px 0
      margin 0 auto
      text-align center
      border 1px solid $color-text-n
      color $color-text-n
      border-radius 100px
      font-size 0
      .icon-play
        display inline-block
        vertical-align middle
        margin-right 6px
        font-size $font-size-medium-x
      .text
        display inline-block
        vertical-align middle
        font-size $font-size-small
    .list-wrapper
      position absolute
      top 110px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
</style>
