<template>
    <transition name="slide">
      <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import { ERR_OK } from 'api/config'
import {getSongList} from 'api/recommend'
import {createSong} from 'common/js/song.js'
import {getIncludeUrlSongList} from 'common/js/util.js'
import musicList from 'components/music-list/music-list.vue'
export default {
    name: 'disc',
    data() {
        return {
            songs: []
        }
    },
    created() {
        this._getSongList()
    },
    computed: {
        title() {
            return this.disc.dissname
        },
        bgImage() {
            return this.disc.imgurl
        },
        ...mapGetters([
            'disc'
        ])
    },
    methods: {
        async _getSongList() {
            if (!this.disc.dissid) {
                this.$router.push('/recommend')
            }
            const res = await getSongList(this.disc.dissid)
            if (res.code === ERR_OK) {
                let list = await getIncludeUrlSongList(res.cdlist[0].songlist)
                this.songs = this._noramlizeSongs(list)
            }
        },
        _noramlizeSongs(list) {
            let ret = []
            list.forEach(item => {
                if (item.albummid && item.songid && item.url.indexOf('vkey') > -1) {
                    ret.push(createSong(item))
                }
            })
            return ret
        }
    },
    components: {
        MusicList: musicList
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slide-enter-active,.slide-leave-active
    transition:all 0.3s
  .slide-enter, .slide-leave-to
    transform:translate3d(100%,0,0)
</style>

