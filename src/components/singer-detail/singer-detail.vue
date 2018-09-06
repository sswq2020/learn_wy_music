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
    name: 'singer-detail',
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
                console.log(this.songs)
            }
        },
        _noramlizeSongs(list) {
            let ret = []
            list.forEach(item => {
                let {musicData} = item
                if (musicData.albummid && musicData.songid) {
                    ret.push(createSong(musicData))
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

  .singer-detail
    position:fixed
    z-index:100
    top:0
    left:0
    right:0
    bottom:0
    background:$color-background
  .slide-enter-active,.slide-leave-active
    transition:all 0.3s
  .slide-enter, .slide-leave-to
    transform:translate3d(100%,0,0)
</style>

