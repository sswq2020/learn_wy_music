<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
    <div class="header">
      <h1 class="title">添加歌曲到列表</h1>
      <div class="close" @click="hide"><i class="icon-close"></i></div>
    </div>
    <div class="search-box-wrapper"></div>
    <div class="shortcut"></div>
    <div class="search-result"></div>
    <div class="search-result"></div>
  </div>
  </transition>

</template>


<script type="text/ecmascript-6">
 export default {
     data() {
         return {
             showFlag: false
         }
     },
     methods: {
         show() {
             this.showFlag = true
         },
         hide() {
             this.showFlag = false
         }

     }

 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .add-song
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background
    &.slide-enter-active,&.slide-leave-active
      transition all .3s
    &.slide-enter,&.slide-leave-to
      transform translate3d(100%,0,0)
    .header
      position relative
      height 44px
      text-align center
      .title
        line-height 44px
        font-size $font-size-large
        color $color-text
      .close
        position absolute
        top 0
        right 8px
        .icon-close
          display block
          padding 12px
          font-size $font-size-large-w
          color $color-theme
    .search-box-wrapper
      margin 20px
    .shortcut
    .search-result
      position fixed
      top 124px
      bottom 0
      width 100%
    .top-tip
      position fixed
      top 0
      width 100%
      z-index 500
      background #666
</style>
