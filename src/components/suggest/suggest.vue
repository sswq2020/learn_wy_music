<template>
  <scroll class="suggest"
          ref="suggest"
          :data="result"
          :pullup="true"
          :beforeScroll="true"
          @beforeScroll="listScroll"
          @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li @click.stop="selectItem(item)" class="suggest-item" v-for= "item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <div class="loadingwrap" v-show="hasMore">
          <loading :title="''"></loading>
      </div>
    </ul>
    <div class="no-result-wrapper" v-show="hasMore && !result.length">
      <no-result title="抱歉,暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue'
import NoResult from 'base/no-result/no-result.vue'
import loading from 'base/loading/loading'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song.js'
import {getIncludeUrlSongList} from 'common/js/util.js'
import Singer from 'common/js/singer.js'
import {mapMutations, mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
    name: 'suggest',
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: [],
            hasMore: true,
            beforeScroll: true
        }
    },
    components: {
        scroll: Scroll,
        loading: loading,
        NoResult: NoResult
    },

    methods: {
        async _search() {
            this.hasMore = true
            this.$refs.suggest.scrollTo(0, 0) // 一个使用场景是这样,输入一个字符后,不停的下拉,结果再输入一个，希望回到开始的位置
            this.page = 1
            const res = await search(this.query, this.page, this.showSinger, perpage)
            if (res.code === ERR_OK) {
                this.result = await this._getResult(res.data)
                this._checkMore(res.data)
            }
        },
        async searchMore() {
            if (!this.hasMore) return
            this.page++
            const res = await search(this.query, this.page, this.showSinger, perpage)
            if (res.code === ERR_OK) {
                let list = await getIncludeUrlSongList(res.data.song.list)
                this.result = this.result.concat(this._normalizeSongs(list)) // 这里不需要歌手了
                this._checkMore(res.data)
            }
        },
        async _getResult(data) {
            let ret = []
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // =>Object.assign({},data.zhida,{type:TYPE_SINGER})
            }
            if (data.song) {
                let list = await getIncludeUrlSongList(data.song.list)
                ret = ret.concat(this._normalizeSongs(list)) // 如果使用ret = [...ret,...data.song.list]也行,但是多一步解构，不如直接添加方便
            }
            return ret
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach((list) => {
                if (list.songid && list.albumid) {
                    ret.push(createSong(list))
                }
            })
            return ret
        },
        getIconCls(item) {
            return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
        },
        getDisplayName(item) {
            return item.type === TYPE_SINGER ? `${item.singername}` : `${item.name}-${item.singer}`
        },
        listScroll() {
            this.$emit('listScroll')
        },
        _checkMore(data) {
            const {curnum, curpage, list, totalnum} = data.song
            if (!list.length || (curnum + curpage * perpage) >= totalnum) {
                this.hasMore = false
            } else {
                this.hasMore = true
            }
        },
        ...mapMutations({
            setSinger: 'SET_SINGER' // 相当于映射this.$store.commit('SET_SINGER',payload)
        }),
        ...mapActions([
            'insertSong'
        ]),
        selectItem(item) {
            if (item.type === TYPE_SINGER) {
                const singer = new Singer(item.singermid, item.singername)
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            } else {
                this.insertSong(item)
            }
            this.$emit('select')
        },
        refresh() {
            this.$refs.suggest.refresh()
        }

    },
    watch: {
        query(newQuery, oldQuery) {
            if (!newQuery) return
            if (newQuery === oldQuery) return
            this._search()
        }
    }
}
</script>

<style lang="stylus">
 @import "~common/stylus/variable"
 @import "~common/stylus/mixin"
   .suggest
     height 100%
     overflow hidden
     .suggest-list
       padding 0 30px
       .suggest-item
         display flex
         align-items center
         padding-bottom 20px
         .icon
           flex 0 0 30px
           width 30px
         .name
           flex 1
           font-size $font-size-medium
           color $color-text-m
           overflow hidden
           .text
             text-overflow ellipsis
             overflow hidden
             white-space nowrap
     .no-result-wrapper
       position absolute
       width 100%
       top 50%
       transform translateY(-50%)
</style>

