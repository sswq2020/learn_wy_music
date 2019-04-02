<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="ShortCutWrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcutArr">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)"  class="item" v-for="item in hotkey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistroy.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistroy"
              @select="addQuery"
              @deleteHistoryOne="deleteSearchHistory">
            </search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result"ref="SearchResult" v-show="query">
      <suggest
        ref="suggest"
        @select="saveSearch"
        @listScroll="blurInput"
        :query="query">
      </suggest>
    </div>
    <confirm text="是否清空所有搜索历史"
             ref="confirm"
             confirmBtnText="清空"
             @confirm="clearSearchHistory">
    </confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box.vue'
  import Scroll from 'base/scroll/scroll.vue'
  import Confirm from 'base/confirm/confirm.vue'
  import SearchList from 'components/search-list/search-list.vue'
  import Suggest from 'components/suggest/suggest.vue'
  import {getHotKey} from 'api/search.js'
  import { ERR_OK } from 'api/config'
  import {mapActions, mapGetters} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  export default {
      mixins: [playlistMixin],
      data() {
          return {
              hotkey: [],
              query: ''
          }
      },
      components: {
          SearchBox,
          Scroll,
          Suggest,
          SearchList,
          Confirm
      },
      computed: {
          ...mapGetters([
              'searchHistroy'
          ]),
          shortcutArr() {
              return this.hotkey.concat(this.searchHistroy)
          }
      },
      created() {
          this._getHotKey()
      },
      methods: {
          ...mapActions([
              'saveSearchHistory',
              'deleteSearchHistory',
              'clearSearchHistory'
          ]),
          async _getHotKey() {
              const res = await getHotKey()
              if (res.code === ERR_OK) { this.hotkey = res.data.hotkey.slice(0, 10) }
          },
          addQuery(query) { // 直接调用子组件search-box提供的方法
              this.$refs.searchBox.setQuery(query)
          },
          onQueryChange(query) {
              this.query = query
          },
          blurInput() {
              this.$refs.searchBox.blur()
          },
          saveSearch() { // 保存的是搜索字,不是下拉展示的某一项
              this.saveSearchHistory(this.query)
          },
          showConfirm() {
              this.$refs.confirm.show()
          },
          hanlePlaylist() {
              const bottom = this.playlist.length > 0 ? '60px' : ''
              this.$refs.ShortCutWrapper.style.bottom = bottom
              this.$refs.shortcut.refresh()

              this.$refs.SearchResult.style.bottom = bottom
              this.$refs.suggest.refresh()
          }
      },
      watch: {
          query(newQuery) { // 这里query的作用就是输入字变化，带来的dom的改变
              if (!newQuery) {
                  setTimeout(() => {
                      this.$refs.shortcut.refresh()
                  }, 20)
              }
          }
      }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';
  .search
    .search-box-wrapper
      margin 20px
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0px
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-n
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background $color-highlight-background
            font-size $font-size-medium
            color $color-text-d
        .search-history
          position relative
          margin 0 20px
          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-n
            .text
              flex 1
            .clear
              extend-click()
              .icon-clear
                font-size $font-size-medium
                color $color-text-n
    .search-result
      position fixed
      top 178px
      bottom 0px
      width 100%
</style>
