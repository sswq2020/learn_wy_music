<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
    <div class="header">
      <h1 class="title">添加歌曲到列表</h1>
      <div class="close" @click="hide"><i class="icon-close"></i></div>
    </div>
    <div class="search-box-wrapper">
      <search-box
        ref="searchBox"
        :placeholder="'搜索歌曲'"
        @query="onQueryChange">
      </search-box>
    </div>
    <div class="shortcut" v-show="!query">
      <switches
        :currentIndex="currentIndex"
        @switch="switchItem"
        :switches="switches">
      </switches>
      <div class="list-wrap">
        <scroll ref="list" v-if="currentIndex === 0" class="list-scroll" :data="playHistroy">
          <div class="list-inner">
            <song-list :songs="playHistroy" @select="selectItem"></song-list>
          </div>
        </scroll>
      </div>
    </div>

    <div class="search-result" v-show="query">
      <suggest
        ref="suggest"
        :query="query"
        :showSinger="showSinger"
        @select="selectSuggest"
        @listScroll="blurInput">
      </suggest>
    </div>
  </div>
  </transition>

</template>


<script type="text/ecmascript-6">
 import {mapGetters, mapActions} from 'vuex'
 import SearchBox from 'base/search-box/search-box.vue'
 import Suggest from 'components/suggest/suggest.vue'
 import {searchMixin} from 'common/js/mixin'
 import Switches from 'base/switches/switches.vue'
 import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
 export default {
     mixins: [searchMixin],
     // 下面代码中大量没有定义的变量或者方法都是基于mixins,所以找不到定义去mixins里找
     data() {
         return {
             showFlag: false,
             showSinger: false,
             currentIndex: 0,
             switches: [
                 {name: '最近播放'},
                 {name: '搜索历史'}
             ]

         }
     },
     computed: {
         ...mapGetters([
             'playHistroy'
         ])
     },
     methods: {
         ...mapActions([
             'savePlayHistory'
         ]),
         show() {
             this.showFlag = true
             setTimeout(() => {
                 this.$refs.list.refresh()
             }, 20)
         },
         hide() {
             this.showFlag = false
         },
         selectSuggest() {
             this.saveSearchHistory(this.query)
         },
         switchItem(index) {
             this.currentIndex = index
         },
         selectItem(item, index) {
             if (index === 0) {
                 return
             }
             this.savePlayHistory(item)
         }
     },
     components: {
         SearchBox,
         Suggest,
         Switches,
         Scroll,
         SongList
     }

 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .add-song
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background
    &.slide-enter-active,&.slide-leave-active
      transition all .3s
    &.slide-enter,&.slide-leave-to
      transform translate3d(100%,0,0)
    .header
      position relative
      height 44px
      text-align center
      .title
        line-height 44px
        font-size $font-size-large
        color $color-text
      .close
        position absolute
        top 0
        right 8px
        .icon-close
          display block
          padding 12px
          font-size $font-size-large-w
          color $color-theme
    .search-box-wrapper
      margin 20px
    .shortcut
      .list-wrap
        position absolute
        top 165px
        bottom 0
        width 100%
        .list-scroll
          height 100%
          overflow hidden
          .list-inner
            padding 20px 30px
    .search-result
      position fixed
      top 124px
      bottom 0
      width 100%
    .top-tip
      position fixed
      top 0
      width 100%
      z-index 500
      background #666
</style>
