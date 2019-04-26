<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click.stop="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <Scroll ref="favoriteList" v-if="currentIndex === 0" class="list-scroll" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectFavoriteItem"></song-list>
          </div>
        </Scroll>
        <Scroll ref="songList" v-if="currentIndex === 1" class="list-scroll" :data="playHistroy" :refreshDelay="delay">
          <div class="list-inner">
            <song-list :songs="playHistroy" @select="selectItem"></song-list>
          </div>
        </Scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultInfo"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import Switches from 'base/switches/switches.vue'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import NoResult from 'base/no-result/no-result.vue'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixin'
const SWITCH_LIST = ['favoriteList', 'songList']
// import { ERR_OK } from 'api/config'
export default {
    mixins: [playlistMixin],
    data() {
        return {
            currentIndex: 0,
            delay: 100,
            switches: [{ name: '我喜欢的' }, { name: '最近听的' }]
        }
    },
    mounted() {
        setTimeout(() => {
            this.$refs[SWITCH_LIST[this.currentIndex]].refresh()
        }, 20)
    },
    computed: {
        ...mapGetters(['playHistroy', 'favoriteList']),
        noResult() {
            return this.currentIndex === 0 ? !this.favoriteList.length : !this.playHistroy.length
        },
        noResultInfo() {
            return this.currentIndex === 0 ? '暂无喜欢的歌曲哦，快来添加吧!' : '没有要播放的歌曲哦!'
        }
    },
    methods: {
        ...mapActions(['insertSong', 'randomPlay']),
        back() {
            this.$router.back()
        },
        switchItem(index) {
            this.currentIndex = index
        },
        selectItem(song, index) {
            this.insertSong(new Song(song)) // song是对象，但是缺少_getLyric方法,通过new Song(song),生成的对象有_getLyric
        },
        selectFavoriteItem(song, index) {
            this.insertSong(new Song(song))
        },
        hanlePlaylist() {
            const bottom = this.playlist.length > 0 ? '60px' : ''
            this.$refs.listWrapper.style.bottom = bottom
            this.$refs[SWITCH_LIST[this.currentIndex]] && this.$refs[SWITCH_LIST[this.currentIndex]].refresh()
        },
        random() {
            let songs = this.currentIndex === 0 ? this.favoriteList : this.playHistroy
            if (songs.length === 0) return
            songs = songs.map((song) => new Song(song))
            this.randomPlay({
                list: songs
            })
        }
    },
    components: {
        Switches,
        Scroll,
        SongList,
        NoResult
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
.user-center
  position fixed
  top 0
  bottom 0
  z-index 100
  width 100%
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size 22px
      color $color-theme
  .switches-wrapper
    margin 10px 0 30px
  .play-btn
    box-sizing border-box
    width 135px
    padding 7px 0
    margin 0 auto
    text-align center
    border 1px solid $color-text-n
    color $color-text-n
    border-radius 100px
    font-size 0
    .icon-play
      display inline-block
      vertical-align middle
      margin-right 6px
      font-size $font-size-medium-x
    .text
      display inline-block
      vertical-align middle
      font-size $font-size-small
  .list-wrapper
    position absolute
    top 110px
    bottom 0
    width 100%
    .list-scroll
      height 100%
      overflow hidden
      .list-inner
        padding 20px 30px


</style>
