<template>
  <div class="music-list">
    <div class="back" @click="back"><i class="icon-back"></i></div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter">
        <div class="play-wrapper">
          <div class="play" @click="random" ref="playBtn" v-show="songs.length>0">
            <div class="icon-play"></div>
            <span class="text">随机播放全部</span>
          </div>
        </div>
      </div>
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
        <song-list @select="selectItem" :rank="rank" :songs="songs "></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>

  </div>
</template>

<script  type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll.vue'
import SongList from 'base/song-list/song-list'
import loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom.js'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
    mixins: [playlistMixin],
    props: {
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            scrollY: 0
        }
    },
    methods: {
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ]),
        scroll(pos) {
            this.scrollY = pos.y
        },
        back() {
            this.$router.back()
        },
        selectItem(song, index) {
            this.selectPlay({
                list: this.songs,
                index: index
            })
        },
        random() {
            this.randomPlay({
                list: this.songs
            })
        },
        hanlePlaylist() {
            const bottom = this.playlist.length > 0 ? '60px' : ''
            this.$refs.list.$el.style.bottom = bottom
            this.$refs.list.refresh()
        }
    },
    computed: {
        bgStyle() {
            return `background-image:url(${this.bgImage}) `
        }
    },
    components: {
        Scroll,
        SongList,
        loading
    },
    created() {
        this.probeType = 3
        this.listenScroll = true
    },
    mounted() {
        console.log(this.$refs)
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeight}px`// vm.$el详细Vue实例使用的根DOM元素
    },
    watch: {
        scrollY(newY) {
            let translateY = Math.max(this.minTranslateY, newY)
            let zIndex = 0 // 图片层级
            let scale = 1 // 图片缩放
            let blur = 0 // 高斯模糊,IOS设备
            this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
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
                this.$refs.playBtn.style.display = 'none'
            } else {
                this.$refs.bgImage.style.paddingTop = '70%'
                this.$refs.bgImage.style.height = 0
                this.$refs.playBtn.style.display = 'block'
            }
            this.$refs.bgImage.style.zIndex = zIndex
            this.$refs.bgImage.style[transform] = `scale(${scale})`
            this.$refs.filter.style[backdrop] = `blur(${blur})`
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
    .play-wrapper
      position:absolute
      bottom:20px
      z-index:50
      width:100%
      .play
        box-sizing:border-box
        width:135px
        padding:7px 0
        margin:0 auto
        text-align:center
        border:1px solid $color-theme
        color:$color-theme
        border-radius:100px
        font-size:0
        .icon-play
          display:inline-block
          vertical-align:middle
          margin-right:6px
          font-size:$font-size-medium-x
        .text
          display:inline-block
          vertical-align:middle
          font-size:$font-size-small
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



