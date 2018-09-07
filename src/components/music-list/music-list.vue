<template>
  <div class="music-list">
    <div class="back"><i class="icon-back"></i></div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      class="list"
      ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs "></song-list>
      </div>
    </scroll>

  </div>
</template>

<script  type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list'
const RESERVED_HEIGHT = 40
export default {
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            scrollY: 0
        }
    },
    methods: {
        scroll(pos) {
            this.scrollY = pos.y
        }
    },
    computed: {
        bgStyle() {
            return `background-image:url(${this.bgImage}) `
        }
    },
    components: {
        Scroll,
        SongList
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
    },
    mounted() {
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    watch: {
        scrollY(newY) {
            let translateY = Math.max(this.minTranslateY, newY)
            let zIndex = 0 // 图片层级
            let scale = 1 // 图片缩放
            let blur = 0 // 高斯模糊,IOS设备
            this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
            this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
            const percent = Math.abs(newY / this.minTranslateY)
            if (newY > 0) {
                scale = 1 + percent
                zIndex = 10
            } else {
                blur = Math.min(20 * percent, 20)
            }

            if (newY < this.minTranslateY) {
                zIndex = 10
                this.$refs.bgImage.style.paddingTop = 0
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
            } else {
                this.$refs.bgImage.style.paddingTop = '70%'
                this.$refs.bgImage.style.height = 0
            }
            this.$refs.bgImage.style.zIndex = zIndex
            this.$refs.bgImage.style['transform'] = `scale(${scale})`
            this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`

            this.$refs.filter.style['backdrop-filter'] = `blur(${blur})`
            this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur})`
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.music-list
  position:fixed
  top:0
  left:0
  bottom:0
  right:0
  background:$color-background
  z-index:100
  .back
    position:absolute
    top:0
    left 6px
    z-index:50
    .icon-back
     display:block
     padding:10px
     font-size:$font-size-large-x
     color:$color-theme
  .title
    position:absolute
    top:0
    left:10%
    z-index:40
    width:80%
    text-overflow:ellipsis
    overflow:hidden
    white-space:nowrap
    text-align:center
    line-height:40px
    font-size:$font-size-large
    color:$color-text

  .bg-image
    position:relative
    width:100%
    height:0
    padding-top:70%
    background-size:cover
    -webkit-transform-origin:top
    transform-origin:top
    .filter
      position:absolute
      top:0
      left:0
      width:100%
      height:100%
      background:rgba(7,17,27,.4)
  .bg-layer
    position:relative
    height:100%
    background:$color-background
  .list
    position:absolute
    top:0
    bottom:0
    width:100%
    // overflow:hidden
    background:$color-background
    .song-list-wrapper
        padding:20px 30px
</style>



