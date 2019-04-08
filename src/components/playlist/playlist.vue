<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{ModeText}}</span>
            <span class="clear" @click.stop="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="delay">
          <transition-group name="list" tag="ul">
            <li :key="item.id" ref="listItem" @click="selectItem(item,index)" class="item" v-for="(item,index) in sequenceList">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item,index)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到列队</span>
          </div>
        </div>
        <div class="list-close"  @click.stop="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm text="是否清空所有歌曲"
          ref="confirm"
          confirmBtnText="清空"
          @confirm="confirmClear">
      </confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
 import { mapActions } from 'vuex'
 import { playMode } from 'common/js/config'
 import {playerMixin} from 'common/js/mixin'
 import Scroll from 'base/scroll/scroll'
 import Confirm from 'base/confirm/confirm.vue'
 import AddSong from 'components/add-song/add-song.vue'
 export default {
     mixins: [playerMixin],
     // 下面代码中大量没有定义的变量或者方法都是基于mixins,所以找不到定义去mixins里找
     data() {
         return {
             showFlag: false,
             delay: 100
         }
     },
     computed: {
         ModeText() {
             return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
         }
     },
     methods: {
         ...mapActions([
             'deleteSong',
             'deleteSonglist'
         ]),
         show() {
             setTimeout(() => {
                 this.$refs.listContent.refresh()
                 this.scrollToCurrent(this.currentSong)
             }, 20)
             this.showFlag = true
         },
         hide() {
             this.showFlag = false
         },
         getCurrentIcon(item) {
             return item.id === this.currentSong.id ? 'icon-play' : ''
         },
         selectItem(item, index) {
             if (this.mode === playMode.random) {
                 index = this.playlist.findIndex((song) => {
                     return item.id === song.id
                 })
             }
             this.setCurrentIndex(index)
             this.setPlayingState(true)
         },
         deleteOne(item, index) {
             this.deleteSong(item)
             if (!this.playlist.length) {
                 this.hide()
             }
         },
         showConfirm() {
             this.$refs.confirm.show()
         },
         confirmClear() {
             this.deleteSonglist()
             this.hide()
         },
         scrollToCurrent(current) {
             const index = this.sequenceList.findIndex((song) => {
                 return current.id === song.id
             })
             this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
         },
         addSong() {
             this.$refs.addSong.show()
         }
     },
     watch: {
         currentSong(newSong, oldSong) {
             if (!this.showFlag || newSong.id === oldSong.id) {
                 return
             }
             this.scrollToCurrent(newSong)
         }
     },
     components: {
         Scroll,
         Confirm,
         AddSong
     }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
    .playlist
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 200
      background-color $color-background-d
      &.list-fade-enter-active,&.list-fade-leave-active
        transition opacity 0.3s
        .list-wrapper
          transition all 0.3s
      &.list-fade-enter,&.list-fade-leave-to
        opacity 0
        .list-wrapper
          transform translate3d(0,100%,0)
      .list-wrapper
        position absolute
        left 0
        bottom 0
        width 100%
        background-color $color-highlight-background
        .list-header
          position relative
          padding 20px 30px 10px 20px
          .title
            display flex
            align-items center
            .icon
              margin-right 10px
              font-size $font-size-large-z
              color rgba(255,205,49,.5)
            .text
              flex 1
              font-size $font-size-medium
              color $color-text-n
            .clear
              position relative
              .icon-clear
                font-size $font-size-medium
                color $color-text-m
        .list-content
          max-height 240px
          overflow hidden
          .item
            display flex
            align-items center
            height 40px
            padding 0 30px 0 20px
            &.list-enter-active,&.list-leave-active
              transition all .2s liner
            &.list-enter,&.list-leave-to
              height 0
            .current
              flex 0 0 20px
              width 20px
              font-size $font-size-small
              color $color-theme
            .text
              flex 1
              font-size $font-size-medium
              color $color-text-m
              no-wrap()
            .like
              position relative
              font-size $font-size-small
              color $color-theme
              margin-right 15px
            .delete
              position relative
              font-size $font-size-small
              color $color-theme
        .list-operate
          width 140px
          margin 20px auto 30px
          .add
            display flex
            align-items center
            padding 8px 16px
            border 1px solid $color-text-n
            border-radius 100px
            color $color-text-n
            .icon-add
              margin-right 5px
              font-size $font-size-small-s
            .text
              font-size $font-size-small
        .list-close
          text-align center
          line-height 50px
          background-color $color-background
          font-size $font-size-medium-x
          color $color-text-n
</style>
