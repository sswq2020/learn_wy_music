<template>
   <div class="slider" ref="slider">
       <div class="slider-grounp" ref="sliderGroup">
           <slot></slot>
       </div>
       <div class="dots">
           <span class="dot"
                 v-for="(item,index) in dots"
                 :key="index"
                 :class="{active: currentPageIndex===index}">
           </span>
       </div>
   </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default{
    data() {
        return {
            dots: [],
            currentPageIndex: 0
        }
    },
    props: {
        loop: {
            type: Boolean, // 循环无缝轮播
            default: true
        },
        autoPlay: {
            type: Boolean, // 自动播放
            default: true
        },
        interval: {
            type: Number, // 图片间隔时间移动,
            default: 4000
        }
    },
    methods: {
        _setSliderWidth(isResize) {
            this.sliderGroup = this.$refs.sliderGroup // 等价于document.querySelectorAll('.slider-grounp')
            this.children = this.sliderGroup.children
            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i]
                addClass(child, 'slider-item')
                child.style.width = sliderWidth + 'px'
                width += sliderWidth
            }

            if (this.loop && !isResize) {
                width = width + 2 * sliderWidth // 复制左右两个dom保证可以循环切换
            }

            this.sliderGroup.style.width = width + 'px'
        },
        _initSilder() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false, // 惯性
                'snap':
                {
                    'loop': this.loop,
                    'threshold': 0.3,
                    'speed': 400
                },
                click: true
            })
            this.slider.on('scrollEnd', () => {
                let pageIndex = this.slider.getCurrentPage().pageX
                this.currentPageIndex = pageIndex
                // 假如是自动轮播的配置,轮播一张图片后再它下一帧自动播放
                if (this.autoPlay) {
                    clearTimeout(this.timer)
                    this._play()
                }
            })
        },
        _initDots() {
            this.dots = new Array(this.children.length)
        },
        _play() {
            this.timer = setTimeout(() => { // 只轮播一次
                this.slider.next()
            }, this.interval)
        }
    },
    mounted() {
        setTimeout(() => {
            this._setSliderWidth()
            this._initDots()
            this._initSilder()
            if (this.autoPlay) {
                this._play()
            }
        }, 20)
        window.addEventListener('resize', () => {
            this._setSliderWidth(true)
            this.silder.refresh()
        })
    },
    // 组件销毁时的生命周期，销毁一下定时器，释放内存是个好的编程习惯
    destroyed() {
        clearTimeout(this.timer)
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .slider
      min-height: 1px
      .slider-grounp
        position: relative
        overflow: hidden
        white-space: nowrap
        .slider-item
          float: left
          box-sizing: border-box
          overflow: hidden
          text-align: center
          a
            display: block
            width: 100%
            overflow: hidden
            text-decoration: none
          img
            display: block
            width: 100%
      .dots
        position: absolute
        right: 0
        left: 0
        bottom: 12px
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll


</style>


