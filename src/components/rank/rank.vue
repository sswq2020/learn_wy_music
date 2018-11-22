<template>
  <div class="rank" ref="rank">
    <scroll ref="toplist" :data="topList"  class="toplist">
      <ul>
        <li class="item" v-for="item in topList">
          <div class="icon">
            <img height="100" width="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
          <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getToplists } from 'api/rank'
import {ERR_OK} from 'api/config'
import {playlistMixin} from 'common/js/mixin'
import loading from 'base/loading/loading'
export default {
    mixins: [playlistMixin],
    components: {
        scroll: Scroll,
        loading: loading
    },
    data() {
        return {
            topList: []
        }
    },
    created() {
        this._getToplists()
    },
    methods: {
        async _getToplists() {
            const res = await getToplists()
            if (res.code === ERR_OK) {
                this.topList = res.data.topList
            }
        },
        hanlePlaylist() {
            const bottom = this.playlist.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.toplist.refresh()
        }
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 100px
        overflow hidden
        background $color-highlight-background
        color hsla(0,0%,100%,.3)
        font-size $font-size-small
        .song
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          line-height 26px
</style>
