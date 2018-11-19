<template>
  <div class="rank">
    <scroll ref="" class="toplist">
      <ul>
        <li class="item">
          <div class="icon">
            <img src="" height="100" width="100">
          </div>
          <ul class="songlist">
            <li class="song">
              <span></span>
              <span></span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
export default {
    components: {
        scroll: Scroll
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0
      padding-top 20px
      height 100px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $color-highlight-background
        color $color-background-d
        font-size $font-size-small
        .song
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          line-height 26px

</style>
