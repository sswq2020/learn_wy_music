<template >
  <transition name="drop">
    <div class="top-tip"  v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        deplay: {
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            showFlag: false
        }
    },
    methods: {
        show() {
            this.showFlag = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.hide()
            }, this.deplay)
        },
        hide() {
            this.showFlag = false
        }
    },
    destroyed() {
        clearTimeout(this.timer)
    }
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
