<template>
  <div class="progress-bar" ref="progressBar" @click.stop.prevent="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
      props: {
          percent: {
              type: Number,
              default: 0
          }
      },
      created() {
          this.touch = {} // 通过touch对象在三个监听事件中通信
      },
      methods: {
          /**
           * 触摸开始
           * @param e  DOM事件绑定obj
           * */
          progressTouchStart(e) {
              this.touch.initiated = true
              this.touch.startX = e.touches[0].pageX // W3C中,移动事件很重要常见的属性事件
              this.touch.left = this.$refs.progress.clientWidth
          },
          /**
           * 滑动过程中
           * @param e  DOM事件绑定obj
           * */
          progressTouchMove(e) {
              if (!this.touch.initiated) {
                  return
              }
              const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
              const deltaX = e.touches[0].pageX - this.touch.startX
              const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
              this._offset(offsetWidth)
          },
          /**
           * 触摸结束
           * @param e  DOM事件绑定obj
           * */
          progressTouchEnd(e) {
              this.touch.initiated = false
              this._triggerPercent()
          },
          _offset(offsetWidth) {
              this.$refs.progress.style.width = `${offsetWidth}px`
              this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
          },
          // 派发事件
          _triggerPercent() {
              const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
              const percent = this.$refs.progress.clientWidth / barWidth
              this.$emit('precentChange', percent)
          },
          progressClick(e) {
              const offsetWidth = e.offsetX
              this._offset(offsetWidth)
              this._triggerPercent()
          }

      },
      watch: {
          percent(newPercent) {
              if (newPercent >= 0 && !this.touch.initiated) { // 当触摸滑动和父级派发percent同时存在时,优先触摸滑动
                  const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                  const offsetWidth = newPercent * barWidth
                  this._offset(offsetWidth)
              }
          }
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background $color-background-d
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>

