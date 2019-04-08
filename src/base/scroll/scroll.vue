<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
      props: {
          probeType: {
              type: Number,
              default: 1
          },
          click: {
              type: Boolean,
              default: true
          },
          data: {
              type: Array, // BetterScroll在数据[主要是数组]变化时需要refresh
              default: null
          },
          listenScroll: {
              type: Boolean,
              default: false
          },
          pullup: {
              type: Boolean,
              default: false
          },
          beforeScroll: {
              type: Boolean,
              default: false
          },
          refreshDelay: {
              type: Number,
              default: 20
          }

      },
      mounted() {
          setTimeout(() => {
              this._initScroll()
          }, 20)
      },
      methods: {
          _initScroll() {
              let this_ = this
              if (!this.$refs.wrapper) return
              this.scroll = new BScroll(this.$refs.wrapper, {
                  probeType: this.probeType,
                  click: this.click
              })
              if (this.listenScroll) {
                  this_.scroll.on('scroll', (pos) => {
                      this_.$emit('scroll', pos)
                  })
              }
              if (this.pullup) {
                  this_.scroll.on('scrollEnd', () => { // 滚动停止
                      if (this_.scroll.y <= (this_.scroll.maxScrollY + 50)) {
                          this_.$emit('scrollToEnd') // 滚动条到底部
                      }
                  })
              }
              if (this.beforeScroll) {
                  this_.scroll.on('beforeScroll', () => {
                      this._$emit('beforeScroll')
                  })
              }
          },
          enable() {
              this.scroll && this.scroll.enable()
          },
          disable() {
              this.scroll && this.scroll.disable()
          },
          refresh() {
              this.scroll && this.scroll.refresh()
          },
          scrollTo() {
              this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
          },
          scrollToElement() {
              this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
          }
      },
      watch: {
          data() {
              setTimeout(() => {
                  this.refresh()
              }, this.refreshDelay)
          }
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>


