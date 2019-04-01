<template>
  <ul class="switches">
    <li class="switch-item">
      <span></span>
    </li>
  </ul>
</template>

<script  type="text/ecmascript-6">
export default {
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
 @import "~common/stylus/mixin"
  .switches
    display flex
    align-items center
    width 240px
    margin 0 auto
    border 1px solid $color-highlight-background
    border-radius 5px
    .switch-item
      flex 1
      padding 8px
      text-align center
      font-size $font-size-medium
      color $color-text-m
      &.active
        background $color-highlight-background
        color $color-text
</style>
