<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">QQ Music</h1>
        <div class="mine">
            <i class="icon-mine"></i>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    .icon
      display: inline-block
      vertical-align: top
      margin: 6px 9px 0 0
      width: 30px
      height: 32px
      bg-image('logo')
      background-size:30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block;
        padding: 12px
        font-size: $font-size-small
        color: $color-theme
</style>