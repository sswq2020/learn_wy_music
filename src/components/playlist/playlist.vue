<template>
  <transition name="list-fade">
    <div class="playlist">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear"></span>
          </h1>
        </div>
        <div class="list-content">
          <ul>
            <li class="item">
              <i class="icon-play"></i>
              <span class="text"></span>
              <span class="like"></span>
              <span class="delete"></span>
            </li>
          </ul>
        </div>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text"></span>
          </div>
        </div>
        <div class="list-close">
          <span>关闭</span>
        </div>
      </div>

    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
 // import { mapGetters, mapMutations } from 'vuex'
 export default {

 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
    .playlist
      position fiexed
      left 0
      right 0
      top 0
      bottom 0
      z-index 200
      background-color $color-background-d
      &.list-fade-enter-active,&.list-fade-leave-active
        transition opacity 0.3s
        .list-wrapper
          transition all 0.3s
      &.list-fade-enter,&.list-fade-leave-to
        opacity 0
        .list-wrapper
          transform translate3d(0,100%,0)
      .list-wrapper
        position absolute
        left 0
        bottom 0
        width 100%
        background-color $color-highlight-background
        .list-header
          position relative
          padding 20px 30px 10px 20px
        .list-content
          max-width 240px
          overflow hidden
          .item
            display flex
            align-items center
            height 40px
            padding 0 30px 0 20px
            overflow hidden
            .current
              flex 0 0 20px
              width 20px
              font-size $font-size-small
              color $color-theme-d
            .text
              flex 1
              font-size $font-size-medium
              color $color-text-m
              extend-click()
            .like
              position relative
              font-size $font-size-small
              color $color-theme
              margin-right 15px
            .delete
              position relative
              font-size $font-size-small
              color $color-theme
        .list-operate
          width 140px
          margin 20px auto 30px
        .list-close
          text-align center
          line-height 50px
          background-color $color-background
          font-size $font-size-medium-x
          color $color-text-n


</style>
