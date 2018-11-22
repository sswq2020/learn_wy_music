<template>
    <transition name="slide">
      <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import { getSingerDetail } from 'api/singer'
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
        this._getDetail()
    },
    computed: {
        title() {
            return this.singer.name
        },
        bgImage() {
            return this.singer.avatar
        },
        ...mapGetters([
            'singer'
        ])
    },
    methods: {
        async _getDetail() {
            if (!this.singer.id) {
                this.$router.push('/singer')
            }
            const response = await getSingerDetail(this.singer.id)
            if (response.code === ERR_OK) {
                this.songs = this._noramlizeSongs(response.data.list)
            }
        },
        _noramlizeSongs(list) {
            let ret = []
            list.forEach(item => {
                let {musicData} = item
                if (musicData.albummid && musicData.songid) {
                    ret.push(createSong(musicData)) // 对每个song进行new Song操作创建实例
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

