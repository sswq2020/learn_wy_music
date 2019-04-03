<template >
  <transiton name="drop">
    <div class="top-tip">
      <slot></slot>
    </div>
  </transiton>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
 @import "~common/stylus/mixin"
 .top-tip
   position fixed
   top 0
   width 100%
   z-index 500
   background $color-dialog-background
   &.drop-enter-active,&.drop-leave-active
     transition all .3s
   &.drop-enter,&.drop-leave-to
     transform translate3d(0,-100%,0)
</style>
