<template>
  <div class="singer" ref="singer">
      <listview :data="singers" @select="selectSinger" ref="listview"></listview>
      <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer.js'
import listview from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
    mixins: [playlistMixin],
    data () {
        return {
            singers: []
        }
    },
    created() {
        this._getSingerList()
    },
    methods: {
        ...mapMutations({
            setSinger: 'SET_SINGER' // 相当于映射this.$store.commit('SET_SINGER',payload)
        }),
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        async _getSingerList() {
            const res = await getSingerList()
            if (res.code === ERR_OK) {
                this.singers = this._normalizeSinger(res.data.list)
            }
        },
        _normalizeSinger(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
                    map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
                }
                const key = item.Findex
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }
                map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
            })
            let hot = []
            let ret = []
            for (let key in map) {
                let val = map[key]
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                } else if (val.title === HOT_NAME) {
                    hot.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return [...hot, ...ret]
        },
        hanlePlaylist() {
            const bottom = this.playlist.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.listview.refresh()
        }
    },
    components: {
        listview: listview
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
    .singer
      position:fixed
      top: 88px
      bottom: 0
      width: 100%
</style>
