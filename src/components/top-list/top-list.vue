<template>
    <transition name="slide">
      <music-list :songs="songs" :rank="true" :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import { getToplistSongs } from 'api/rank'
import { ERR_OK } from 'api/config'
import {createSong} from 'common/js/song.js'
import musicList from 'components/music-list/music-list.vue'
export default {
    name: 'top-list',
    data() {
        return {
            songs: []
        }
    },
    created() {
        this._getToplistSongs()
    },
    computed: {
        title() {
            return this.toplist.topTitle
        },
        bgImage() {
            return this.toplist.picUrl
        },
        ...mapGetters([
            'toplist'
        ])
    },
    methods: {
        async _getToplistSongs() {
            if (!this.toplist.id) {
                this.$router.push('/rank')
            }
            const res = await getToplistSongs(this.toplist.id)
            if (res.code === ERR_OK) {
                this.songs = this._noramlizeSongs(res.songlist)
            }
        },
        _noramlizeSongs(list) {
            let ret = []
            list.forEach(item => {
                let {data} = item
                if (data.albummid && data.songid) {
                    ret.push(createSong(data)) // 对每个song进行new Song操作创建实例
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

